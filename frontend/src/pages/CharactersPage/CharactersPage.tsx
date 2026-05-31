import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { charactersApi } from "../../api/characters.api";
import CharacterCard from "../../components/characters/CharacterCard/CharacterCard";
import Loader from "../../components/common/Loader/Loader";
import type { Character, CharacterStatus } from "../../types/character.types";
import "./CharactersPage.css";

type CharacterStatusFilter = CharacterStatus | "all";

const statusFilterOptions: CharacterStatusFilter[] = [
  "all",
  "draft",
  "partial",
  "complete",
  "validated",
];

function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<CharacterStatusFilter>("all");

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredCharacters = characters.filter((character) => {
    const matchesSearch = character.core.name
      .toLowerCase()
      .includes(normalizedSearchQuery);
    const matchesStatus =
      statusFilter === "all" || character.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
        <>
          <div className="characters-page__filters">
            <label className="characters-page__filter">
              <span className="characters-page__filter-label">Search</span>
              <input
                className="characters-page__search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name"
              />
            </label>

            <label className="characters-page__filter">
              <span className="characters-page__filter-label">Status</span>
              <select
                className="characters-page__select"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as CharacterStatusFilter)
                }
              >
                {statusFilterOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {filteredCharacters.length === 0 ? (
            <div className="characters-page__empty">
              <p className="characters-page__empty-text">
                No characters match your filters.
              </p>
            </div>
          ) : (
            <div className="characters-page__grid">
              {filteredCharacters.map((character) => (
                <CharacterCard key={character._id} character={character} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CharactersPage;
