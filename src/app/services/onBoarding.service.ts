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
