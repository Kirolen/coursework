import { promises as fs } from "fs";
import path from "path";
import { Types } from "mongoose";
import { CharacterModel } from "../models/character.model";
import { GeneratedImageModel } from "../models/generatedImage.model";
import { buildCharacterImagePrompt } from "../utils/image-prompt";
import { generateCharacterImage } from "./ai.service";

const GENERATED_IMAGES_DIR = path.join(process.cwd(), "generated-images");

const ensureGeneratedImagesDir = async (): Promise<void> => {
  await fs.mkdir(GENERATED_IMAGES_DIR, { recursive: true });
};

export const generateImageForCharacter = async (
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

  const promptUsed = buildCharacterImagePrompt(character);

  const pendingRecord = await GeneratedImageModel.create({
    characterId: character._id,
    promptUsed,
    imageUrl: "pending",
    status: "pending",
    errorMessage: null,
  });

  try {
    const imageBase64 = await generateCharacterImage(promptUsed);

    await ensureGeneratedImagesDir();

    const fileName = `${String(character._id)}-${Date.now()}.png`;
    const filePath = path.join(GENERATED_IMAGES_DIR, fileName);

    await fs.writeFile(filePath, Buffer.from(imageBase64, "base64"));

    const imageUrl = `/generated-images/${fileName}`;

    pendingRecord.imageUrl = imageUrl;
    pendingRecord.status = "success";
    pendingRecord.errorMessage = null;

    await pendingRecord.save();

    return pendingRecord;
  } catch (error) {
    pendingRecord.status = "failed";
    pendingRecord.errorMessage =
      error instanceof Error ? error.message : "Unknown image generation error";
    pendingRecord.imageUrl = "failed";

    await pendingRecord.save();

    throw error;
  }
};

export const getImagesForCharacter = async (
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

  return GeneratedImageModel.find({
    characterId: new Types.ObjectId(characterId),
  }).sort({ createdAt: -1 });
};