// These types are for communicating between the content scripts codes and service worker scripts;

export type SendingMessageContentType = "TTS" | "AI" | "HTTP";
export type RespondingMessageStatus = "SUCCESSFUL" | "FAILED" | "NOT_FOUND";

export type SendingMessageType<T> = {
  messageType: SendingMessageContentType;
  sentAt: string;
  body: T;
};
export type RespondingMessageType<T> = {
  status: RespondingMessageStatus;
  respondedAt: string;
  body: T;
};

export type SendResponseType<T> = (response: T) => void;

export type RespondingType<T, U> = (
  message: SendingMessageType<T>,
  sender: chrome.runtime.MessageSender,
  sendResponse: SendResponseType<RespondingMessageType<U>>
) => void;
