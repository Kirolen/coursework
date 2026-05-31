import { Types } from "mongoose";
import { CharacterModel } from "../models/character.model";
import { CharacterValidationModel } from "../models/characterValidation.model";
import { generateCharacterFixSuggestion } from "./ai.service";

interface SuggestCharacterFixesInput {
  characterId: string;
  userId: string;
  instruction?: string | null;
}

const toPlainCharacterPayload = (character: unknown) => {
  const plainCharacter = JSON.parse(JSON.stringify(character)) as {
    inputMode: "builder" | "prompt";
    rawPrompt: string | null;
    core: unknown;
    details: unknown;
    additionalAttributes?: Record<string, string>;
  };

  return {
    inputMode: plainCharacter.inputMode,
    rawPrompt: plainCharacter.rawPrompt ?? null,
    core: plainCharacter.core,
    details: plainCharacter.details,
    additionalAttributes: plainCharacter.additionalAttributes ?? {},
  };
};

export const suggestCharacterFixes = async ({
  characterId,
  userId,
  instruction = null,
}: SuggestCharacterFixesInput) => {
  if (!Types.ObjectId.isValid(characterId) || !Types.ObjectId.isValid(userId)) {
    return {
      status: "character_not_found" as const,
      data: null,
    };
  }

  const character = await CharacterModel.findOne({
    _id: new Types.ObjectId(characterId),
    userId: new Types.ObjectId(userId),
  });

  if (!character) {
    return {
      status: "character_not_found" as const,
      data: null,
    };
  }

  const latestValidation = await CharacterValidationModel.findOne({
    characterId: character._id,
  }).sort({ createdAt: -1 });

  if (!latestValidation) {
    return {
      status: "validation_not_found" as const,
      data: null,
    };
  }

  const characterPayload = toPlainCharacterPayload(character.toObject());

  const suggestion = await generateCharacterFixSuggestion(
    characterPayload,
    latestValidation.issues,
    instruction
  );

  suggestion.suggestedCharacter.inputMode = characterPayload.inputMode;
  suggestion.suggestedCharacter.rawPrompt = characterPayload.rawPrompt;
  suggestion.suggestedCharacter.additionalAttributes =
    characterPayload.additionalAttributes;

  return {
    status: "ok" as const,
    data: suggestion,
  };
};
