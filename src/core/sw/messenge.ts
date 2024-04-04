import {
  ExpectedRespondingMessage,
  RespondingMessageMainFunction,
  SendingMessage,
  SendingMessageType,
  responseCallback
} from "@shapes/message";

export default function AttachListener<
  T extends SendingMessage,
  U extends ExpectedRespondingMessage
>(
  messageType: SendingMessageType,
  mainFunction: RespondingMessageMainFunction<T, U>
): responseCallback<T, U> {
  return (message, sender, sendResponse) => {
    if (message.type !== messageType) return false;

    (async () => {
      try {
        const responseBody = await mainFunction(message, sender);

        sendResponse({ body: responseBody, successfullyProcessed: true });
      } catch (error) {
        sendResponse({
          body: {} as U,
          successfullyProcessed: "LISTENER_ERROR"
        });
      }
    })();

    return true;
  };
}
