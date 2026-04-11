import { useState } from "react";
import "./PromptForm.css";

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
    <form className="prompt-form" onSubmit={handleSubmit}>
      <div className="prompt-form__header">
        <h1 className="prompt-form__title">Create Character from Prompt</h1>
        <p className="prompt-form__subtitle">
          Describe your character in free text, and AI will generate a structured
          character card.
        </p>
      </div>

      <label className="prompt-form__field">
        <span className="prompt-form__label">Character Prompt</span>

        <textarea
          className="prompt-form__textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Example: A young mage named Rein in a dark fantasy world, afraid of his own power, but determined to save his sister. He is cautious, anxious, and deeply loyal..."
          rows={10}
        />

        <small className="prompt-form__helper">
          The more detailed your prompt is, the better the generated card will be.
        </small>
      </label>

      {error && <div className="prompt-form__error">{error}</div>}

      <button
        type="submit"
        disabled={isLoading}
        className="prompt-form__submit"
      >
        {isLoading ? "Generating..." : "Generate Character"}
      </button>
    </form>
  );
}

export default PromptForm;