import {
  ExpectedRespondingMessage,
  RespondingMessageShape,
  SendingMessage,
  SendingMessageShape
} from "@src/shapes/message";

interface SendingMessageReceive<T extends SendingMessage, U extends ExpectedRespondingMessage> {
  messageBody: SendingMessageShape<T>;
  onMessageReceive: (body: U) => void;
  onError: (errorMessage: string) => void;
}

export function sendCommandMessage<T extends SendingMessage, U extends ExpectedRespondingMessage>({
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

export async function getResponseFromMessage<
  T extends SendingMessage,
  U extends ExpectedRespondingMessage
>(messageBody: SendingMessageShape<T>): Promise<U> {
  const response = await chrome.runtime.sendMessage<
    SendingMessageShape<T>,
    RespondingMessageShape<U>
  >(messageBody);

  return response.body;
}
