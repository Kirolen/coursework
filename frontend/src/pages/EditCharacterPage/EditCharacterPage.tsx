import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { charactersApi } from "../../api/characters.api";
import Loader from "../../components/common/Loader/Loader";
import CharacterForm from "../../components/characters/CharacterForm/CharacterForm";
import type {
  Character,
  CreateCharacterPayload,
  UpdateCharacterPayload,
} from "../../types/character.types";
import "./EditCharacterPage.css";

function EditCharacterPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoadingCharacter, setIsLoadingCharacter] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCharacter = async () => {
      if (!id) {
        setPageError("Character id is missing");
        setIsLoadingCharacter(false);
        return;
      }

      try {
        setPageError(null);
        setIsLoadingCharacter(true);

        const data = await charactersApi.getById(id);
        setCharacter(data);
      } catch (err: unknown) {
        let message = "Failed to load character";

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

        setPageError(message);
      } finally {
        setIsLoadingCharacter(false);
      }
    };

    void fetchCharacter();
  }, [id]);

  const handleSubmit = async (
    payload: CreateCharacterPayload | UpdateCharacterPayload
  ) => {
    if (!id) {
      return;
    }

    try {
      setSubmitError(null);
      setIsSubmitting(true);

      const updatedCharacter = await charactersApi.update(
        id,
        payload as UpdateCharacterPayload
      );
      navigate(`/characters/${updatedCharacter._id}`);
    } catch (err: unknown) {
      let message = "Failed to update character";

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

      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCharacter) {
    return <Loader />;
  }

  if (pageError) {
    return (
      <div className="edit-character-page">
        <div className="edit-character-page__back">
          <Link
            to="/characters"
            className="edit-character-page__back-link"
          >
            ← Back to characters
          </Link>
        </div>

        <div className="edit-character-page__error-block">
          <h1 className="edit-character-page__error-title">Edit Character</h1>
          <p className="edit-character-page__error-text">{pageError}</p>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="edit-character-page">
        <div className="edit-character-page__back">
          <Link
            to="/characters"
            className="edit-character-page__back-link"
          >
            ← Back to characters
          </Link>
        </div>

        <div className="edit-character-page__error-block">
          <h1 className="edit-character-page__error-title">
            Character not found
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-character-page">
      <div className="edit-character-page__back">
        <Link
          to={`/characters/${character._id}`}
          className="edit-character-page__back-link"
        >
          ← Back to character
        </Link>
      </div>

      <CharacterForm
        mode="edit"
        initialCharacter={character}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        error={submitError}
      />
    </div>
  );
}

export default EditCharacterPage;