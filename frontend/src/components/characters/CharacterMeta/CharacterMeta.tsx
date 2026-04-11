import type { Character } from "../../../types/character.types";
import "./CharacterMeta.css";

interface CharacterMetaProps {
  character: Character;
}

function CharacterMeta({ character }: CharacterMetaProps) {
  return (
    <div className="character-meta">
      <span className="character-meta__badge character-meta__badge--status">
        Status: {character.status}
      </span>

      <span className="character-meta__badge character-meta__badge--mode">
        Mode: {character.inputMode}
      </span>

      {character.details.role && (
        <span className="character-meta__badge character-meta__badge--role">
          Role: {character.details.role}
        </span>
      )}

      {character.core.age !== null && (
        <span className="character-meta__badge character-meta__badge--age">
          Age: {character.core.age}
        </span>
      )}
    </div>
  );
}

export default CharacterMeta;