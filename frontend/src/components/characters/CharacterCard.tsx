import { Link } from "react-router-dom";
import type { Character } from "../../types/character.types";

interface CharacterCardProps {
  character: Character;
}

function CharacterCard({ character }: CharacterCardProps) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div>
        <h3 style={{ margin: "0 0 8px 0" }}>{character.core.name}</h3>
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            fontSize: "14px",
            color: "#4b5563",
          }}
        >
          <span>Status: {character.status}</span>
          <span>Mode: {character.inputMode}</span>
          {character.details.role && <span>Role: {character.details.role}</span>}
        </div>
      </div>

      <p
        style={{
          margin: 0,
          color: "#374151",
          lineHeight: 1.5,
        }}
      >
        {character.core.description}
      </p>

      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        {character.core.traits.map((trait) => (
          <span
            key={trait}
            style={{
              padding: "4px 8px",
              borderRadius: "999px",
              background: "#eff6ff",
              color: "#1d4ed8",
              fontSize: "13px",
            }}
          >
            {trait}
          </span>
        ))}
      </div>

      <div>
        <Link to={`/characters/${character._id}`}>Open details</Link>
      </div>
    </div>
  );
}

export default CharacterCard;