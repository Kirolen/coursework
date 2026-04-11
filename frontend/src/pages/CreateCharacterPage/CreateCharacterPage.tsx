import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { charactersApi } from "../../api/characters.api";
import CharacterForm from "../../components/characters/CharacterForm/CharacterForm";
import type {
  CreateCharacterPayload,
  UpdateCharacterPayload,
} from "../../types/character.types";
import "./CreateCharacterPage.css";

function CreateCharacterPage() {
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    payload: CreateCharacterPayload | UpdateCharacterPayload
  ) => {
    try {
      setError(null);
      setIsLoading(true);

      const character = await charactersApi.create(payload as CreateCharacterPayload);
      navigate(`/characters/${character._id}`);
    } catch (err: unknown) {
      let message = "Failed to create character";

      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        message = axiosError.response?.data?.message ?? message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-character-page">
      <div className="create-character-page__back">
        <Link
          to="/characters"
          className="create-character-page__back-link"
        >
          ← Back to characters
        </Link>
      </div>

      <CharacterForm
        mode="create"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

export default CreateCharacterPage;