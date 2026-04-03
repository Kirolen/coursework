import { Router } from "express";
import {
  createCharacterController,
  getAllCharactersController,
  getCharacterByIdController,
  updateCharacterController,
  deleteCharacterController,
} from "../controllers/character.controller";
import { validateBody } from "../middlewares/validate.middleware";
import {
  createCharacterSchema,
  updateCharacterSchema,
} from "../validators/character.validator";

const router = Router();

router.post("/", validateBody(createCharacterSchema), createCharacterController);
router.get("/", getAllCharactersController);
router.get("/:id", getCharacterByIdController);
router.patch("/:id", validateBody(updateCharacterSchema), updateCharacterController);
router.delete("/:id", deleteCharacterController);

export default router;