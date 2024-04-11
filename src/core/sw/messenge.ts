import {
  ExpectedRespondingMessage,
  RespondingMessageMainFunction,
  SendingMessage,
  SendingMessageType,
  responseCallback
} from "@shapes/message";

export default function AttachListener<
  T extends SendingMessage,
  U extends ExpectedRespondingMessage | undefined
>(
  messageType: SendingMessageType,
  mainFunction: RespondingMessageMainFunction<T, U>
): responseCallback<T, U | undefined> {
  return (message, sender, sendResponse) => {
    if (message.type !== messageType) return false;

    (async () => {
      try {
        const responseBody = await mainFunction(message, sender);

        sendResponse({
          body: responseBody
        });
      } catch (error) {
        sendResponse({
          body: {} as U
        });
      }
    })();

    return true;
  };
}
