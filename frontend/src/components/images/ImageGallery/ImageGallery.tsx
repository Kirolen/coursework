import type { GeneratedImage } from "../../../types/image.types";
import "./ImageGallery.css";

interface ImageGalleryProps {
  images: GeneratedImage[];
  isLoading?: boolean;
  error?: string | null;
}

const getStatusModifier = (status: GeneratedImage["status"]): string => {
  if (status === "success") {
    return "image-gallery__status--success";
  }

  if (status === "failed") {
    return "image-gallery__status--failed";
  }

  return "image-gallery__status--pending";
};

function ImageGallery({
  images,
  isLoading = false,
  error = null,
}: ImageGalleryProps) {
  if (isLoading) {
    return <p className="image-gallery__state">Loading images...</p>;
  }

  if (error) {
    return <div className="image-gallery__error">{error}</div>;
  }

  if (images.length === 0) {
    return <p className="image-gallery__state">No generated images yet.</p>;
  }

  return (
    <div className="image-gallery">
      {images.map((image) => {
        const imageUrl = image.imageUrl.startsWith("http")
          ? image.imageUrl
          : `http://localhost:5000${image.imageUrl}`;

        return (
          <article key={image._id} className="image-gallery__card">
            {image.status === "success" ? (
              <img
                src={imageUrl}
                alt="Generated character"
                className="image-gallery__image"
              />
            ) : (
              <div className="image-gallery__placeholder">
                {image.status === "pending"
                  ? "Image generation is pending"
                  : "Image generation failed"}
              </div>
            )}

            <div className="image-gallery__content">
              <div>
                <span
                  className={`image-gallery__status ${getStatusModifier(
                    image.status
                  )}`}
                >
                  {image.status}
                </span>
              </div>

              {image.errorMessage && (
                <div className="image-gallery__error-box">
                  {image.errorMessage}
                </div>
              )}

              <details className="image-gallery__details">
                <summary className="image-gallery__summary">Prompt used</summary>
                <p className="image-gallery__prompt">{image.promptUsed}</p>
              </details>

              <div className="image-gallery__date">
                Created: {new Date(image.createdAt).toLocaleString()}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default ImageGallery;