import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { charactersApi } from "../../api/characters.api";
import CharacterCard from "../../components/characters/CharacterCard/CharacterCard";
import Loader from "../../components/common/Loader/Loader";
import type { Character } from "../../types/character.types";
import "./CharactersPage.css";

function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setError(null);
        setIsLoading(true);

        const data = await charactersApi.getAll();
        setCharacters(data);
      } catch (err: unknown) {
        let message = "Failed to load characters";

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

    void fetchCharacters();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="characters-page">
        <div className="characters-page__error">
          <h2 className="characters-page__error-title">Characters</h2>
          <p className="characters-page__error-text">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="characters-page">
      <div className="characters-page__header">
        <div className="characters-page__heading">
          <h1 className="characters-page__title">My Characters</h1>
          <p className="characters-page__subtitle">
            Manage your created character cards
          </p>
        </div>

        <div className="characters-page__actions">
          <Link
            to="/characters/create"
            className="characters-page__action-link characters-page__action-link--primary"
          >
            Create manually
          </Link>

          <Link
            to="/characters/create-from-prompt"
            className="characters-page__action-link"
          >
            Create from prompt
          </Link>
        </div>
      </div>

      {characters.length === 0 ? (
        <div className="characters-page__empty">
          <p className="characters-page__empty-text">
            You do not have any characters yet.
          </p>

          <Link
            to="/characters/create"
            className="characters-page__empty-link"
          >
            Create your first character
          </Link>
        </div>
      ) : (
        <div className="characters-page__grid">
          {characters.map((character) => (
            <CharacterCard key={character._id} character={character} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CharactersPage;