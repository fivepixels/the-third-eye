import user, { Helpers } from "./user";

export type SendingMessageType =
  | "FETCH_DATA"
  | "CHANGE_DATA"
  | "HTTP"
  | "MULTIDIMENSION_AI"
  | "CHOICER";

export interface SendingMessageShape<T> {
  body: T;
  type: SendingMessageType;
}

export interface SendingFetchDataMessage {
  wantedField: keyof user;
}

export interface ExpectedRespondingFetchDataMessage {
  fetchedData: {
    asdf: string;
  };
}

export interface SendingChangeDataMessage {
  changedData: (prevData: user) => user;
}

export interface ExpectedRespondingChangeDataMessage {
  isChangedSuccessfully: true | string;
  changedData: user;
}

export interface SeningMultidimensionalAIMessage {
  pageImageUrl: string;
  userSituation: user;
  sendingHelper: Helpers;
}

export interface ExpectedRespondingMultidimensionalAIMessage {
  script: string;
}

export interface SendingChoicerAIMessage {
  situmation: {
    name: string;
    description: string;
  };
  givenOptions: string[];
}

export interface ExpectedRespondingChoicerAIMessage {
  selectedOptions: string;
}

export interface RespondingMessageShape<T> {
  body: T;
  successfullyProcessed: true | string;
}
