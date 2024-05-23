/**
 * Copyright 2024 Seol SO
 * SPDX-License-Identifier: MIT
 * Service Workers - Message
 */

import type {
  ExpectedRespondingMessage,
  RespondingMessageMainFunction,
  RespondingMessageShape,
  SendingMessage,
  SendingMessageShape,
  SendingMessageType,
} from "@type/message";

export type responseCallback<
  T extends SendingMessage,
  U extends ExpectedRespondingMessage | undefined,
> = (
  message: SendingMessageShape<T>,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: RespondingMessageShape<U | undefined>) => void,
) => Promise<boolean> | boolean;

export default function AttachListener<
  T extends SendingMessage,
  U extends ExpectedRespondingMessage | undefined,
>(
  messageType: SendingMessageType,
  mainFunction: RespondingMessageMainFunction<T, U>,
): responseCallback<T, U | undefined> {
  return (message, sender, sendResponse) => {
    if (message.type !== messageType) return false;

    (async () => {
      try {
        const responseBody = await mainFunction(message, sender);

        sendResponse({
          body: responseBody,
        });
      } catch (error) {
        sendResponse({
          body: {} as U,
        });
      }
    })();

    return true;
  };
}
