import { SendingMessageShape, ServiceWorkerType } from "message";

chrome.runtime.onMessage.addListener((msg: SendingMessageShape) => {
  if (Object.keys(ServiceWorkerType).includes(msg.messageType)) {
    console.log("~!");
  }
});

window.onload = async () => {
  chrome.runtime.sendMessage({ hello: "World" }, () => {
    console.log("GOT RESPONSE");
  });
};
