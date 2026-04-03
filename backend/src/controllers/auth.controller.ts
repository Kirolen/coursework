import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUserById,
} from "../services/auth.service";
import { asyncHandler } from "../utils/async-handler";
import { AppError } from "../utils/app-error";

export const registerController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  }
);

export const getMeController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const user = await getCurrentUserById(req.user.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json(user);
  }
);