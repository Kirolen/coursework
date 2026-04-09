import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { charactersApi } from "../api/characters.api";
import { validationsApi } from "../api/validations.api";
import Loader from "../components/common/Loader";
import CharacterMeta from "../components/characters/CharacterMeta";
import ValidationPanel from "../components/validations/ValidationPanel";
import type { Character } from "../types/character.types";
import type { CharacterValidation } from "../types/validation.types";

function CharacterDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [validation, setValidation] = useState<CharacterValidation | null>(null);
  const [isValidationLoading, setIsValidationLoading] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidationRunning, setIsValidationRunning] = useState(false);

  useEffect(() => {
    const fetchCharacter = async () => {
      if (!id) {
        setError("Character id is missing");
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        setIsLoading(true);

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

        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchCharacter();
  }, [id]);

  useEffect(() => {
    const fetchLatestValidation = async () => {
      if (!id) {
        setValidationError("Character id is missing");
        setIsValidationLoading(false);
        return;
      }

      try {
        setValidationError(null);
        setIsValidationLoading(true);

        const data = await validationsApi.getLatest(id);
        setValidation(data);
      } catch (err: unknown) {
        let message = "Failed to load validation";

        if (typeof err === "object" && err !== null && "response" in err) {
          const axiosError = err as {
            response?: {
              status?: number;
              data?: {
                message?: string;
              };
            };
          };

          if (axiosError.response?.status === 404) {
            setValidation(null);
            setValidationError(null);
            return;
          }

          message = axiosError.response?.data?.message ?? message;
        } else if (err instanceof Error) {
          message = err.message;
        }

        setValidationError(message);
      } finally {
        setIsValidationLoading(false);
      }
    };

    void fetchLatestValidation();
  }, [id]);

  const handleRunSemanticValidation = async () => {
    if (!id) {
      return;
    }

    try {
      setValidationError(null);
      setIsValidationRunning(true);

      const result = await validationsApi.runSemanticValidation(id);
      setValidation(result);

      const updatedCharacter = await charactersApi.getById(id);
      setCharacter(updatedCharacter);
    } catch (err: unknown) {
      let message = "Failed to run semantic validation";

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

      setValidationError(message);
    } finally {
      setIsValidationRunning(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div>
        <Link to="/characters">← Back to characters</Link>
        <h1 style={{ marginTop: "16px" }}>Character Details</h1>
        <p style={{ color: "#b91c1c" }}>{error}</p>
      </div>
    );
  }

  if (!character) {
    return (
      <div>
        <Link to="/characters">← Back to characters</Link>
        <h1 style={{ marginTop: "16px" }}>Character not found</h1>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <Link to="/characters">← Back to characters</Link>
      </div>

      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 12px 0" }}>{character.core.name}</h1>
          <CharacterMeta character={character} />
        </div>

        <div>
          <h2 style={{ marginBottom: "8px" }}>Description</h2>
          <p style={{ margin: 0, lineHeight: 1.6 }}>{character.core.description}</p>
        </div>
      </section>

      <ValidationPanel
        validation={validation}
        isLoading={isValidationLoading}
        error={validationError}
        onRunSemanticValidation={handleRunSemanticValidation}
        isRunning={isValidationRunning}
      />

      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Core</h2>

        <div style={{ display: "grid", gap: "16px" }}>
          <div>
            <strong>Appearance:</strong>
            <p style={{ margin: "6px 0 0 0" }}>{character.core.appearance}</p>
          </div>

          <div>
            <strong>Traits:</strong>
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginTop: "8px",
              }}
            >
              {character.core.traits.length > 0 ? (
                character.core.traits.map((trait) => (
                  <span
                    key={trait}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "999px",
                      background: "#eff6ff",
                      color: "#1d4ed8",
                      fontSize: "14px",
                    }}
                  >
                    {trait}
                  </span>
                ))
              ) : (
                <span>—</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Details</h2>

        <div style={{ display: "grid", gap: "16px" }}>
          <div>
            <strong>Genres:</strong>
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginTop: "8px",
              }}
            >
              {character.details.genres.length > 0 ? (
                character.details.genres.map((genre) => (
                  <span
                    key={genre}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "999px",
                      background: "#f3f4f6",
                      fontSize: "14px",
                    }}
                  >
                    {genre}
                  </span>
                ))
              ) : (
                <span>—</span>
              )}
            </div>
          </div>

          <div>
            <strong>Abilities:</strong>
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginTop: "8px",
              }}
            >
              {character.details.abilities.length > 0 ? (
                character.details.abilities.map((ability) => (
                  <span
                    key={ability}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "999px",
                      background: "#ecfccb",
                      fontSize: "14px",
                    }}
                  >
                    {ability}
                  </span>
                ))
              ) : (
                <span>—</span>
              )}
            </div>
          </div>

          <div>
            <strong>Motivation:</strong>
            <p style={{ margin: "6px 0 0 0" }}>
              {character.details.motivation ?? "—"}
            </p>
          </div>

          <div>
            <strong>Weaknesses:</strong>
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginTop: "8px",
              }}
            >
              {character.details.weaknesses.length > 0 ? (
                character.details.weaknesses.map((weakness) => (
                  <span
                    key={weakness}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "999px",
                      background: "#fee2e2",
                      color: "#991b1b",
                      fontSize: "14px",
                    }}
                  >
                    {weakness}
                  </span>
                ))
              ) : (
                <span>—</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Additional Attributes</h2>

        {Object.keys(character.additionalAttributes).length === 0 ? (
          <p style={{ margin: 0 }}>No additional attributes</p>
        ) : (
          <div style={{ display: "grid", gap: "10px" }}>
            {Object.entries(character.additionalAttributes).map(([key, value]) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <strong>{key}:</strong>
                <span>{value}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Technical Info</h2>

        <div style={{ display: "grid", gap: "10px" }}>
          <div>
            <strong>ID:</strong> {character._id}
          </div>
          <div>
            <strong>Created At:</strong> {new Date(character.createdAt).toLocaleString()}
          </div>
          <div>
            <strong>Updated At:</strong> {new Date(character.updatedAt).toLocaleString()}
          </div>
          {character.rawPrompt && (
            <div>
              <strong>Raw Prompt:</strong>
              <p style={{ margin: "6px 0 0 0", lineHeight: 1.6 }}>
                {character.rawPrompt}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default CharacterDetailsPage;