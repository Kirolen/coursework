import { Types } from "mongoose";
import { Character } from "../models/character.model";
import { CharacterModel } from "../models/character.model";
import { CharacterValidationModel } from "../models/characterValidation.model";
import { getMissingCharacterFields } from "../utils/character-status";

export const validateCharacter = async (character: Character) => {
  const missingFields = getMissingCharacterFields(character);

  const schemaValid = missingFields.length === 0;

  let completenessStatus: "missing_required" | "partial" | "complete";

  if (missingFields.length === 0) {
    completenessStatus = "complete";
  } else if (missingFields.length >= 3) {
    completenessStatus = "missing_required";
  } else {
    completenessStatus = "partial";
  }

  let semanticStatus: "not_checked" | "valid" | "warning" | "invalid" = "valid";

  const issues: {
    field: string;
    type: "missing" | "contradiction" | "ambiguity" | "logic_issue" | "weak_description";
    message: string;
    severity: "low" | "medium" | "high";
  }[] = [];

  for (const field of missingFields) {
    issues.push({
      field,
      type: "missing",
      message: `${field} is missing`,
      severity: "high",
    });
  }

  if (character.core.description.length < 20) {
    issues.push({
      field: "core.description",
      type: "weak_description",
      message: "Description is too short",
      severity: "medium",
    });
    semanticStatus = "warning";
  }

  if (character.core.traits.length === 0) {
    issues.push({
      field: "core.traits",
      type: "weak_description",
      message: "Traits are empty",
      severity: "medium",
    });
    semanticStatus = "warning";
  }

  if (missingFields.length >= 3) {
    semanticStatus = "invalid";
  }

  const validation = await CharacterValidationModel.create({
    characterId: character._id,
    schemaValid,
    completenessStatus,
    semanticStatus,
    missingFields,
    issues,
    validatedAt: new Date(),
  });

  return validation;
};

export const getCharacterValidations = async (
  characterId: string,
  userId: string
) => {
  if (!Types.ObjectId.isValid(characterId) || !Types.ObjectId.isValid(userId)) {
    return null;
  }

  const character = await CharacterModel.findOne({
    _id: new Types.ObjectId(characterId),
    userId: new Types.ObjectId(userId),
  });

  if (!character) {
    return null;
  }

  return CharacterValidationModel.find({
    characterId: new Types.ObjectId(characterId),
  }).sort({ createdAt: -1 });
};

export const getLatestCharacterValidation = async (
  characterId: string,
  userId: string
) => {
  if (!Types.ObjectId.isValid(characterId) || !Types.ObjectId.isValid(userId)) {
    return null;
  }

  const character = await CharacterModel.findOne({
    _id: new Types.ObjectId(characterId),
    userId: new Types.ObjectId(userId),
  });

  if (!character) {
    return null;
  }

  return CharacterValidationModel.findOne({
    characterId: new Types.ObjectId(characterId),
  }).sort({ createdAt: -1 });
};