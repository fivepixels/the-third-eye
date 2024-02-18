// These types are for communicating between the content scripts codes and service worker scripts;

export enum ServiceWorkerType {
  STORAGE = "STORAGE",
  TAB = "TAB",
  TIME = "TIME",
  TTS = "TTS",
  AI = "AI",
  HTTP = "HTTP"
}

export type SendingMessageType = keyof typeof ServiceWorkerType;
export enum RespondingMessageStatus {
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED",
  NOT_FOUND = "NOT_FOUND"
}

export type SendingMessageShape<T = string> = {
  messageType: SendingMessageType;
  sentAt: string;
  body: T;
};

export type RespondingMessageType<T> = {
  status: RespondingMessageStatus;
  respondedAt: string;
  body: T;
};

export type RespondingMessageCallback<T> = (response: T) => void;

export type RespondingType<T, U> = (
  message: SendingMessageShape<T>,
  sender: chrome.runtime.MessageSender,
  sendResponse: RespondingMessageCallback<RespondingMessageType<U>>
) => void;
