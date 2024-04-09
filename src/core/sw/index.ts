import {
  ExpectedRespondingFetchDataMessage,
  RespondingMessageMainFunction,
  SendingChangeDataMessage,
  SendingFetchDataMessage,
  SendingImageAnalyzerMessage,
  SendingTTSSpeakMessage,
  SendingTTSStopMessage,
  SendingTextSummarizerMessage,
  SendingPageAnalyzerMessage
} from "@shapes/message";
import user, { ColourDeficiency } from "@shapes/user";
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
  SendingChangeDataMessage
> = async message => {
  await chrome.storage.sync.set(message.body.changedData);

  return;
};

const ttsCallback: RespondingMessageMainFunction<
  SendingTTSSpeakMessage
> = async message => {
  chrome.tts.speak(message.body.speak);

  return;
};

const ttsStopCallback: RespondingMessageMainFunction<
  SendingTTSStopMessage
> = async () => {
  chrome.tts.stop();

  return;
};

const pageAnalyzerCallback: RespondingMessageMainFunction<
  SendingPageAnalyzerMessage
> = async () => {
  chrome.tts.speak("Wait a second, we are analyzing the current page");
  chrome.tts.stop();

  // const analyzedPageScript = await aiManager.analyzePage(
  //   message.body.referencedData,
  //   message.body.degree
  // );

  return;
};

const ImageAnalyzerCallback: RespondingMessageMainFunction<
  SendingImageAnalyzerMessage
> = async () => {
  chrome.tts.speak("Wait a second, we are analyzing the current image");

  // const analyzedImageScript = await aiManager.analyzeImage(
  //   message.body.referencedData,
  //   message.body.degree
  // );

  chrome.tts.stop();

  return;
};

const textSummarizerCallback: RespondingMessageMainFunction<
  SendingTextSummarizerMessage
> = async ({ body: { text } }) => {
  chrome.tts.speak("Wait a second, we are analyzing the current text");

  // const summarizedScript = await aiManager.summarizeText(
  //   message.body.referencedData,
  //   message.body.degree
  // );
  // chrome.tts.speak(summarizedScript);

  chrome.tts.stop();

  return;
};

const initializeServiceWorker = async (): Promise<void> => {
  const userInfo = (await chrome.storage.sync.get()) as user;

  if (!userInfo.isCreated) {
    await chrome.storage.sync.set({
      isCreated: true,
      neededHelpers: [],
      personalPreference: {
        colourAdjuster: {
          deficiency: ColourDeficiency.MONOCHROMACY
        },
        ai: {
          degree: 3
        }
      }
    } as user);
  }

  await fetch();

  return;
};

initializeServiceWorker();

chrome.runtime.onMessage.addListener(
  AttachListener("FETCH_DATA", fetchDataCallback)
);
chrome.runtime.onMessage.addListener(
  AttachListener("CHANGE_DATA", changeDataCallback)
);
chrome.runtime.onMessage.addListener(AttachListener("TTS", ttsCallback));
chrome.runtime.onMessage.addListener(
  AttachListener("TTS_STOP", ttsStopCallback)
);
chrome.runtime.onMessage.addListener(
  AttachListener("PAGE_ANALYZER", pageAnalyzerCallback)
);
chrome.runtime.onMessage.addListener(
  AttachListener("IMAGE_ANALYZER", ImageAnalyzerCallback)
);
chrome.runtime.onMessage.addListener(
  AttachListener("TEXT_SUMMARIZER", textSummarizerCallback)
);
