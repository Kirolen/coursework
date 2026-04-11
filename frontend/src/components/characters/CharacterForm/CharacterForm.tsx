import { useEffect, useState } from "react";
import type {
  CreateCharacterPayload,
  UpdateCharacterPayload,
  Character,
} from "../../../types/character.types";
import "./CharacterForm.css";

interface CharacterFormValues {
  name: string;
  age: string;
  description: string;
  appearance: string;
  traits: string;
  role: string;
  genres: string;
  abilities: string;
  motivation: string;
  weaknesses: string;
  additionalAttributes: string;
}

interface CharacterFormProps {
  mode?: "create" | "edit";
  initialCharacter?: Character | null;
  onSubmit: (
    payload: CreateCharacterPayload | UpdateCharacterPayload
  ) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const initialState: CharacterFormValues = {
  name: "",
  age: "",
  description: "",
  appearance: "",
  traits: "",
  role: "",
  genres: "",
  abilities: "",
  motivation: "",
  weaknesses: "",
  additionalAttributes: "",
};

const parseCommaSeparated = (value: string): string[] => {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const parseAdditionalAttributes = (value: string): Record<string, string> => {
  if (!value.trim()) {
    return {};
  }

  const result: Record<string, string> = {};

  value.split("\n").forEach((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      return;
    }

    const separatorIndex = trimmedLine.indexOf(":");

    if (separatorIndex === -1) {
      return;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const val = trimmedLine.slice(separatorIndex + 1).trim();

    if (key) {
      result[key] = val;
    }
  });

  return result;
};

const formatAdditionalAttributes = (
  attributes: Record<string, string>
): string => {
  return Object.entries(attributes)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
};

const mapCharacterToFormValues = (character: Character): CharacterFormValues => {
  return {
    name: character.core.name ?? "",
    age: character.core.age !== null ? String(character.core.age) : "",
    description: character.core.description ?? "",
    appearance: character.core.appearance ?? "",
    traits: character.core.traits.join(", "),
    role: character.details.role ?? "",
    genres: character.details.genres.join(", "),
    abilities: character.details.abilities.join(", "),
    motivation: character.details.motivation ?? "",
    weaknesses: character.details.weaknesses.join(", "),
    additionalAttributes: formatAdditionalAttributes(
      character.additionalAttributes ?? {}
    ),
  };
};

function CharacterForm({
  mode = "create",
  initialCharacter = null,
  onSubmit,
  isLoading = false,
  error = null,
}: CharacterFormProps) {
  const [formData, setFormData] = useState<CharacterFormValues>(initialState);

  useEffect(() => {
    if (mode === "edit" && initialCharacter) {
      setFormData(mapCharacterToFormValues(initialCharacter));
    }
  }, [mode, initialCharacter]);

  const handleChange = (field: keyof CharacterFormValues, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const buildPayload = (): CreateCharacterPayload | UpdateCharacterPayload => {
    const basePayload = {
      core: {
        name: formData.name,
        age: formData.age ? Number(formData.age) : null,
        description: formData.description,
        appearance: formData.appearance,
        traits: parseCommaSeparated(formData.traits),
      },
      details: {
        role: formData.role.trim() ? formData.role.trim() : null,
        genres: parseCommaSeparated(formData.genres),
        abilities: parseCommaSeparated(formData.abilities),
        motivation: formData.motivation.trim()
          ? formData.motivation.trim()
          : null,
        weaknesses: parseCommaSeparated(formData.weaknesses),
      },
      additionalAttributes: parseAdditionalAttributes(formData.additionalAttributes),
    };

    if (mode === "edit") {
      const payload: UpdateCharacterPayload = {
        core: basePayload.core,
        details: basePayload.details,
        additionalAttributes: basePayload.additionalAttributes,
      };

      return payload;
    }

    const payload: CreateCharacterPayload = {
      inputMode: "builder",
      core: basePayload.core,
      details: basePayload.details,
      additionalAttributes: basePayload.additionalAttributes,
    };

    return payload;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(buildPayload());
  };

  const isEdit = mode === "edit";

  return (
    <form className="character-form" onSubmit={handleSubmit}>
      <div className="character-form__header">
        <h1 className="character-form__title">
          {isEdit ? "Edit Character" : "Create Character"}
        </h1>

        <p className="character-form__subtitle">
          {isEdit
            ? "Update the character card manually."
            : "Fill in the character card manually."}
        </p>
      </div>

      <section className="character-form__section">
        <h2 className="character-form__section-title">Core</h2>

        <label className="character-form__field">
          <span className="character-form__label">Name</span>
          <input
            className="character-form__input"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Character name"
          />
        </label>

        <label className="character-form__field">
          <span className="character-form__label">Age</span>
          <input
            type="number"
            className="character-form__input"
            value={formData.age}
            onChange={(e) => handleChange("age", e.target.value)}
            placeholder="Character age"
          />
        </label>

        <label className="character-form__field">
          <span className="character-form__label">Description</span>
          <textarea
            className="character-form__textarea"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Describe the character"
            rows={5}
          />
        </label>

        <label className="character-form__field">
          <span className="character-form__label">Appearance</span>
          <textarea
            className="character-form__textarea"
            value={formData.appearance}
            onChange={(e) => handleChange("appearance", e.target.value)}
            placeholder="Describe appearance"
            rows={4}
          />
        </label>

        <label className="character-form__field">
          <span className="character-form__label">Traits</span>
          <input
            className="character-form__input"
            value={formData.traits}
            onChange={(e) => handleChange("traits", e.target.value)}
            placeholder="brave, loyal, anxious"
          />
          <small className="character-form__helper">
            Separate items with commas
          </small>
        </label>
      </section>

      <section className="character-form__section">
        <h2 className="character-form__section-title">Details</h2>

        <label className="character-form__field">
          <span className="character-form__label">Role</span>
          <input
            className="character-form__input"
            value={formData.role}
            onChange={(e) => handleChange("role", e.target.value)}
            placeholder="protagonist"
          />
        </label>

        <label className="character-form__field">
          <span className="character-form__label">Genres</span>
          <input
            className="character-form__input"
            value={formData.genres}
            onChange={(e) => handleChange("genres", e.target.value)}
            placeholder="fantasy, dark fantasy"
          />
          <small className="character-form__helper">
            Separate items with commas
          </small>
        </label>

        <label className="character-form__field">
          <span className="character-form__label">Abilities</span>
          <input
            className="character-form__input"
            value={formData.abilities}
            onChange={(e) => handleChange("abilities", e.target.value)}
            placeholder="wind magic, swordsmanship"
          />
          <small className="character-form__helper">
            Separate items with commas
          </small>
        </label>

        <label className="character-form__field">
          <span className="character-form__label">Motivation</span>
          <textarea
            className="character-form__textarea"
            value={formData.motivation}
            onChange={(e) => handleChange("motivation", e.target.value)}
            placeholder="What drives the character?"
            rows={3}
          />
        </label>

        <label className="character-form__field">
          <span className="character-form__label">Weaknesses</span>
          <input
            className="character-form__input"
            value={formData.weaknesses}
            onChange={(e) => handleChange("weaknesses", e.target.value)}
            placeholder="fear, low stamina"
          />
          <small className="character-form__helper">
            Separate items with commas
          </small>
        </label>
      </section>

      <section className="character-form__section">
        <h2 className="character-form__section-title">Additional Attributes</h2>

        <label className="character-form__field">
          <span className="character-form__label">Attributes</span>
          <textarea
            className="character-form__textarea"
            value={formData.additionalAttributes}
            onChange={(e) => handleChange("additionalAttributes", e.target.value)}
            placeholder={`homeland: Eldoria\nweapon: Oak staff`}
            rows={5}
          />
          <small className="character-form__helper">
            One attribute per line in format: key: value
          </small>
        </label>
      </section>

      {error && <div className="character-form__error">{error}</div>}

      <button
        type="submit"
        disabled={isLoading}
        className="character-form__submit"
      >
        {isLoading
          ? isEdit
            ? "Saving..."
            : "Creating..."
          : isEdit
          ? "Save Changes"
          : "Create Character"}
      </button>
    </form>
  );
}

export default CharacterForm;