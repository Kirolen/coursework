import { Link } from "react-router-dom";
import type { Character } from "../../../types/character.types";
import "./CharacterCard.css";

interface CharacterCardProps {
  character: Character;
}

function CharacterCard({ character }: CharacterCardProps) {
  return (
    <article className="character-card">
      <div className="character-card__header">
        <h3 className="character-card__title">{character.core.name}</h3>

        <div className="character-card__meta">
          <span className="character-card__meta-badge">
            Status: {character.status}
          </span>

          <span className="character-card__meta-badge">
            Mode: {character.inputMode}
          </span>

          {character.details.role && (
            <span className="character-card__meta-badge">
              Role: {character.details.role}
            </span>
          )}
        </div>
      </div>

      <p className="character-card__description">
        {character.core.description}
      </p>

      <div className="character-card__traits">
        {character.core.traits.map((trait) => (
          <span key={trait} className="character-card__trait">
            {trait}
          </span>
        ))}
      </div>

      <div className="character-card__footer">
        <Link
          to={`/characters/${character._id}`}
          className="character-card__link"
        >
          Open details
        </Link>
      </div>
    </article>
  );
}

export default CharacterCard;