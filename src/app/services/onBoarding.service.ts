import { AssetStatusType, OnboardingData } from "../../types/onboarding";
import apiClient from "./api/axios/apiClient";




export const getOnboardingData = async (id: string | number): Promise<OnboardingData> => {
  try {
    const url = `/api/performer/onboarding/request/${id}`;
    const response = await apiClient.get<OnboardingData>(url);

    // Calculate derived fields
    const data = response.data;
    data.sentDocuments = calculateSentDocuments(data);
    data.signedContract = calculateSignedContract(data);

    return data;
  } catch (error) {
    console.error('Error fetching onboarding data:', error);
    throw error;
  }
};


/**
 * Approve or reject onboarding request by id
 */
export const decideOnboarding = async (
  id: string | number,
  statusOnboarding: number,
  notes?: string
): Promise<OnboardingData> => {
  try {
    const url = `/api/performer/onboarding/${id}/decision`;
    const payload: { statusOnboarding: number; notes?: string } = { statusOnboarding };
    if (notes) payload.notes = notes;

    const response = await apiClient.patch<OnboardingData>(url, payload);

    const data = response.data;
    // Recalculate derived fields
    data.sentDocuments = calculateSentDocuments(data);
    data.signedContract = calculateSignedContract(data);

    return data;
  } catch (error) {
    console.error('Error deciding onboarding:', error);
    throw error;
  }
};


/**
 * Calculate if all documents are sent and approved
 */
export const calculateSentDocuments = (data: Partial<OnboardingData>): boolean => {
  return (
    (data.statusCardFrontFile ?? AssetStatusType.Pending) === AssetStatusType.Approved &&
    (data.statusCardBackFile ?? AssetStatusType.Pending) === AssetStatusType.Approved &&
    (data.statusCardFrontFaceFile ?? AssetStatusType.Pending) === AssetStatusType.Approved &&
    (data.statusCardBackFaceFile ?? AssetStatusType.Pending) === AssetStatusType.Approved &&
    (data.statusProfileImageFile ?? AssetStatusType.Pending) === AssetStatusType.Approved
  );
};

/**
 * Calculate if contract is signed
 */
export const calculateSignedContract = (data: Partial<OnboardingData>): boolean => {
  return !!(
    data.contractAcceptedByPerformer &&
    data.identificationNumber &&
    data.identificationNumber.trim() !== '' &&
    data.sign &&
    data.sign.trim() !== ''
  );
};
