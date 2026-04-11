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
import type { Character } from "../../types/character.types";
import type { CharacterValidation } from "../../types/validation.types";
import type { GeneratedImage } from "../../types/image.types";
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
      await imagesApi.generate(id);
      const updated = await imagesApi.getAll(id);
      setImages(updated);
    } finally {
      setIsImageGenerating(false);
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

      <section className="cd-card">
        <div className="cd-header">
          <h2>Images</h2>
          <GenerateImageButton
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