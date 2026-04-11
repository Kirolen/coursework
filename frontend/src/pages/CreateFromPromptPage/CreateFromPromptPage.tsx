import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { charactersApi } from "../../api/characters.api";
import PromptForm from "../../components/characters/PromptForm/PromptForm";
import "./CreateFromPromptPage.css";

function CreateFromPromptPage() {
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (prompt: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const character = await charactersApi.createFromPrompt({ prompt });
      navigate(`/characters/${character._id}`);
    } catch (err: unknown) {
      let message = "Failed to create character from prompt";

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
    <div className="create-from-prompt-page">
      <div className="create-from-prompt-page__back">
        <Link
          to="/characters"
          className="create-from-prompt-page__back-link"
        >
          ← Back to characters
        </Link>
      </div>

      <PromptForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

export default CreateFromPromptPage;