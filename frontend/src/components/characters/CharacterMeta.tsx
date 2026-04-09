import type { Character } from "../../types/character.types";

interface CharacterMetaProps {
  character: Character;
}

function CharacterMeta({ character }: CharacterMetaProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        fontSize: "14px",
        color: "#4b5563",
      }}
    >
      <span
        style={{
          padding: "6px 10px",
          borderRadius: "999px",
          background: "#eef2ff",
        }}
      >
        Status: {character.status}
      </span>

      <span
        style={{
          padding: "6px 10px",
          borderRadius: "999px",
          background: "#f3f4f6",
        }}
      >
        Mode: {character.inputMode}
      </span>

      {character.details.role && (
        <span
          style={{
            padding: "6px 10px",
            borderRadius: "999px",
            background: "#ecfeff",
          }}
        >
          Role: {character.details.role}
        </span>
      )}

      {character.core.age !== null && (
        <span
          style={{
            padding: "6px 10px",
            borderRadius: "999px",
            background: "#fef3c7",
          }}
        >
          Age: {character.core.age}
        </span>
      )}
    </div>
  );
}

export default CharacterMeta;