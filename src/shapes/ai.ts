export type AIModels = "gpt-3.5-turbo" | "gpt-4-vision-preview";
export type AIRole = "system" | "user" | "assistant";
export type AIContentType = "text" | "image_url";
export type AIImageDetail = "low" | "auto" | "high";

export interface AIContent {
  role: AIRole;
  content: string | AIMessage[];
}

export interface AIMessage {
  type: AIContentType;
  text?: string;
  image_url?: {
    url: string;
    detail: AIImageDetail;
  };
}
