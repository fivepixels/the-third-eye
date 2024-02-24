import MessageManager from "./messageController";
import StorageManager from "./storageController";

chrome.runtime.onInstalled.addListener(async () => {
  const messageManager = new MessageManager();
  const storageManager = new StorageManager();

  chrome.storage.sync.set({
    isConfigured: true,
    abilities: "asfjlafklj",
    problesm: 20
  });

  const tteData = await chrome.storage.sync.get();
});
