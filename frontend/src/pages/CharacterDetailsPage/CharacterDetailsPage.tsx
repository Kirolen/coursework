import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { charactersApi } from "../../api/characters.api";
import { validationsApi } from "../../api/validations.api";
import { imagesApi } from "../../api/images.api";
import Loader from "../../components/common/Loader/Loader";
import CharacterActions from "../../components/characters/CharacterActions/CharacterActions";

import CharacterMeta from "../../components/characters/CharacterMeta/CharacterMeta";
import ValidationPanel from "../../components/validations/ValidationPanel/ValidationPanel";
import GenerateImageButton from "../../components/images/GenerateImageButton/GenerateImageButton";
import ImageGallery from "../../components/images/ImageGallery/ImageGallery";
import type {
  Character,
  SuggestCharacterFixesResponse,
} from "../../types/character.types";
import type { CharacterValidation } from "../../types/validation.types";
import type { GeneratedImage, ImageStyle } from "../../types/image.types";
import "./CharacterDetailsPage.css";

function CharacterDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [validation, setValidation] = useState<CharacterValidation | null>(null);
  const [isValidationLoading, setIsValidationLoading] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidationRunning, setIsValidationRunning] = useState(false);

  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isImagesLoading, setIsImagesLoading] = useState(true);
  const [imagesError, setImagesError] = useState<string | null>(null);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [imageStyle, setImageStyle] = useState<ImageStyle | null>(null);

  const [fixInstruction, setFixInstruction] = useState("");
  const [fixSuggestion, setFixSuggestion] =
    useState<SuggestCharacterFixesResponse | null>(null);
  const [isFixModalOpen, setIsFixModalOpen] = useState(false);
  const [isSuggestingFixes, setIsSuggestingFixes] = useState(false);
  const [isApplyingFixes, setIsApplyingFixes] = useState(false);
  const [fixError, setFixError] = useState<string | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

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
          const axiosError = err as any;
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
      if (!id) return;

      try {
        setValidationError(null);
        setIsValidationLoading(true);

        const data = await validationsApi.getLatest(id);
        setValidation(data);
      } catch {
        setValidation(null);
      } finally {
        setIsValidationLoading(false);
      }
    };

    void fetchLatestValidation();
  }, [id]);

  useEffect(() => {
    const fetchImages = async () => {
      if (!id) return;

      try {
        setImagesError(null);
        setIsImagesLoading(true);

        const data = await imagesApi.getAll(id);
        setImages(data);
      } catch {
        setImagesError("Failed to load images");
      } finally {
        setIsImagesLoading(false);
      }
    };

    void fetchImages();
  }, [id]);

  const handleRunSemanticValidation = async () => {
    if (!id) return;

    try {
      setIsValidationRunning(true);
      const result = await validationsApi.runSemanticValidation(id);
      setValidation(result);
    } finally {
      setIsValidationRunning(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!id) return;

    try {
      setIsImageGenerating(true);
      await imagesApi.generate(id, { imageStyle });
      const updated = await imagesApi.getAll(id);
      setImages(updated);
    } finally {
      setIsImageGenerating(false);
    }
  };

  const handleSuggestFixes = async () => {
    if (!id) return;

    try {
      setFixError(null);
      setIsSuggestingFixes(true);

      const instruction = fixInstruction.trim();
      const result = await charactersApi.suggestFixes(id, {
        ...(instruction ? { instruction } : {}),
      });

      setFixSuggestion(result);
      setIsFixModalOpen(false);
    } catch (err: unknown) {
      let message = "Failed to suggest fixes";

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

      setFixError(message);
    } finally {
      setIsSuggestingFixes(false);
    }
  };

  const handleApplyFixes = async () => {
    if (!id || !fixSuggestion) return;

    try {
      setFixError(null);
      setIsApplyingFixes(true);

      const updatedCharacter = await charactersApi.update(
        id,
        fixSuggestion.suggestedCharacter
      );
      setCharacter(updatedCharacter);
      setFixSuggestion(null);
      setFixInstruction("");
      setIsFixModalOpen(false);

      try {
        const latestValidation = await validationsApi.getLatest(id);
        setValidation(latestValidation);
      } catch {
        setValidation(null);
      }
    } catch (err: unknown) {
      let message = "Failed to apply suggested changes";

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

      setFixError(message);
    } finally {
      setIsApplyingFixes(false);
    }
  };

  const handleDeleteCharacter = async () => {
    if (!id) return;

    setIsDeleting(true);
    await charactersApi.delete(id);
    navigate("/characters");
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="character-details__error">
        <Link to="/characters">← Back</Link>
        <p>{error}</p>
      </div>
    );
  }

  if (!character) return <p>Not found</p>;

  return (
    <div className="character-details">
      <CharacterActions
        characterId={character._id}
        onDelete={handleDeleteCharacter}
        isDeleting={isDeleting}
      />

      <section className="cd-card">
        <h1 className="cd-title">{character.core.name}</h1>
        <CharacterMeta character={character} />

        <p className="cd-description">{character.core.description}</p>
      </section>

      <ValidationPanel
        validation={validation}
        isLoading={isValidationLoading}
        error={validationError}
        onRunSemanticValidation={handleRunSemanticValidation}
        isRunning={isValidationRunning}
      />

      <section className="cd-card ai-improvements">
        <div className="cd-header">
          <div>
            <h2 className="ai-improvements__title">AI Improvements</h2>
            <p className="ai-improvements__subtitle">
              Suggest fixes from the latest validation result
            </p>
          </div>

          <button
            type="button"
            className="ai-improvements__button ai-improvements__button--primary"
            onClick={() => {
              setFixError(null);
              setIsFixModalOpen(true);
            }}
            disabled={isSuggestingFixes || isApplyingFixes}
          >
            Improve with AI
          </button>
        </div>

        {fixError && <div className="ai-improvements__error">{fixError}</div>}

        {fixSuggestion && (
          <div className="ai-improvements__suggestion">
            <h3 className="ai-improvements__section-title">
              Suggested Changes
            </h3>

            {fixSuggestion.summary.length > 0 && (
              <ul className="ai-improvements__summary">
                {fixSuggestion.summary.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}

            <div className="ai-improvements__preview">
              <div>
                <span className="ai-improvements__preview-label">Name</span>
                <p>{fixSuggestion.suggestedCharacter.core.name}</p>
              </div>

              <div>
                <span className="ai-improvements__preview-label">
                  Description
                </span>
                <p>{fixSuggestion.suggestedCharacter.core.description}</p>
              </div>

              <div>
                <span className="ai-improvements__preview-label">
                  Appearance
                </span>
                <p>{fixSuggestion.suggestedCharacter.core.appearance}</p>
              </div>

              <div>
                <span className="ai-improvements__preview-label">Traits</span>
                <p>{fixSuggestion.suggestedCharacter.core.traits.join(", ")}</p>
              </div>

              <div>
                <span className="ai-improvements__preview-label">
                  Motivation
                </span>
                <p>
                  {fixSuggestion.suggestedCharacter.details.motivation ??
                    "Not set"}
                </p>
              </div>

              <div>
                <span className="ai-improvements__preview-label">
                  Abilities
                </span>
                <p>
                  {fixSuggestion.suggestedCharacter.details.abilities.join(
                    ", "
                  ) || "Not set"}
                </p>
              </div>

              <div>
                <span className="ai-improvements__preview-label">
                  Weaknesses
                </span>
                <p>
                  {fixSuggestion.suggestedCharacter.details.weaknesses.join(
                    ", "
                  ) || "Not set"}
                </p>
              </div>
            </div>

            <div className="ai-improvements__actions">
              <button
                type="button"
                className="ai-improvements__button ai-improvements__button--primary"
                onClick={() => {
                  void handleApplyFixes();
                }}
                disabled={isApplyingFixes || isSuggestingFixes}
              >
                {isApplyingFixes ? "Applying..." : "Apply Changes"}
              </button>

              <button
                type="button"
                className="ai-improvements__button"
                onClick={() => {
                  setFixSuggestion(null);
                  setFixError(null);
                }}
                disabled={isApplyingFixes || isSuggestingFixes}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      {isFixModalOpen && (
        <div
          className="ai-improvements__modal-backdrop"
          role="presentation"
          onClick={() => {
            if (!isSuggestingFixes) {
              setIsFixModalOpen(false);
            }
          }}
        >
          <div
            className="ai-improvements__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-improvements-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="ai-improvements__modal-header">
              <div>
                <h3
                  className="ai-improvements__modal-title"
                  id="ai-improvements-modal-title"
                >
                  Improve Character
                </h3>
                <p className="ai-improvements__modal-subtitle">
                  Leave the prompt empty to only fix validation issues.
                </p>
              </div>

              <button
                type="button"
                className="ai-improvements__modal-close"
                onClick={() => setIsFixModalOpen(false)}
                disabled={isSuggestingFixes}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <label className="ai-improvements__field">
              <span className="ai-improvements__label">
                Optional instruction
              </span>
              <textarea
                className="ai-improvements__textarea"
                value={fixInstruction}
                onChange={(event) => setFixInstruction(event.target.value)}
                placeholder="Example: make the character darker and more tragic"
                rows={4}
                disabled={isSuggestingFixes}
              />
            </label>

            {fixError && (
              <div className="ai-improvements__error">{fixError}</div>
            )}

            <div className="ai-improvements__actions ai-improvements__actions--end">
              <button
                type="button"
                className="ai-improvements__button"
                onClick={() => setIsFixModalOpen(false)}
                disabled={isSuggestingFixes}
              >
                Cancel
              </button>

              <button
                type="button"
                className="ai-improvements__button ai-improvements__button--primary"
                onClick={() => {
                  void handleSuggestFixes();
                }}
                disabled={isSuggestingFixes}
              >
                {isSuggestingFixes ? "Improving..." : "Get Suggestions"}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="cd-card">
        <div className="cd-header">
          <h2>Images</h2>
          <GenerateImageButton
            imageStyle={imageStyle}
            onImageStyleChange={setImageStyle}
            onClick={handleGenerateImage}
            isLoading={isImageGenerating}
          />
        </div>

        <ImageGallery
          images={images}
          isLoading={isImagesLoading}
          error={imagesError}
        />
      </section>
    </div>
  );
}

export default CharacterDetailsPage;
