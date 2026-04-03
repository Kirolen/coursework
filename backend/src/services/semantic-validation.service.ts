import { Types } from "mongoose";
import { CharacterModel } from "../models/character.model";
import { CharacterValidationModel } from "../models/characterValidation.model";
import {
  calculateCharacterStatus,
  getMissingCharacterFields,
} from "../utils/character-status";
import { generateSemanticValidation } from "./ai.service";
import { buildCharacterValidationData } from "../utils/semantic-validation-mapper";

const getCompletenessStatus = (
  missingFields: string[]
): "missing_required" | "partial" | "complete" => {
  if (missingFields.length === 0) {
    return "complete";
  }

  if (missingFields.length >= 3) {
    return "missing_required";
  }

  return "partial";
};

export const runSemanticValidationByCharacterId = async (
  id: string,
  userId: string
) => {
  if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId)) {
    return null;
  }

  const character = await CharacterModel.findOne({
    _id: new Types.ObjectId(id),
    userId: new Types.ObjectId(userId),
  });

  if (!character) {
    return null;
  }

  const missingFields = getMissingCharacterFields(character);
  const schemaValid = missingFields.length === 0;
  const completenessStatus = getCompletenessStatus(missingFields);

  const aiResult = await generateSemanticValidation({
    core: character.core,
    details: character.details,
    additionalAttributes: character.additionalAttributes,
  });

  const validationData = buildCharacterValidationData({
    characterId: String(character._id),
    schemaValid,
    completenessStatus,
    missingFields,
    aiResult,
  });

  const validation = await CharacterValidationModel.create(validationData);

  const shouldMarkAsValidated =
    schemaValid &&
    completenessStatus === "complete" &&
    aiResult.semanticStatus === "valid";

  if (shouldMarkAsValidated) {
    character.status = "validated";
  } else {
    character.status = calculateCharacterStatus(character);
  }

  await character.save();

  return validation;
};