import {
  SendingMessageType,
  RespondingMessageShape,
  SendingMessageShape
} from "@src/shapes/message";

function sendMessage<T, U>(
  messageType: SendingMessageType,
  msg: T,
  onMessageReceive: (body: U) => void,
  onError: (errorMessage: string) => void
) {
  chrome.runtime.sendMessage<SendingMessageShape<T>, RespondingMessageShape<U>>(
    {
      body: msg,
      type: messageType
    },
    response => {
      if (!response.successfullyProcessed) {
        onError(response.successfullyProcessed);
        return;
      }

      onMessageReceive(response.body);
    }
  );
}

export default sendMessage;
