import { apiClient } from "./axios";
import type {
  Character,
  CreateCharacterPayload,
  CreateCharacterFromPromptPayload,
  UpdateCharacterPayload,
} from "../types/character.types";

export const charactersApi = {
  async getAll(): Promise<Character[]> {
    const response = await apiClient.get<Character[]>("/characters");
    return response.data;
  },

  async getById(id: string): Promise<Character> {
    const response = await apiClient.get<Character>(`/characters/${id}`);
    return response.data;
  },

  async create(payload: CreateCharacterPayload): Promise<Character> {
    const response = await apiClient.post<Character>("/characters", payload);
    return response.data;
  },

  async createFromPrompt(
    payload: CreateCharacterFromPromptPayload
  ): Promise<Character> {
    const response = await apiClient.post<Character>(
      "/characters/from-prompt",
      payload
    );
    return response.data;
  },

  async update(id: string, payload: UpdateCharacterPayload): Promise<Character> {
    const response = await apiClient.patch<Character>(`/characters/${id}`, payload);
    return response.data;
  },

  async delete(id: string): Promise<{
    message: string;
    character: Character;
  }> {
    const response = await apiClient.delete<{
      message: string;
      character: Character;
    }>(`/characters/${id}`);

    return response.data;
  },
};