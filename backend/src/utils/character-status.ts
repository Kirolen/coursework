type CharacterLike = {
  core?: {
    name?: string;
    description?: string;
    traits?: string[];
  };
  details?: {
    role?: string | null;
    genres?: string[];
  };
};

const isNonEmptyString = (value: unknown): boolean => {
  return typeof value === "string" && value.trim().length > 0;
};

const isNonEmptyArray = (value: unknown): boolean => {
  return Array.isArray(value) && value.length > 0;
};

export const getMissingCharacterFields = (character: CharacterLike): string[] => {
  const missingFields: string[] = [];

  if (!isNonEmptyString(character.core?.name)) {
    missingFields.push("core.name");
  }

  if (!isNonEmptyString(character.core?.description)) {
    missingFields.push("core.description");
  }

  if (!isNonEmptyArray(character.core?.traits)) {
    missingFields.push("core.traits");
  }

  if (!isNonEmptyString(character.details?.role)) {
    missingFields.push("details.role");
  }

  if (!isNonEmptyArray(character.details?.genres)) {
    missingFields.push("details.genres");
  }

  return missingFields;
};

export const calculateCharacterStatus = (
  character: CharacterLike
): "draft" | "partial" | "complete" => {
  const missingFields = getMissingCharacterFields(character);
  const totalRequiredFields = 5;
  const filledRequiredFields = totalRequiredFields - missingFields.length;

  if (filledRequiredFields === totalRequiredFields) {
    return "complete";
  }

  if (filledRequiredFields <= 1) {
    return "draft";
  }

  return "partial";
};