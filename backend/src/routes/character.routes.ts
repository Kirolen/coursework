import { Router } from "express";
import {
  createCharacterController,
  createCharacterFromPromptController,
  getAllCharactersController,
  getCharacterByIdController,
  updateCharacterController,
  deleteCharacterController,
  semanticValidateCharacterController,
  getCharacterValidationsController,
  getLatestCharacterValidationController,
  generateCharacterImageController,
  getCharacterImagesController,
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
router.get("/:id/validations", getCharacterValidationsController);
router.get("/:id/validation/latest", getLatestCharacterValidationController);
router.get("/:id/images", getCharacterImagesController);

router.patch("/:id", validateBody(updateCharacterSchema), updateCharacterController);
router.delete("/:id", deleteCharacterController);
router.post("/:id/semantic-validate", semanticValidateCharacterController);
router.post("/:id/generate-image", generateCharacterImageController);

export default router;