import { Link } from "react-router-dom";
import "./CharacterActions.css";

interface CharacterActionsProps {
  characterId: string;
  onDelete: () => Promise<void>;
  isDeleting?: boolean;
}

function CharacterActions({
  characterId,
  onDelete,
  isDeleting = false,
}: CharacterActionsProps) {
  const handleDeleteClick = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this character?"
    );

    if (!isConfirmed) {
      return;
    }

    await onDelete();
  };

  return (
    <div className="character-actions">
      <Link
        to="/characters"
        className="character-actions__link character-actions__link--secondary"
      >
        ← Back to characters
      </Link>

      <Link
        to={`/characters/${characterId}/edit`}
        className="character-actions__link character-actions__link--primary"
      >
        Edit character
      </Link>

      <button
        type="button"
        className="character-actions__delete-button"
        onClick={() => {
          void handleDeleteClick();
        }}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete character"}
      </button>
    </div>
  );
}

export default CharacterActions;