import {
  ExpectedRespondingPageAnalyzerMessage,
  ExpectedRespondingChangeDataMessage,
  ExpectedRespondingFetchDataMessage,
  RespondingMessageMainFunction,
  SendingPageAnalyzerMessage,
  SendingChangeDataMessage,
  SendingFetchDataMessage,
  SendingImageAnalyzerMessage,
  ExpectedRespondingImageAnalyzerMessage,
  SendingTextSummarizerMessage,
  ExpectedRespondingTextSummarizerMessage,
  SendingTTSMessage,
  ExpectedRespondingTTSMessage,
  SendingTTSStopMessage,
  ExpectedRespondingTTSStopMessage
} from "@src/shapes/message";
import user from "@src/shapes/user";
import AttachListener from "./messenge";
import AIManager from "./aiManager";

const aiManager = new AIManager();

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

const ttsCallback: RespondingMessageMainFunction<
  SendingTTSMessage,
  ExpectedRespondingTTSMessage
> = async message => {
  chrome.tts.speak(message.body.speak);

  return;
};

const ttsStopCallback: RespondingMessageMainFunction<
  SendingTTSStopMessage,
  ExpectedRespondingTTSStopMessage
> = async () => {
  chrome.tts.stop();

  return;
};

const analyzePageCallback: RespondingMessageMainFunction<
  SendingPageAnalyzerMessage,
  ExpectedRespondingPageAnalyzerMessage
> = async message => {
  const analyzedPageScript = await aiManager.analyzePage(message.body.webpageData);

  return {
    script: analyzedPageScript
  };
};

const analyzeImageCallback: RespondingMessageMainFunction<
  SendingImageAnalyzerMessage,
  ExpectedRespondingImageAnalyzerMessage
> = async message => {
  const analyzedImageScript = await aiManager.analyzeImage(message.body.imageUrl);

  return {
    script: analyzedImageScript
  };
};

const summarizeTextCallback: RespondingMessageMainFunction<
  SendingTextSummarizerMessage,
  ExpectedRespondingTextSummarizerMessage
> = async message => {
  const summarizedScript = await aiManager.summarizeText(message.body.text);

  if (message.body.speak) {
    chrome.tts.speak(summarizedScript);
  }

  return {
    script: summarizedScript
  };
};

chrome.runtime.onMessage.addListener(AttachListener("FETCH_DATA", fetchDataCallback));
chrome.runtime.onMessage.addListener(AttachListener("CHANGE_DATA", changeDataCallback));
chrome.runtime.onMessage.addListener(AttachListener("TTS", ttsCallback));
chrome.runtime.onMessage.addListener(AttachListener("TTS_STOP", ttsStopCallback));
chrome.runtime.onMessage.addListener(AttachListener("PAGE_ANALYZER", analyzePageCallback));
chrome.runtime.onMessage.addListener(AttachListener("IMAGE_ANALYZER", analyzeImageCallback));
chrome.runtime.onMessage.addListener(AttachListener("TEXT_SUMMARIZER", summarizeTextCallback));
