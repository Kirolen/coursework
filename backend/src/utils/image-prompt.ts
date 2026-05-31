import { Character } from "../models/character.model";
import { GeneratedImageStyle } from "../models/generatedImage.model";

const stylePromptText: Record<GeneratedImageStyle, string> = {
  anime: "anime illustration style",
  realistic: "realistic digital portrait style",
  dark_fantasy: "dark fantasy art style",
  cinematic: "cinematic concept art style",
  watercolor: "watercolor painting style",
};

export const buildCharacterImagePrompt = (
  character: Character,
  imageStyle: GeneratedImageStyle | null = null
): string => {
  const traitsText = character.core.traits.length
    ? character.core.traits.join(", ")
    : "undefined traits";

  const genresText = character.details.genres.length
    ? character.details.genres.join(", ")
    : "fantasy";

  const abilitiesText = character.details.abilities.length
    ? character.details.abilities.join(", ")
    : "no clearly defined abilities";

  const weaknessesText = character.details.weaknesses.length
    ? character.details.weaknesses.join(", ")
    : "no clearly defined weaknesses";

  return `
Create a high-quality character portrait.

Character name: ${character.core.name}
Genre / world style: ${genresText}
Role: ${character.details.role ?? "undefined"}
Age: ${character.core.age ?? "undefined"}
Description: ${character.core.description}
Appearance: ${character.core.appearance}
Traits: ${traitsText}
Abilities: ${abilitiesText}
Weaknesses: ${weaknessesText}
Motivation: ${character.details.motivation ?? "undefined"}

Requirements:
- single character portrait
- generate exactly one image
- visually coherent design
- ${imageStyle ? `use ${stylePromptText[imageStyle]}` : "style should match the character genre"}
- cinematic lighting
- detailed face and clothing
- no text on image
- no watermark
`.trim();
};
