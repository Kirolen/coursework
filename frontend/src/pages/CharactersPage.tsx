import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { charactersApi } from "../api/characters.api";
import CharacterCard from "../components/characters/CharacterCard";
import Loader from "../components/common/Loader";
import type { Character } from "../types/character.types";

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

    fetchCharacters();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div>
        <h2>Characters</h2>
        <p style={{ color: "#b91c1c" }}>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          gap: "16px",
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 8px 0" }}>My Characters</h1>
          <p style={{ margin: 0, color: "#6b7280" }}>
            Manage your created character cards
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <Link to="/characters/create">Create manually</Link>
          <Link to="/characters/create-from-prompt">Create from prompt</Link>
        </div>
      </div>

      {characters.length === 0 ? (
        <div
          style={{
            padding: "24px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
          }}
        >
          <p style={{ marginTop: 0 }}>You do not have any characters yet.</p>
          <Link to="/characters/create">Create your first character</Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {characters.map((character) => (
            <CharacterCard key={character._id} character={character} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CharactersPage;