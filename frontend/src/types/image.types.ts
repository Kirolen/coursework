export type GeneratedImageStatus = "pending" | "success" | "failed";

export interface GeneratedImage {
  _id: string;
  characterId: string;
  promptUsed: string;
  imageUrl: string;
  status: GeneratedImageStatus;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}