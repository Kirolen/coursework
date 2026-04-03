import { AiCharacterResult } from "../services/ai.service";

interface PromptCharacterCreateData {
  userId: string;
  inputMode: "prompt";
  rawPrompt: string;
  core: {
    name: string;
    age: number | null;
    description: string;
    appearance: string;
    traits: string[];
  };
  details: {
    role: string | null;
    genres: string[];
    abilities: string[];
    motivation: string | null;
    weaknesses: string[];
  };
  additionalAttributes: Record<string, string>;
}

export const mapAiResultToCharacterCreateData = (
  userId: string,
  prompt: string,
  aiResult: AiCharacterResult
): PromptCharacterCreateData => {
const attributesRecord: Record<string, string> = {};

for (const item of aiResult.additionalAttributes ?? []) {
  if (item.key.trim()) {
    attributesRecord[item.key] = item.value;
  }
}

  return {
    userId,
    inputMode: "prompt",
    rawPrompt: prompt,
    core: {
      name: aiResult.core.name || "Невідомий персонаж",
      age: aiResult.core.age ?? null,
      description: aiResult.core.description || prompt,
      appearance: aiResult.core.appearance || "Зовнішність не визначена",
      traits: aiResult.core.traits ?? [],
    },
    details: {
      role: aiResult.details.role ?? null,
      genres: aiResult.details.genres ?? [],
      abilities: aiResult.details.abilities ?? [],
      motivation: aiResult.details.motivation ?? null,
      weaknesses: aiResult.details.weaknesses ?? [],
    },
    additionalAttributes: attributesRecord,
  };
};