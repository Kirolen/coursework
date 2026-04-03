import { Schema, model, Types, Document } from "mongoose";

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

export interface CharacterValidation extends Document {
  characterId: Types.ObjectId;
  schemaValid: boolean;
  completenessStatus: CompletenessStatus;
  semanticStatus: SemanticStatus;
  missingFields: string[];
  issues: ValidationIssue[];
  validatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const validationIssueSchema = new Schema<ValidationIssue>(
  {
    field: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["missing", "contradiction", "ambiguity", "logic_issue", "weak_description"],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
  },
  { _id: false }
);

const characterValidationSchema = new Schema<CharacterValidation>(
  {
    characterId: {
      type: Schema.Types.ObjectId,
      ref: "Character",
      required: true,
    },
    schemaValid: {
      type: Boolean,
      required: true,
      default: false,
    },
    completenessStatus: {
      type: String,
      enum: ["missing_required", "partial", "complete"],
      required: true,
      default: "missing_required",
    },
    semanticStatus: {
      type: String,
      enum: ["not_checked", "valid", "warning", "invalid"],
      required: true,
      default: "not_checked",
    },
    missingFields: {
      type: [String],
      required: true,
      default: [],
    },
    issues: {
      type: [validationIssueSchema],
      required: true,
      default: [],
    },
    validatedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const CharacterValidationModel = model<CharacterValidation>(
  "CharacterValidation",
  characterValidationSchema
);