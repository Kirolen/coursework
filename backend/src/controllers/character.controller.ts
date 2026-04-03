import { Request, Response } from "express";
import {
  createCharacter,
  getAllCharacters,
  getCharacterById,
  updateCharacterById,
  deleteCharacterById,
} from "../services/character.service";
import { createCharacterFromPrompt } from "../services/prompt-character.service";
import { runSemanticValidationByCharacterId } from "../services/semantic-validation.service";
import {
  getCharacterValidations,
  getLatestCharacterValidation,
} from "../services/validation.service";
import {
  generateImageForCharacter,
  getImagesForCharacter,
} from "../services/generated-image.service";
import { asyncHandler } from "../utils/async-handler";
import { AppError } from "../utils/app-error";

export const createCharacterController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const character = await createCharacter({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json(character);
  }
);

export const createCharacterFromPromptController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const character = await createCharacterFromPrompt({
      userId: req.user.id,
      prompt: req.body.prompt,
    });

    res.status(201).json(character);
  }
);

export const getAllCharactersController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const characters = await getAllCharacters(req.user.id);
    res.status(200).json(characters);
  }
);

export const getCharacterByIdController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const id = String(req.params.id);
    const character = await getCharacterById(id, req.user.id);

    if (!character) {
      throw new AppError("Character not found", 404);
    }

    res.status(200).json(character);
  }
);

export const updateCharacterController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const id = String(req.params.id);
    const updatedCharacter = await updateCharacterById(id, req.user.id, req.body);

    if (!updatedCharacter) {
      throw new AppError("Character not found", 404);
    }

    res.status(200).json(updatedCharacter);
  }
);

export const deleteCharacterController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const id = String(req.params.id);
    const deletedCharacter = await deleteCharacterById(id, req.user.id);

    if (!deletedCharacter) {
      throw new AppError("Character not found", 404);
    }

    res.status(200).json({
      message: "Character deleted successfully",
      character: deletedCharacter,
    });
  }
);

export const semanticValidateCharacterController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const id = String(req.params.id);
    const validation = await runSemanticValidationByCharacterId(id, req.user.id);

    if (!validation) {
      throw new AppError("Character not found", 404);
    }

    res.status(201).json(validation);
  }
);

export const getCharacterValidationsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const id = String(req.params.id);
    const validations = await getCharacterValidations(id, req.user.id);

    if (!validations) {
      throw new AppError("Character not found", 404);
    }

    res.status(200).json(validations);
  }
);

export const getLatestCharacterValidationController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const id = String(req.params.id);
    const validation = await getLatestCharacterValidation(id, req.user.id);

    if (validation === null) {
      throw new AppError("Character not found", 404);
    }

    if (!validation) {
      throw new AppError("Validation not found", 404);
    }

    res.status(200).json(validation);
  }
);

export const generateCharacterImageController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const id = String(req.params.id);
    const image = await generateImageForCharacter(id, req.user.id);

    if (!image) {
      throw new AppError("Character not found", 404);
    }

    res.status(201).json(image);
  }
);

export const getCharacterImagesController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const id = String(req.params.id);
    const images = await getImagesForCharacter(id, req.user.id);

    if (!images) {
      throw new AppError("Character not found", 404);
    }

    res.status(200).json(images);
  }
);