import { Schema, model, Types, Document } from "mongoose";

export type GeneratedImageStatus = "pending" | "success" | "failed";
export type GeneratedImageStyle =
  | "anime"
  | "realistic"
  | "dark_fantasy"
  | "cinematic"
  | "watercolor";

export interface GeneratedImage extends Document {
  characterId: Types.ObjectId;
  promptUsed: string;
  imageUrl: string;
  status: GeneratedImageStatus;
  imageStyle: GeneratedImageStyle | null;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const generatedImageSchema = new Schema<GeneratedImage>(
  {
    characterId: {
      type: Schema.Types.ObjectId,
      ref: "Character",
      required: true,
    },
    promptUsed: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      required: true,
      default: "pending",
    },
    imageStyle: {
      type: String,
      enum: ["anime", "realistic", "dark_fantasy", "cinematic", "watercolor", null],
      default: null,
    },
    errorMessage: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const GeneratedImageModel = model<GeneratedImage>(
  "GeneratedImage",
  generatedImageSchema
);
