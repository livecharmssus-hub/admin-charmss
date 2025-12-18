import ApiClient from './api/axios/apiClient';
import { PerformerProfile } from '../types/performers.types';

const BASE = '/api/performers';

class PerformerProfileService {
  /**
   * Obtiene el perfil completo de un performer por su ID
   * @param performerId - ID del performer
   * @returns Promise con los datos del perfil
   */
  async getPerformerProfile(performerId: string | number): Promise<PerformerProfile> {
    try {
      const response = await ApiClient.get<PerformerProfile>(`${BASE}/${performerId}/profile`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching profile for performer ${performerId}:`, error);
      throw error;
    }
  }
}

export default new PerformerProfileService();
