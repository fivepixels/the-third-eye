import { SendingMessage } from "../types";

chrome.runtime.onMessage.addListener((msg: SendingMessage, sender, responseCallback) => {
  responseCallback({
    message: "RESPOND FROM THE SERVICE WORKER!"
  });
});
