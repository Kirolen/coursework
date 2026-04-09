export type CompletenessStatus = "missing_required" | "partial" | "complete";
export type SemanticStatus = "not_checked" | "valid" | "warning" | "invalid";
export type ValidationIssueType =
  | "missing"
  | "contradiction"
  | "ambiguity"
  | "logic_issue"
  | "weak_description";
export type ValidationIssueSeverity = "low" | "medium" | "high";

export interface ValidationIssue {
  field: string;
  type: ValidationIssueType;
  message: string;
  severity: ValidationIssueSeverity;
}

export interface CharacterValidation {
  _id: string;
  characterId: string;
  schemaValid: boolean;
  completenessStatus: CompletenessStatus;
  semanticStatus: SemanticStatus;
  missingFields: string[];
  issues: ValidationIssue[];
  validatedAt: string;
  createdAt: string;
  updatedAt: string;
}