import { createCharacter } from "./character.service";
import { generateCharacterFromPrompt } from "./ai.service";
import { mapAiResultToCharacterCreateData } from "../utils/character-ai-mapper";
import { Character } from "../models/character.model";

interface CreateCharacterFromPromptInput {
  userId: string;
  prompt: string;
}

export const createCharacterFromPrompt = async (
  data: CreateCharacterFromPromptInput
): Promise<Character> => {
  const aiResult = await generateCharacterFromPrompt(data.prompt);

  const preparedCharacterData = mapAiResultToCharacterCreateData(
    data.userId,
    data.prompt,
    aiResult
  );

  return createCharacter(preparedCharacterData);
};