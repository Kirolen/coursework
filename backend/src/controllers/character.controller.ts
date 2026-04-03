import { Request, Response } from "express";
import {
  createCharacter,
  getAllCharacters,
  getCharacterById,
  updateCharacterById,
  deleteCharacterById,
} from "../services/character.service";

export const createCharacterController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const character = await createCharacter(req.body);

    res.status(201).json(character);
  } catch (error) {
    console.error("Create character error:", error);
    res.status(500).json({
      message: "Failed to create character",
    });
  }
};

export const getAllCharactersController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const characters = await getAllCharacters();

    res.status(200).json(characters);
  } catch (error) {
    console.error("Get all characters error:", error);
    res.status(500).json({
      message: "Failed to fetch characters",
    });
  }
};

export const getCharacterByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const character = await getCharacterById(id);

    if (!character) {
      res.status(404).json({
        message: "Character not found",
      });
      return;
    }

    res.status(200).json(character);
  } catch (error) {
    console.error("Get character by id error:", error);
    res.status(500).json({
      message: "Failed to fetch character",
    });
  }
};

export const updateCharacterController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const updatedCharacter = await updateCharacterById(id, req.body);

    if (!updatedCharacter) {
      res.status(404).json({
        message: "Character not found",
      });
      return;
    }

    res.status(200).json(updatedCharacter);
  } catch (error) {
    console.error("Update character error:", error);
    res.status(500).json({
      message: "Failed to update character",
    });
  }
};

export const deleteCharacterController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const deletedCharacter = await deleteCharacterById(id);

    if (!deletedCharacter) {
      res.status(404).json({
        message: "Character not found",
      });
      return;
    }

    res.status(200).json({
      message: "Character deleted successfully",
      character: deletedCharacter,
    });
  } catch (error) {
    console.error("Delete character error:", error);
    res.status(500).json({
      message: "Failed to delete character",
    });
  }
};