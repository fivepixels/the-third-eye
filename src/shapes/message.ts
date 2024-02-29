import { AIType } from "./ai";
import { ExtractedWebPageContent } from "./analyzer";
import user from "./user";

export type SendingMessageType =
  | "FETCH_DATA"
  | "CHANGE_DATA"
  | "TTS"
  | "TTS_STOP"
  | "OPEN_ONBOARDING"
  | AIType;

export interface SendingMessageShape<T extends SendingMessage> {
  body: T;
  type: SendingMessageType;
}

export interface SendingMessage {}
export interface ExpectedRespondingMessage {}

// FETCH_DATA
export interface SendingFetchDataMessage extends SendingMessage {}

export interface ExpectedRespondingFetchDataMessage extends ExpectedRespondingMessage {
  userInfo: user;
}

// CHANGE_DATA
export interface SendingChangeDataMessage extends SendingMessage {
  changedData: user;
}

export interface ExpectedRespondingChangeDataMessage extends ExpectedRespondingMessage {
  updated: boolean;
}

// TTS
export interface SendingTTSMessage extends SendingMessage {
  speak: string;
}

export interface ExpectedRespondingTTSMessage extends ExpectedRespondingMessage {}

export interface SendingTTSStopMessage extends SendingMessage {}

export interface ExpectedRespondingTTSStopMessage extends ExpectedRespondingMessage {}

// OPEN_ONBOARDING
export interface SendingOpenOnbardingMessage extends SendingMessage {
  openTabProperties: chrome.tabs.CreateProperties;
}

export interface ExpectedRespondingOpenOnboardingMessage extends ExpectedRespondingMessage {
  openSuccessfully: boolean;
  tabId: number;
}

// AI
export interface SendingPageAnalyzerMessage extends SendingMessage {
  webpageData: ExtractedWebPageContent;
}

export interface ExpectedRespondingPageAnalyzerMessage extends ExpectedRespondingMessage {
  script: string;
}

export interface SendingImageAnalyzerMessage extends SendingMessage {
  imageUrl: string;
}

export interface ExpectedRespondingImageAnalyzerMessage extends ExpectedRespondingMessage {
  script: string;
}

export interface SendingTextSummarizerMessage extends SendingMessage {
  text: string;
  speak?: boolean;
}

export interface ExpectedRespondingTextSummarizerMessage extends ExpectedRespondingMessage {
  script: string;
}

// CHOICER
export interface SendingChoicerMessage extends SendingMessage {
  situmation: {
    name: string;
    description: string;
  };
  givenOptions: string[];
}

export interface ExpectedRespondingChoicerMessage extends ExpectedRespondingMessage {
  selectedOptions: string;
}

export type responseCallback<T extends SendingMessage, U extends ExpectedRespondingMessage> = (
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
> = (message: SendingMessageShape<T>, sender: chrome.runtime.MessageSender) => Promise<U> | U;
