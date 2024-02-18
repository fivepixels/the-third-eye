import {
  RespondingMessageCallback,
  SendingMessageShape,
  SendingMessageType
} from "@src/types/message";

interface SendingMessageOpts<T> {
  messageType: SendingMessageType;
  body: T;
}

function sendMessage<T, U>(
  messageOpts: SendingMessageOpts<T>,
  responseCallback: RespondingMessageCallback<U>
) {
  chrome.runtime.sendMessage<SendingMessageShape<T>, U>(
    {
      ...messageOpts,
      sentAt: ""
    },
    responseCallback
  );
}

export default sendMessage;
