import user, { Helpers } from "./user";

export type SendingMessageType =
  | "FETCH_DATA"
  | "CHANGE_DATA"
  | "OPEN_ONBOARDING"
  | "AI"
  | "CHOICER";

export interface SendingMessageShape<T extends SendingMessage> {
  body: T;
  type: SendingMessageType;
}

export interface SendingMessage {}
export interface ExpectedRespondingMessage {}

// FETCH_DATA
export interface SendingFetchDataMessage extends SendingMessage {
  wantedField: keyof user | "ALL" | (keyof user)[];
}

export interface ExpectedRespondingFetchDataMessage extends ExpectedRespondingMessage {
  fetchedData: Partial<user>;
}

// CHANGE_DATA
export interface SendingChangeDataMessage extends SendingMessage {
  changedData: (prevData: user) => user;
}

export interface ExpectedRespondingChangeDataMessage extends ExpectedRespondingMessage {
  isChangedSuccessfully: true | string;
  changedData: user;
}

// OPEN_ONBOARDING
export interface SendingOpenOnbardingMessage extends SendingMessage {
  openTabProperties: chrome.tabs.CreateProperties;
}

export interface ExpectedRespondingOpenOnboardingMessage extends ExpectedRespondingMessage {
  openSuccessfully: boolean;
  tabId: number;
}

// AI
export interface SendingAIMessage extends SendingMessage {
  pageImageUrl: string;
  userSituation: user;
  sendingHelper: Helpers;
}

export interface ExpectedRespondingAIMessage extends ExpectedRespondingMessage {
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
) => void;

export type sendResponseCallback<T extends ExpectedRespondingMessage> = (
  response: RespondingMessageShape<T>
) => void;

type RespondingMessageError = "NOT_FOUND" | "LISTENER_ERROR";
export interface RespondingMessageShape<T extends ExpectedRespondingMessage> {
  body: T;
  successfullyProcessed: true | RespondingMessageError;
}
