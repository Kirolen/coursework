import { Router } from "express";
import {
  createCharacterController,
  createCharacterFromPromptController,
  getAllCharactersController,
  getCharacterByIdController,
  updateCharacterController,
  deleteCharacterController,
  semanticValidateCharacterController,
} from "../controllers/character.controller";
import { validateBody } from "../middlewares/validate.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createCharacterSchema,
  createCharacterFromPromptSchema,
  updateCharacterSchema,
} from "../validators/character.validator";

const router = Router();

router.use(authMiddleware);

router.post("/", validateBody(createCharacterSchema), createCharacterController);
router.post(
  "/from-prompt",
  validateBody(createCharacterFromPromptSchema),
  createCharacterFromPromptController
);

router.get("/", getAllCharactersController);
router.get("/:id", getCharacterByIdController);
router.patch("/:id", validateBody(updateCharacterSchema), updateCharacterController);
router.delete("/:id", deleteCharacterController);
router.post("/:id/semantic-validate", semanticValidateCharacterController);

export default router;