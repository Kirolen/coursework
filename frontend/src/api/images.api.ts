import { apiClient } from "./axios";
import type {
  GenerateImagePayload,
  GeneratedImage,
} from "../types/image.types";

export const imagesApi = {
  async getAll(characterId: string): Promise<GeneratedImage[]> {
    const response = await apiClient.get<GeneratedImage[]>(
      `/characters/${characterId}/images`
    );

    return response.data;
  },

  async generate(
    characterId: string,
    payload: GenerateImagePayload = {}
  ): Promise<GeneratedImage> {
    const response = await apiClient.post<GeneratedImage>(
      `/characters/${characterId}/generate-image`,
      payload
    );

    return response.data;
  },
};
