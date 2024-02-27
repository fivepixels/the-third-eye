import {
  ExpectedRespondingChangeDataMessage,
  ExpectedRespondingFetchDataMessage,
  RespondingMessageMainFunction,
  SendingChangeDataMessage,
  SendingFetchDataMessage
} from "@src/shapes/message";
import user from "@src/shapes/user";
import AttachListener from "./messenge";

const fetchDataCallback: RespondingMessageMainFunction<
  SendingFetchDataMessage,
  ExpectedRespondingFetchDataMessage
> = async () => {
  const userInfo = (await chrome.storage.sync.get()) as user;

  return {
    userInfo
  };
};

const changeDataCallback: RespondingMessageMainFunction<
  SendingChangeDataMessage,
  ExpectedRespondingChangeDataMessage
> = async message => {
  await chrome.storage.sync.set(message.body.changedData);

  return {
    updated: true
  };
};

chrome.runtime.onMessage.addListener(AttachListener("FETCH_DATA", fetchDataCallback));
chrome.runtime.onMessage.addListener(AttachListener("CHANGE_DATA", changeDataCallback));
