import { useState } from "react";
import type { CreateCharacterPayload } from "../../types/character.types";

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
  onSubmit: (payload: CreateCharacterPayload) => Promise<void>;
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

function CharacterForm({
  onSubmit,
  isLoading = false,
  error = null,
}: CharacterFormProps) {
  const [formData, setFormData] = useState<CharacterFormValues>(initialState);

  const handleChange = (field: keyof CharacterFormValues, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: CreateCharacterPayload = {
      inputMode: "builder",
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
        motivation: formData.motivation.trim() ? formData.motivation.trim() : null,
        weaknesses: parseCommaSeparated(formData.weaknesses),
      },
      additionalAttributes: parseAdditionalAttributes(formData.additionalAttributes),
    };

    await onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: "20px",
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "24px",
      }}
    >
      <div>
        <h1 style={{ margin: "0 0 8px 0" }}>Create Character</h1>
        <p style={{ margin: 0, color: "#6b7280" }}>
          Fill in the character card manually.
        </p>
      </div>

      <section style={{ display: "grid", gap: "16px" }}>
        <h2 style={{ margin: 0 }}>Core</h2>

        <label>
          <div style={{ marginBottom: "6px" }}>Name</div>
          <input
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Character name"
            style={inputStyle}
          />
        </label>

        <label>
          <div style={{ marginBottom: "6px" }}>Age</div>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => handleChange("age", e.target.value)}
            placeholder="Character age"
            style={inputStyle}
          />
        </label>

        <label>
          <div style={{ marginBottom: "6px" }}>Description</div>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Describe the character"
            rows={5}
            style={textareaStyle}
          />
        </label>

        <label>
          <div style={{ marginBottom: "6px" }}>Appearance</div>
          <textarea
            value={formData.appearance}
            onChange={(e) => handleChange("appearance", e.target.value)}
            placeholder="Describe appearance"
            rows={4}
            style={textareaStyle}
          />
        </label>

        <label>
          <div style={{ marginBottom: "6px" }}>Traits</div>
          <input
            value={formData.traits}
            onChange={(e) => handleChange("traits", e.target.value)}
            placeholder="brave, loyal, anxious"
            style={inputStyle}
          />
          <small style={helperStyle}>Separate items with commas</small>
        </label>
      </section>

      <section style={{ display: "grid", gap: "16px" }}>
        <h2 style={{ margin: 0 }}>Details</h2>

        <label>
          <div style={{ marginBottom: "6px" }}>Role</div>
          <input
            value={formData.role}
            onChange={(e) => handleChange("role", e.target.value)}
            placeholder="protagonist"
            style={inputStyle}
          />
        </label>

        <label>
          <div style={{ marginBottom: "6px" }}>Genres</div>
          <input
            value={formData.genres}
            onChange={(e) => handleChange("genres", e.target.value)}
            placeholder="fantasy, dark fantasy"
            style={inputStyle}
          />
          <small style={helperStyle}>Separate items with commas</small>
        </label>

        <label>
          <div style={{ marginBottom: "6px" }}>Abilities</div>
          <input
            value={formData.abilities}
            onChange={(e) => handleChange("abilities", e.target.value)}
            placeholder="wind magic, swordsmanship"
            style={inputStyle}
          />
          <small style={helperStyle}>Separate items with commas</small>
        </label>

        <label>
          <div style={{ marginBottom: "6px" }}>Motivation</div>
          <textarea
            value={formData.motivation}
            onChange={(e) => handleChange("motivation", e.target.value)}
            placeholder="What drives the character?"
            rows={3}
            style={textareaStyle}
          />
        </label>

        <label>
          <div style={{ marginBottom: "6px" }}>Weaknesses</div>
          <input
            value={formData.weaknesses}
            onChange={(e) => handleChange("weaknesses", e.target.value)}
            placeholder="fear, low stamina"
            style={inputStyle}
          />
          <small style={helperStyle}>Separate items with commas</small>
        </label>
      </section>

      <section style={{ display: "grid", gap: "16px" }}>
        <h2 style={{ margin: 0 }}>Additional Attributes</h2>

        <label>
          <div style={{ marginBottom: "6px" }}>Attributes</div>
          <textarea
            value={formData.additionalAttributes}
            onChange={(e) => handleChange("additionalAttributes", e.target.value)}
            placeholder={`homeland: Eldoria\nweapon: Oak staff`}
            rows={5}
            style={textareaStyle}
          />
          <small style={helperStyle}>
            One attribute per line in format: key: value
          </small>
        </label>
      </section>

      {error && (
        <div
          style={{
            color: "#b91c1c",
            background: "#fee2e2",
            padding: "12px 14px",
            borderRadius: "10px",
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        style={{
          padding: "12px 16px",
          borderRadius: "10px",
          border: "none",
          background: "#2563eb",
          color: "#ffffff",
          cursor: "pointer",
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        {isLoading ? "Creating..." : "Create Character"}
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  resize: "vertical",
};

const helperStyle: React.CSSProperties = {
  display: "block",
  marginTop: "6px",
  color: "#6b7280",
};

export default CharacterForm;