export type GeneratedImageStatus = "pending" | "success" | "failed";
export type ImageStyle =
  | "anime"
  | "realistic"
  | "dark_fantasy"
  | "cinematic"
  | "watercolor";

export interface LatestSuccessfulGeneratedImage {
  _id: string;
  characterId: string;
  promptUsed: string;
  imageUrl: string;
  imageStyle: ImageStyle | null;
  createdAt: string;
}

export interface GeneratedImage {
  _id: string;
  characterId: string;
  promptUsed: string;
  imageUrl: string;
  status: GeneratedImageStatus;
  imageStyle: ImageStyle | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateImagePayload {
  imageStyle?: ImageStyle | null;
}
