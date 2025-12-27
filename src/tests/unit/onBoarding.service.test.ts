import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../app/services/api/axios/apiClient', () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

import { getOnboardingData, calculateSentDocuments, calculateSignedContract } from '../../app/services/onBoarding.service';
import ApiClient from '../../app/services/api/axios/apiClient';
import { AssetStatusType } from '../../types/onboarding';
import type { Mock } from 'vitest';
import { data } from 'react-router-dom';

const mockApiClient = ApiClient as unknown as { get: Mock; patch: Mock };

describe('Onboarding Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateSentDocuments', () => {
    it('returns true when all documents are Approved', () => {
      const data = {
        statusCardFrontFile: AssetStatusType.Approved,
        statusCardBackFile: AssetStatusType.Approved,
        statusCardFrontFaceFile: AssetStatusType.Approved,
        statusCardBackFaceFile: AssetStatusType.Approved,
        statusProfileImageFile: AssetStatusType.Approved,
      } as const;

      expect(calculateSentDocuments(data)).toBe(true);
    });

    it('returns false when any document is not Approved (including missing fields)', () => {
      const dataMissing = {
        statusCardFrontFile: AssetStatusType.Approved,
        // others missing -> default to Pending
      } as Partial<typeof data>;

      expect(calculateSentDocuments(dataMissing)).toBe(false);

      const dataRejected = {
        statusCardFrontFile: AssetStatusType.Approved,
        statusCardBackFile: AssetStatusType.Rejected,
        statusCardFrontFaceFile: AssetStatusType.Approved,
        statusCardBackFaceFile: AssetStatusType.Approved,
        statusProfileImageFile: AssetStatusType.Approved,
      } as const;

      expect(calculateSentDocuments(dataRejected)).toBe(false);
    });
  });

  describe('calculateSignedContract', () => {
    it('returns true when contract accepted and identification and sign are non-empty', () => {
      const data = {
        contractAcceptedByPerformer: true,
        identificationNumber: 'ABC123',
        sign: 'John Doe',
      } as const;

      expect(calculateSignedContract(data)).toBe(true);
    });

    it('returns false when any required field is missing, empty or whitespace', () => {
      expect(
        calculateSignedContract({ contractAcceptedByPerformer: false, identificationNumber: '123', sign: 's' })
      ).toBe(false);

      expect(
        calculateSignedContract({ contractAcceptedByPerformer: true, identificationNumber: '', sign: 's' })
      ).toBe(false);

      expect(
        calculateSignedContract({ contractAcceptedByPerformer: true, identificationNumber: '  ', sign: 's' })
      ).toBe(false);

      expect(
        calculateSignedContract({ contractAcceptedByPerformer: true, identificationNumber: '123', sign: '' })
      ).toBe(false);

      expect(
        calculateSignedContract({ contractAcceptedByPerformer: true, identificationNumber: '123', sign: '   ' })
      ).toBe(false);
    });
  });

  describe('getOnboardingData', () => {
    it('calls API and augments response with sentDocuments and signedContract', async () => {
      const mockData = {
        id: 2,
        firstName: 'Luis',
        lastName: 'Corredor',
        emailAddress: 'luis@example.com',
        nickName: 'lg',
        birthDate: '1990-01-01',
        countryCode: 'CO',
        gender: 1,
        requestDate: new Date().toISOString(),
        performerId: 2,
        studioId: 1,
        identificationNumber: '1234',
        identificationType: 'ID',
        statusCardFrontFile: AssetStatusType.Approved,
        statusCardBackFile: AssetStatusType.Approved,
        statusCardFrontFaceFile: AssetStatusType.Approved,
        statusCardBackFaceFile: AssetStatusType.Approved,
        statusProfileImageFile: AssetStatusType.Approved,
        sign: 'signed',
        requestDocuments: [],
        contractAcceptedByPerformer: true,
      } as const;

      mockApiClient.get.mockResolvedValueOnce({ data: mockData } as unknown);

      const res = await getOnboardingData(2);

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/performer/onboarding/request/2');
      expect(res.id).toBe(2);
      expect(res.sentDocuments).toBe(true);
      expect(res.signedContract).toBe(true);
    });

    it('propagates API errors', async () => {
      const mockError = new Error('Network Error');
      mockApiClient.get.mockRejectedValueOnce(mockError);

      await expect(getOnboardingData(2)).rejects.toThrow('Network Error');
    });
  });

  describe('decideOnboarding', () => {
    it('calls PATCH and returns updated data with recalculated fields', async () => {
      const mockData = {
        id: 2,
        firstName: 'Luis',
        lastName: 'Corredor',
        emailAddress: 'luis@example.com',
        nickName: 'lg',
        birthDate: '1990-01-01',
        countryCode: 'CO',
        gender: 1,
        requestDate: new Date().toISOString(),
        performerId: 2,
        studioId: 1,
        identificationNumber: '1234',
        identificationType: 'ID',
        statusCardFrontFile: AssetStatusType.Approved,
        statusCardBackFile: AssetStatusType.Approved,
        statusCardFrontFaceFile: AssetStatusType.Approved,
        statusCardBackFaceFile: AssetStatusType.Approved,
        statusProfileImageFile: AssetStatusType.Approved,
        sign: 'signed',
        requestDocuments: [],
        contractAcceptedByPerformer: true,
      } as const;

      mockApiClient.patch.mockResolvedValueOnce({ data: mockData } as unknown);

      const res = await (await import('../../app/services/onBoarding.service')).decideOnboarding(2, 2, 'Aprobado');

      expect(mockApiClient.patch).toHaveBeenCalledWith('/api/performer/onboarding/2/decision', { statusOnboarding: 2, notes: 'Aprobado' });
      expect(res.sentDocuments).toBe(true);
      expect(res.signedContract).toBe(true);
    });

    it('propagates PATCH errors', async () => {
      const mockError = new Error('Patch failed');
      mockApiClient.patch.mockRejectedValueOnce(mockError);

      await expect((await import('../../app/services/onBoarding.service')).decideOnboarding(2, 3, 'Rechazado')).rejects.toThrow('Patch failed');
    });
  });
});
