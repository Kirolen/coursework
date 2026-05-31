import "./GenerateImageButton.css";
import type { ImageStyle } from "../../../types/image.types";

interface GenerateImageButtonProps {
  imageStyle: ImageStyle | null;
  onImageStyleChange: (style: ImageStyle | null) => void;
  onClick: () => Promise<void>;
  isLoading?: boolean;
}

const imageStyleOptions: Array<{
  value: ImageStyle;
  label: string;
}> = [
  { value: "anime", label: "Anime" },
  { value: "realistic", label: "Realistic" },
  { value: "dark_fantasy", label: "Dark fantasy" },
  { value: "cinematic", label: "Cinematic" },
  { value: "watercolor", label: "Watercolor" },
];

function GenerateImageButton({
  imageStyle,
  onImageStyleChange,
  onClick,
  isLoading = false,
}: GenerateImageButtonProps) {
  return (
    <div className="generate-image-control">
      <label className="generate-image-control__label" htmlFor="image-style">
        Style
      </label>

      <select
        id="image-style"
        className="generate-image-control__select"
        value={imageStyle ?? ""}
        onChange={(event) => {
          const nextValue = event.target.value;
          onImageStyleChange(nextValue ? (nextValue as ImageStyle) : null);
        }}
        disabled={isLoading}
      >
        <option value="">Match character</option>
        {imageStyleOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="generate-image-button"
        onClick={() => {
          void onClick();
        }}
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Generate Image"}
      </button>
    </div>
  );
}

export default GenerateImageButton;
