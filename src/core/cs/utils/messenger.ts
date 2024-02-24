import {
  ExpectedRespondingMessage,
  RespondingMessageShape,
  SendingMessage,
  SendingMessageShape,
  SendingMessageType
} from "@src/shapes/message";

interface SendingMessageReceive<T extends SendingMessage, U extends ExpectedRespondingMessage> {
  messageBody: SendingMessageShape<T>;
  onMessageReceive: (body: U) => void;
  onError: (errorMessage: string) => void;
}

export function sendMessage<T extends SendingMessage, U extends ExpectedRespondingMessage>({
  messageBody,
  onMessageReceive,
  onError
}: SendingMessageReceive<T, U>) {
  chrome.runtime.sendMessage<SendingMessageShape<T>, RespondingMessageShape<U>>(
    messageBody,
    response => {
      if (!response.successfullyProcessed) {
        onError(response.successfullyProcessed);
        return;
      }

      onMessageReceive(response.body);
    }
  );
}

export function getResponseFromMessage<
  T extends SendingMessage,
  U extends ExpectedRespondingMessage
>(messageType: SendingMessageType, msg: T): U | string {
  let responseBody: U | string = "";

  chrome.runtime.sendMessage<SendingMessageShape<T>, RespondingMessageShape<U>>(
    {
      body: msg,
      type: messageType
    },
    response => {
      if (typeof response.successfullyProcessed === "string") {
        responseBody = response.successfullyProcessed;
        return;
      } else {
        responseBody = response.body as U;
      }
    }
  );

  return responseBody;
}
