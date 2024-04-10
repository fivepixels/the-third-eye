import {
  ExpectedRespondingMessage,
  RespondingMessageShape,
  SendingMessage,
  SendingMessageShape
} from "@shapes/message";

interface SendingMessageReceive<
  T extends SendingMessage,
  U = ExpectedRespondingMessage | undefined
> {
  messageBody: SendingMessageShape<T>;
  onMessageReceive?: (body: U) => void;
  onError?: (errorMessage: string) => void;
}

export function sendCommandMessage<
  T extends SendingMessage,
  U = ExpectedRespondingMessage | undefined
>({ messageBody, onMessageReceive }: SendingMessageReceive<T, U>): void {
  chrome.runtime.sendMessage<SendingMessageShape<T>, RespondingMessageShape<U>>(
    messageBody,
    response => {
      if (onMessageReceive) onMessageReceive(response.body);
    }
  );
}

export async function getResponseFromMessage<
  T extends SendingMessage,
  U extends ExpectedRespondingMessage | undefined
>(messageBody: SendingMessageShape<T>): Promise<U> {
  const response = await chrome.runtime.sendMessage<
    SendingMessageShape<T>,
    RespondingMessageShape<U>
  >(messageBody);

  return response.body;
}
