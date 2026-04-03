import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import { AppError } from "../utils/app-error";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

const signToken = (user: { id: string; email: string }): string => {
  const secret: Secret = process.env.JWT_SECRET as Secret;

  if (!secret) {
    throw new AppError("JWT_SECRET is not defined", 500);
  }

  const expiresIn: SignOptions["expiresIn"] =
    (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "7d";

  return jwt.sign(user, secret, { expiresIn });
};

export const registerUser = async ({ name, email, password }: RegisterInput) => {
  const existingUser = await UserModel.findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    throw new AppError("User with this email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
  });

  const token = signToken({
    id: String(user._id),
    email: user.email,
  });

  return {
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
    },
    token,
  };
};

export const loginUser = async ({ email, password }: LoginInput) => {
  const user = await UserModel.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken({
    id: String(user._id),
    email: user.email,
  });

  return {
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
    },
    token,
  };
};

export const getCurrentUserById = async (id: string) => {
  const user = await UserModel.findById(id);

  if (!user) {
    return null;
  }

  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
  };
};