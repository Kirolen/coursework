import { apiClient } from "./axios";
import type { CharacterValidation } from "../types/validation.types";

export const validationsApi = {
  async getAll(characterId: string): Promise<CharacterValidation[]> {
    const response = await apiClient.get<CharacterValidation[]>(
      `/characters/${characterId}/validations`
    );

    return response.data;
  },

  async getLatest(characterId: string): Promise<CharacterValidation> {
    const response = await apiClient.get<CharacterValidation>(
      `/characters/${characterId}/validation/latest`
    );

    return response.data;
  },

  async runSemanticValidation(characterId: string): Promise<CharacterValidation> {
    const response = await apiClient.post<CharacterValidation>(
      `/characters/${characterId}/semantic-validate`
    );

    return response.data;
  },
};