import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUserById,
} from "../services/auth.service";

export const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await registerUser(req.body);

    res.status(201).json(result);
  } catch (error) {
    console.error("Register error:", error);

    res.status(400).json({
      message: error instanceof Error ? error.message : "Registration failed",
    });
  }
};

export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await loginUser(req.body);

    res.status(200).json(result);
  } catch (error) {
    console.error("Login error:", error);

    res.status(400).json({
      message: error instanceof Error ? error.message : "Login failed",
    });
  }
};

export const getMeController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const user = await getCurrentUserById(req.user.id);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get me error:", error);

    res.status(500).json({
      message: "Failed to get current user",
    });
  }
};