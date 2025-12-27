import ApiClient from './api/axios/apiClient';
import type { LegalDocument } from '../types/legal.types';

const BASE = '/api/legal';

class LegalService {
  /**
   * Create a legal document
   */
  async createLegal(
    payload: Omit<LegalDocument, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<LegalDocument> {
    try {
      const response = await ApiClient.post<LegalDocument>(BASE, payload);
      return response.data;
    } catch (error) {
      console.error('Error creating legal document:', error);
      throw error;
    }
  }

  /**
   * Get all legal documents
   */
  async getLegals(): Promise<LegalDocument[]> {
    try {
      const response = await ApiClient.get<LegalDocument[]>(BASE);
      return response.data;
    } catch (error) {
      console.error('Error fetching legal documents:', error);
      throw error;
    }
  }

  /**
   * Get a legal document by name
   */
  async getLegalByName(name: string): Promise<LegalDocument> {
    try {
      const response = await ApiClient.get<LegalDocument>(
        `${BASE}/name/${encodeURIComponent(name)}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching legal document by name (${name}):`, error);
      throw error;
    }
  }

  /**
   * Update a legal document by id
   */
  async updateLegal(id: number | string, payload: Partial<LegalDocument>): Promise<LegalDocument> {
    try {
      const response = await ApiClient.patch<LegalDocument>(`${BASE}/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating legal document ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a legal document by id
   */
  async deleteLegal(id: number | string): Promise<void> {
    try {
      await ApiClient.delete(`${BASE}/${id}`);
    } catch (error) {
      console.error(`Error deleting legal document ${id}:`, error);
      throw error;
    }
  }
}

export default new LegalService();
