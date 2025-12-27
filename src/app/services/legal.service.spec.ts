import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./api/axios/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import LegalService from './legal.service';
import ApiClient from './api/axios/apiClient';
import type { Mock } from 'vitest';
import type { LegalDocument } from '../types/legal.types';

const mockApiClient = ApiClient as unknown as {
  get: Mock;
  post: Mock;
  patch: Mock;
  delete: Mock;
};

describe('Legal Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_API_URL', 'http://localhost:3000');
  });

  it('should create legal document via POST', async () => {
    const payload = {
      name: 'Términos y Condiciones',
      content: '<p>Contenido</p>',
      version: 'v1.0',
      active: true,
    };

    const mockResponse = {
      data: {
        id: 1,
        ...payload,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      },
    };

    mockApiClient.post.mockResolvedValueOnce(mockResponse as unknown);

    const res = await LegalService.createLegal(payload);

    expect(mockApiClient.post).toHaveBeenCalledWith('/api/legal', payload);
    expect(res).toEqual(mockResponse.data);
  });

  it('should get all legal documents via GET', async () => {
    const docs: LegalDocument[] = [
      {
        id: 1,
        name: 'Términos y Condiciones',
        content: '<p>Contenido</p>',
        version: 'v1.0',
        active: true,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      },
    ];

    mockApiClient.get.mockResolvedValueOnce({ data: docs } as unknown);

    const res = await LegalService.getLegals();

    expect(mockApiClient.get).toHaveBeenCalledWith('/api/legal');
    expect(res).toEqual(docs);
  });

  it('should get a legal doc by name', async () => {
    const name = 'Términos y Condiciones';
    const doc: LegalDocument = {
      id: 1,
      name,
      content: '<p>Contenido</p>',
      version: 'v1.0',
      active: true,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    };

    mockApiClient.get.mockResolvedValueOnce({ data: doc } as unknown);

    const res = await LegalService.getLegalByName(name);

    expect(mockApiClient.get).toHaveBeenCalledWith(`/api/legal/name/${encodeURIComponent(name)}`);
    expect(res).toEqual(doc);
  });

  it('should update legal doc via PATCH', async () => {
    const id = 1;
    const payload = { content: '<p>Nuevo</p>', version: 'v1.1' };
    const updated: LegalDocument = {
      id,
      name: 'Términos y Condiciones',
      content: payload.content,
      version: payload.version!,
      active: true,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-02-01T00:00:00.000Z',
    };

    mockApiClient.patch.mockResolvedValueOnce({ data: updated } as unknown);

    const res = await LegalService.updateLegal(id, payload);

    expect(mockApiClient.patch).toHaveBeenCalledWith(`/api/legal/${id}`, payload);
    expect(res).toEqual(updated);
  });

  it('should delete legal doc via DELETE', async () => {
    const id = 2;
    mockApiClient.delete.mockResolvedValueOnce({ status: 204 } as unknown);

    await LegalService.deleteLegal(id);

    expect(mockApiClient.delete).toHaveBeenCalledWith(`/api/legal/${id}`);
  });

  it('should propagate errors from API client', async () => {
    const error = new Error('Network Error');
    mockApiClient.get.mockRejectedValueOnce(error);

    await expect(LegalService.getLegals()).rejects.toThrow('Network Error');
  });
});
