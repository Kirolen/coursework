export type CharacterInputMode = "builder" | "prompt";
export type CharacterStatus = "draft" | "partial" | "complete" | "validated";

export interface CharacterCore {
  name: string;
  age: number | null;
  description: string;
  appearance: string;
  traits: string[];
}

export interface CharacterDetails {
  role: string | null;
  genres: string[];
  abilities: string[];
  motivation: string | null;
  weaknesses: string[];
}

export interface Character {
  _id: string;
  userId: string;
  inputMode: CharacterInputMode;
  rawPrompt: string | null;
  status: CharacterStatus;
  core: CharacterCore;
  details: CharacterDetails;
  additionalAttributes: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCharacterPayload {
  inputMode: "builder";
  rawPrompt?: string | null;
  core: {
    name: string;
    age?: number | null;
    description: string;
    appearance: string;
    traits: string[];
  };
  details?: {
    role?: string | null;
    genres?: string[];
    abilities?: string[];
    motivation?: string | null;
    weaknesses?: string[];
  };
  additionalAttributes?: Record<string, string>;
}

export interface UpdateCharacterPayload {
  inputMode?: CharacterInputMode;
  rawPrompt?: string | null;
  core?: {
    name?: string;
    age?: number | null;
    description?: string;
    appearance?: string;
    traits?: string[];
  };
  details?: {
    role?: string | null;
    genres?: string[];
    abilities?: string[];
    motivation?: string | null;
    weaknesses?: string[];
  };
  additionalAttributes?: Record<string, string>;
}

export interface CreateCharacterFromPromptPayload {
  prompt: string;
}