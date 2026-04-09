import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { charactersApi } from "../api/characters.api";
import CharacterForm from "../components/characters/CharacterForm";
import type { CreateCharacterPayload } from "../types/character.types";

function CreateCharacterPage() {
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (payload: CreateCharacterPayload) => {
    try {
      setError(null);
      setIsLoading(true);

      const character = await charactersApi.create(payload);
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
    <div style={{ display: "grid", gap: "16px" }}>
      <div>
        <Link to="/characters">← Back to characters</Link>
      </div>

      <CharacterForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

export default CreateCharacterPage;