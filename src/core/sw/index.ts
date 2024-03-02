import {
  ExpectedRespondingPageAnalyzerMessage,
  ExpectedRespondingChangeDataMessage,
  ExpectedRespondingFetchDataMessage,
  RespondingMessageMainFunction,
  SendingChangeDataMessage,
  SendingFetchDataMessage,
  SendingImageAnalyzerMessage,
  ExpectedRespondingImageAnalyzerMessage,
  SendingTTSSpeakMessage,
  ExpectedRespondingTTSSpeakMessage,
  SendingTTSStopMessage,
  ExpectedRespondingTTSStopMessage,
  SendingTextSummarizerMessage,
  ExpectedRespondingTextSummarizerMessage,
  SendingPageAnalyzerMessage
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
  SendingTTSSpeakMessage,
  ExpectedRespondingTTSSpeakMessage
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

const pageAnalyzerCallback: RespondingMessageMainFunction<
  SendingPageAnalyzerMessage,
  ExpectedRespondingPageAnalyzerMessage
> = async message => {
  let spoken = false;
  let logged = false;
  const analyzedPageScript = await aiManager.analyzePage(message.body.referencedData);

  if (message.body.speak) {
    chrome.tts.speak(analyzedPageScript);
    spoken = true;
  }

  if (message.body.log) {
    console.log(`LOGGING: RESULT FOR PAGE ANALYZER - ${analyzedPageScript}`);
    logged = true;
  }

  return {
    script: analyzedPageScript,
    spoken,
    logged
  };
};

const ImageAnalyzerCallback: RespondingMessageMainFunction<
  SendingImageAnalyzerMessage,
  ExpectedRespondingImageAnalyzerMessage
> = async message => {
  let spoken = false;
  let logged = false;
  const analyzedImageScript = await aiManager.analyzeImage(message.body.referencedData);

  if (message.body.speak) {
    chrome.tts.speak(analyzedImageScript);
    spoken = true;
  }

  if (message.body.log) {
    console.log(`LOGGING: RESULT FOR PAGE ANALYZER - ${analyzedImageScript}`);
    logged = true;
  }
  return {
    script: analyzedImageScript,
    spoken,
    logged
  };
};

const textSummarizerCallback: RespondingMessageMainFunction<
  SendingTextSummarizerMessage,
  ExpectedRespondingTextSummarizerMessage
> = async message => {
  let spoken = false;
  let logged = false;
  const summarizedScript = await aiManager.summarizeText(message.body.referencedData);

  if (message.body.speak) {
    chrome.tts.speak(summarizedScript);
    spoken = true;
  }

  if (message.body.log) {
    console.log(`LOGGING: RESULT FOR PAGE ANALYZER - ${summarizedScript}`);
    logged = true;
  }

  return {
    script: summarizedScript,
    spoken,
    logged
  };
};

chrome.runtime.onMessage.addListener(AttachListener("FETCH_DATA", fetchDataCallback));
chrome.runtime.onMessage.addListener(AttachListener("CHANGE_DATA", changeDataCallback));
chrome.runtime.onMessage.addListener(AttachListener("TTS", ttsCallback));
chrome.runtime.onMessage.addListener(AttachListener("TTS_STOP", ttsStopCallback));
chrome.runtime.onMessage.addListener(AttachListener("PAGE_ANALYZER", pageAnalyzerCallback));
chrome.runtime.onMessage.addListener(AttachListener("IMAGE_ANALYZER", ImageAnalyzerCallback));
chrome.runtime.onMessage.addListener(AttachListener("TEXT_SUMMARIZER", textSummarizerCallback));
