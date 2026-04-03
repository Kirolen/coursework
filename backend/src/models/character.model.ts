import { Schema, model, Types, Document } from "mongoose";

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

export interface Character extends Document {
  userId: Types.ObjectId;
  inputMode: CharacterInputMode;
  rawPrompt: string | null;
  status: CharacterStatus;
  core: CharacterCore;
  details: CharacterDetails;
  additionalAttributes: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const characterCoreSchema = new Schema<CharacterCore>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      default: null,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    appearance: {
      type: String,
      required: true,
      trim: true,
    },
    traits: {
      type: [String],
      required: true,
      default: [],
    },
  },
  { _id: false }
);

const characterDetailsSchema = new Schema<CharacterDetails>(
  {
    role: {
      type: String,
      default: null,
      trim: true,
    },
    genres: {
      type: [String],
      default: [],
    },
    abilities: {
      type: [String],
      default: [],
    },
    motivation: {
      type: String,
      default: null,
      trim: true,
    },
    weaknesses: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const characterSchema = new Schema<Character>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    inputMode: {
      type: String,
      enum: ["builder", "prompt"],
      required: true,
    },
    rawPrompt: {
      type: String,
      default: null,
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "partial", "complete", "validated"],
      required: true,
      default: "draft",
    },
    core: {
      type: characterCoreSchema,
      required: true,
    },
    details: {
      type: characterDetailsSchema,
      required: true,
      default: () => ({
        role: null,
        genres: [],
        abilities: [],
        motivation: null,
        weaknesses: [],
      }),
    },
    additionalAttributes: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const CharacterModel = model<Character>("Character", characterSchema);