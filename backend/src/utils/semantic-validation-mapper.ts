import { AiSemanticValidationResult } from "../services/ai.service";

interface BuildCharacterValidationDataInput {
  characterId: string;
  schemaValid: boolean;
  completenessStatus: "missing_required" | "partial" | "complete";
  missingFields: string[];
  aiResult: AiSemanticValidationResult;
}

export const buildCharacterValidationData = ({
  characterId,
  schemaValid,
  completenessStatus,
  missingFields,
  aiResult,
}: BuildCharacterValidationDataInput) => {
  return {
    characterId,
    schemaValid,
    completenessStatus,
    semanticStatus: aiResult.semanticStatus,
    missingFields,
    issues: aiResult.issues,
    validatedAt: new Date(),
  };
};