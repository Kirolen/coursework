import { useState } from "react";

interface PromptFormProps {
  onSubmit: (prompt: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

function PromptForm({
  onSubmit,
  isLoading = false,
  error = null,
}: PromptFormProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(prompt);
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
        <h1 style={{ margin: "0 0 8px 0" }}>Create Character from Prompt</h1>
        <p style={{ margin: 0, color: "#6b7280" }}>
          Describe your character in free text, and AI will generate a structured
          character card.
        </p>
      </div>

      <label>
        <div style={{ marginBottom: "8px" }}>Character Prompt</div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Example: A young mage named Rein in a dark fantasy world, afraid of his own power, but determined to save his sister. He is cautious, anxious, and deeply loyal..."
          rows={10}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            resize: "vertical",
          }}
        />
        <small
          style={{
            display: "block",
            marginTop: "8px",
            color: "#6b7280",
          }}
        >
          The more detailed your prompt is, the better the generated card will be.
        </small>
      </label>

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
        {isLoading ? "Generating..." : "Generate Character"}
      </button>
    </form>
  );
}

export default PromptForm;