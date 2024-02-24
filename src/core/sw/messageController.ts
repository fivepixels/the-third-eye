import {
  ExpectedRespondingMessage,
  RespondingMessageShape,
  SendingMessage,
  SendingMessageShape,
  SendingMessageType,
  responseCallback,
  sendResponseCallback
} from "@src/shapes/message";

interface Listener {
  enabled: boolean;
  listenerType: SendingMessageType;
  listener: responseCallback<SendingMessage, ExpectedRespondingMessage>;
}

class MessageManager {
  private messageListeners: Listener[];

  constructor() {
    this.messageListeners = [];
  }

  public attach(
    message: SendingMessageShape<SendingMessage>,
    sender: chrome.runtime.MessageSender,
    sendResponse: sendResponseCallback<ExpectedRespondingMessage>
  ) {
    const matchedListener = this.messageListeners.find(
      listener => listener.listenerType === message.type
    );

    if (!matchedListener) {
      sendResponse({
        body: {},
        successfullyProcessed: "NOT_FOUND"
      });

      return;
    }

    try {
      matchedListener.listener(message, sender, sendResponse);
    } catch (error) {
      sendResponse({
        body: {},
        successfullyProcessed: "LISTENER_ERROR"
      });
    }
  }

  private returnNotFound() {}

  public addListener(
    listenerType: SendingMessageType,
    listener: responseCallback<SendingMessage, ExpectedRespondingMessage>
  ) {
    this.messageListeners.push({
      listenerType,
      listener,
      enabled: true
    });
  }

  public adjustEnabling(listenerType: SendingMessageType, enablingTo: boolean): boolean {
    const foundMessageListener = this.messageListeners.find(
      value => value.listenerType === listenerType
    );

    if (typeof foundMessageListener === "undefined") return false;

    this.messageListeners.forEach((value, valueIndex) => {
      const isDisablingListener = value.listenerType === listenerType;

      if (!isDisablingListener) return;

      this.messageListeners[valueIndex].enabled = enablingTo;
    });

    return true;
  }
}

export default MessageManager;
