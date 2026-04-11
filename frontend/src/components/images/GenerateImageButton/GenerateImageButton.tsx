import "./GenerateImageButton.css";

interface GenerateImageButtonProps {
  onClick: () => Promise<void>;
  isLoading?: boolean;
}

function GenerateImageButton({
  onClick,
  isLoading = false,
}: GenerateImageButtonProps) {
  return (
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
  );
}

export default GenerateImageButton;