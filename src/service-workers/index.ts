/**
 * Copyright 2024 Seol SO
 * SPDX-License-Identifier: MIT
 * Service Workers - Index
 */

import type {
  ExpectedRespondingFetchDataMessage,
  RespondingMessageMainFunction,
  SendingChangeDataMessage,
  SendingFetchDataMessage,
  SendingImageAnalyzerMessage,
  SendingPageAnalyzerMessage,
  SendingTTSSpeakMessage,
  SendingTTSStopMessage,
  SendingTextSummarizerMessage,
} from "@type/message";
import type user from "@type/user";
import { ColourDeficiency } from "@type/user";
import { analyzeImage, analyzePage, analyzeText } from "./ai";
import AttachListener from "./message";

const fetchDataCallback: RespondingMessageMainFunction<
  SendingFetchDataMessage,
  ExpectedRespondingFetchDataMessage
> = async () => {
  const userInfo = (await chrome.storage.sync.get()) as user;

  return {
    userInfo,
  };
};

const changeDataCallback: RespondingMessageMainFunction<
  SendingChangeDataMessage
> = async (message) => {
  await chrome.storage.sync.set(message.body.changedData);

  return;
};

const ttsCallback: RespondingMessageMainFunction<SendingTTSSpeakMessage> =
  async (message) => {
    chrome.tts.speak(message.body.speak);

    return;
  };

const ttsStopCallback: RespondingMessageMainFunction<SendingTTSStopMessage> =
  async () => {
    chrome.tts.stop();

    return;
  };

const pageAnalyzerCallback: RespondingMessageMainFunction<
  SendingPageAnalyzerMessage
> = async ({ body: { pageData } }) => {
  chrome.tts.speak("Wait a second, we are analyzing the current page");
  const script = await analyzePage(pageData);
  chrome.tts.stop();
  chrome.tts.speak(script);

  return;
};

const ImageAnalyzerCallback: RespondingMessageMainFunction<
  SendingImageAnalyzerMessage
> = async ({ body: { imageUrl } }) => {
  chrome.tts.speak("Wait a second, we are analyzing the current text");
  const script = await analyzeImage(imageUrl);
  chrome.tts.stop();
  chrome.tts.speak(script);

  return;
};

const textSummarizerCallback: RespondingMessageMainFunction<
  SendingTextSummarizerMessage
> = async ({ body: { text } }) => {
  chrome.tts.speak("Wait a second, we are analyzing the current text");
  const script = await analyzeText(text);
  chrome.tts.stop();
  chrome.tts.speak(script);

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
          deficiency: ColourDeficiency.MONOCHROMACY,
        },
        ai: {
          apiKey: "",
          degree: 3,
        },
      },
    } as user);
  }

  return;
};

initializeServiceWorker();

chrome.runtime.onMessage.addListener(
  AttachListener("FETCH_DATA", fetchDataCallback),
);
chrome.runtime.onMessage.addListener(
  AttachListener("CHANGE_DATA", changeDataCallback),
);
chrome.runtime.onMessage.addListener(AttachListener("TTS", ttsCallback));
chrome.runtime.onMessage.addListener(
  AttachListener("TTS_STOP", ttsStopCallback),
);
chrome.runtime.onMessage.addListener(
  AttachListener("PAGE_ANALYZER", pageAnalyzerCallback),
);
chrome.runtime.onMessage.addListener(
  AttachListener("IMAGE_ANALYZER", ImageAnalyzerCallback),
);
chrome.runtime.onMessage.addListener(
  AttachListener("TEXT_ANALYZER", textSummarizerCallback),
);
