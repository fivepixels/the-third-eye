/**
 * Copyright 2024 Seol SO
 * SPDX-License-Identifier: MIT
 */

import { ExtractedWebPageContent } from "@cs/helpers/pageAnaylzer";
import user from "./user";

export type SendingMessageType =
  | "FETCH_DATA"
  | "CHANGE_DATA"
  | "TTS"
  | "TTS_STOP"
  | "OPEN_ONBOARDING"
  | "PAGE_ANALYZER"
  | "IMAGE_ANALYZER"
  | "TEXT_ANALYZER";

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

// TTS
export interface SendingTTSSpeakMessage extends SendingMessage {
  speak: string;
}
export interface SendingTTSStopMessage extends SendingMessage {}

// AI
export interface SendingPageAnalyzerMessage {
  pageData: ExtractedWebPageContent;
}
export interface SendingImageAnalyzerMessage {
  imageUrl: string;
}
export interface SendingTextSummarizerMessage {
  text: string;
}

export interface RespondingMessageShape<
  T = ExpectedRespondingMessage | undefined,
> {
  body: T;
}

export type RespondingMessageMainFunction<
  T extends SendingMessage,
  U = ExpectedRespondingMessage | undefined,
> = (
  message: SendingMessageShape<T>,
  sender: chrome.runtime.MessageSender,
) => Promise<U | undefined> | U | undefined;
