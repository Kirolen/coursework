import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";

interface JwtPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Authorization token is missing",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      res.status(500).json({
        message: "JWT_SECRET is not configured",
      });
      return;
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      res.status(401).json({
        message: "User for this token does not exist",
      });
      return;
    }

    req.user = {
      id: String(user._id),
      email: user.email,
    };

    next();
  } catch (_error) {
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};