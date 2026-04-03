import { Character } from "../models/character.model";

export const buildCharacterImagePrompt = (character: Character): string => {
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
- visually coherent design
- cinematic lighting
- detailed face and clothing
- no text on image
- no watermark
- style should match the character genre
`.trim();
};