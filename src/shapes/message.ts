import { ExtractedWebPageContent } from "./analyzer";
import user from "./user";

export type SendingMessageType =
  | "FETCH_DATA"
  | "CHANGE_DATA"
  | "TTS"
  | "TTS_STOP"
  | "OPEN_ONBOARDING"
  | "PAGE_ANALYZER"
  | "IMAGE_ANALYZER"
  | "TEXT_SUMMARIZER";

export interface SendingMessageShape<T extends SendingMessage> {
  body: T;
  type: SendingMessageType;
}

export interface SendingMessage {}
export interface ExpectedRespondingMessage {}

// DATA
export interface SendingFetchDataMessage extends SendingMessage {}
export interface ExpectedRespondingFetchDataMessage
  extends ExpectedRespondingMessage {
  userInfo: user;
}

export interface SendingChangeDataMessage extends SendingMessage {
  changedData: user;
}
export interface ExpectedRespondingChangeDataMessage
  extends ExpectedRespondingMessage {}

// TTS
export interface SendingTTSSpeakMessage extends SendingMessage {
  speak: string;
}
export interface ExpectedRespondingTTSSpeakMessage
  extends ExpectedRespondingMessage {}
export interface SendingTTSStopMessage extends SendingMessage {}
export interface ExpectedRespondingTTSStopMessage
  extends ExpectedRespondingMessage {}

// AI
export interface SendingAIMessage<T> {
  referencedData: T;
  degree: number;
  speak?: boolean;
  log?: boolean;
}

export interface ExpectedRespondingAIMessage {
  script: string;
  spoken: boolean;
  logged: boolean;
}

export interface SendingPageAnalyzerMessage
  extends SendingAIMessage<ExtractedWebPageContent>,
    SendingMessage {}
export interface SendingImageAnalyzerMessage
  extends SendingMessage,
    SendingAIMessage<string> {}
export interface SendingTextSummarizerMessage
  extends SendingMessage,
    SendingAIMessage<string> {}

export interface ExpectedRespondingPageAnalyzerMessage
  extends ExpectedRespondingMessage,
    ExpectedRespondingAIMessage {}
export interface ExpectedRespondingImageAnalyzerMessage
  extends ExpectedRespondingMessage,
    ExpectedRespondingAIMessage {}
export interface ExpectedRespondingTextSummarizerMessage
  extends ExpectedRespondingMessage,
    ExpectedRespondingAIMessage {}

export type responseCallback<
  T extends SendingMessage,
  U extends ExpectedRespondingMessage
> = (
  message: SendingMessageShape<T>,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: RespondingMessageShape<U>) => void
) => Promise<boolean> | boolean;

export type sendResponseCallback<T extends ExpectedRespondingMessage> = (
  response: RespondingMessageShape<T>
) => void;

type RespondingMessageError = "NOT_FOUND" | "LISTENER_ERROR";
export interface RespondingMessageShape<T extends ExpectedRespondingMessage> {
  body: T;
  successfullyProcessed: true | RespondingMessageError;
}

export type RespondingMessageMainFunction<
  T extends SendingMessage,
  U extends ExpectedRespondingMessage
> = (
  message: SendingMessageShape<T>,
  sender: chrome.runtime.MessageSender
) => Promise<U> | U;
