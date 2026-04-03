import { Types } from "mongoose";
import { CharacterModel, Character } from "../models/character.model";
import { calculateCharacterStatus } from "../utils/character-status";
import { validateCharacter } from "./validation.service";

interface CreateCharacterInput {
  userId: string;
  inputMode: "builder" | "prompt";
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

interface UpdateCharacterInput {
  inputMode?: "builder" | "prompt";
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

export const createCharacter = async (
  data: CreateCharacterInput
): Promise<Character> => {
  const preparedCharacterData = {
    userId: new Types.ObjectId(data.userId),
    inputMode: data.inputMode,
    rawPrompt: data.rawPrompt ?? null,
    core: {
      name: data.core.name,
      age: data.core.age ?? null,
      description: data.core.description,
      appearance: data.core.appearance,
      traits: data.core.traits ?? [],
    },
    details: {
      role: data.details?.role ?? null,
      genres: data.details?.genres ?? [],
      abilities: data.details?.abilities ?? [],
      motivation: data.details?.motivation ?? null,
      weaknesses: data.details?.weaknesses ?? [],
    },
    additionalAttributes: data.additionalAttributes ?? {},
  };

  const characterStatus = calculateCharacterStatus(preparedCharacterData);

  const character = await CharacterModel.create({
    ...preparedCharacterData,
    status: characterStatus,
  });

  await validateCharacter(character);

  return character;
};

export const getAllCharacters = async (): Promise<Character[]> => {
  return CharacterModel.find().sort({ createdAt: -1 });
};

export const getCharacterById = async (
  id: string
): Promise<Character | null> => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  return CharacterModel.findById(id);
};

export const updateCharacterById = async (
  id: string,
  data: UpdateCharacterInput
): Promise<Character | null> => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  const existingCharacter = await CharacterModel.findById(id);

  if (!existingCharacter) {
    return null;
  }

  if (data.inputMode !== undefined) {
    existingCharacter.inputMode = data.inputMode;
  }

  if (data.rawPrompt !== undefined) {
    existingCharacter.rawPrompt = data.rawPrompt;
  }

  if (data.core) {
    if (data.core.name !== undefined) {
      existingCharacter.core.name = data.core.name;
    }

    if (data.core.age !== undefined) {
      existingCharacter.core.age = data.core.age;
    }

    if (data.core.description !== undefined) {
      existingCharacter.core.description = data.core.description;
    }

    if (data.core.appearance !== undefined) {
      existingCharacter.core.appearance = data.core.appearance;
    }

    if (data.core.traits !== undefined) {
      existingCharacter.core.traits = data.core.traits;
    }
  }

  if (data.details) {
    if (data.details.role !== undefined) {
      existingCharacter.details.role = data.details.role;
    }

    if (data.details.genres !== undefined) {
      existingCharacter.details.genres = data.details.genres;
    }

    if (data.details.abilities !== undefined) {
      existingCharacter.details.abilities = data.details.abilities;
    }

    if (data.details.motivation !== undefined) {
      existingCharacter.details.motivation = data.details.motivation;
    }

    if (data.details.weaknesses !== undefined) {
      existingCharacter.details.weaknesses = data.details.weaknesses;
    }
  }

  if (data.additionalAttributes !== undefined) {
    existingCharacter.additionalAttributes = data.additionalAttributes;
  }

  existingCharacter.status = calculateCharacterStatus(existingCharacter);

  await existingCharacter.save();
  
  await validateCharacter(existingCharacter);

  return existingCharacter;
};

export const deleteCharacterById = async (
  id: string
): Promise<Character | null> => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  return CharacterModel.findByIdAndDelete(id);
};