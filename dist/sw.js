// types/user.ts
var Helpers;
(function(Helpers2) {
  Helpers2["MOVER"] = "MOVER";
  Helpers2["COLOUR_ADJUSTER"] = "COLOUR_ADJUSTER";
  Helpers2["PAGE_ANALYZER"] = "PAGE_ANALYZER";
  Helpers2["IMAGE_ANALYZER"] = "IMAGE_ANALYZER";
  Helpers2["TEXT_ANALYZER"] = "TEXT_ANALYZER";
})(Helpers || (Helpers = {}));
var ColourDeficiency;
(function(ColourDeficiency2) {
  ColourDeficiency2["PROTANOPIA"] = "PROTANOPIA";
  ColourDeficiency2["DEUTERANOPIA"] = "DEUTERANOPIA";
  ColourDeficiency2["TRITANOPIA"] = "TRITANOPIA";
  ColourDeficiency2["PROTANOMALY"] = "PROTANOMALY";
  ColourDeficiency2["DEUTERANOMALY"] = "DEUTERANOMALY";
  ColourDeficiency2["TRITANOMALY"] = "TRITANOMALY";
  ColourDeficiency2["MONOCHROMACY"] = "MONOCHROMACY";
})(ColourDeficiency || (ColourDeficiency = {}));

// src/service-workers/ai.ts
async function askAI(questionInfo) {
  if (!questionInfo.apiKey || questionInfo.apiKey === "" || questionInfo.apiKey.length <= 50) {
    return AIErrorMessages[404];
  }
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${questionInfo.apiKey}`
      },
      body: JSON.stringify({
        model: questionInfo.model,
        temperature: questionInfo.temperature,
        messages: questionInfo.messages
      })
    });
    const json = await response.json();
    return json.choices[0].message.content;
  } catch (error) {
    console.error(`AI ERROR: ${error}`);
    return AIErrorMessages[500];
  }
}
async function getAIPreference() {
  return (await chrome.storage.sync.get()).personalPreference.ai;
}
async function analyzePage(webpageContent) {
  const { apiKey, degree } = await getAIPreference();
  const script = await askAI({
    apiKey,
    model: "gpt-3.5-turbo",
    temperature: getTemperature(degree),
    messages: [
      {
        role: "system",
        content: generateUserScript(degree, "an analyzed serialized JSON object provided as a string. The JSON object will introduce you to the metadata, which is additional information about the page, and the main page data, which includes all Inner Text of the page, all headings, links and images.")
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `This is the metadata: ${JSON.stringify(webpageContent.metadata)}`
          },
          {
            type: "text",
            text: `This is the all headings: ${JSON.stringify(webpageContent.main.headings)}`
          },
          {
            type: "text",
            text: `This is all links included: ${JSON.stringify(webpageContent.main.links)}`
          },
          {
            type: "text",
            text: `This is all images attached: ${JSON.stringify(webpageContent.main.images)}`
          },
          {
            type: "text",
            text: `This is the innerText property of the body: ${JSON.stringify(webpageContent.main.innerText)}`
          }
        ]
      }
    ]
  });
  return script;
}
async function analyzeImage(selectedImageURL) {
  const { apiKey, degree } = await getAIPreference();
  const script = await askAI({
    apiKey,
    model: "gpt-4-vision-preview",
    temperature: getTemperature(degree),
    messages: [
      {
        role: "system",
        content: generateUserScript(degree, "an image url to analyze")
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: selectedImageURL,
              detail: degree === 1 ? "low" : degree === 2 ? "auto" : "high"
            }
          }
        ]
      }
    ]
  });
  return script;
}
async function analyzeText(selectedText) {
  const { apiKey, degree } = await getAIPreference();
  const script = askAI({
    apiKey,
    model: "gpt-3.5-turbo",
    temperature: getTemperature(degree),
    messages: [
      {
        role: "system",
        content: generateUserScript(degree, "a groupe of texts")
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: selectedText
          }
        ]
      }
    ]
  });
  return script;
}
var generateUserScript = function(degree, after) {
  const adjective = degree === 1 ? "very simple and consice" : degree === 2 ? "normal" : "long fully descriptive";
  return `You are the assistant in a Google Chrome Extension called "The Third Eye," for Visually Impaired People exploring websites. Your main job is to generate a ${adjective} script for visually imparied people to understand the website based on the provided information. The script that you generate will then be spoken by TTS in Google Chrome Extension. For now, you will get ${after}. Like I mentioned, you have to make a ${adjective} script for blind people. Print ONLY SCRIPT please. GO.`;
};
var getTemperature = function(degree) {
  return degree / 10 * 1.4;
};
var AIErrorMessages = {
  404: "There is no API Key input or the API Key is not valid. If you have entered the API key, then please refresh the page or change it.",
  500: "There was an error while communicating with the AI. Please attempt again."
};

// src/service-workers/message.ts
function AttachListener(messageType, mainFunction) {
  return (message, sender, sendResponse) => {
    if (message.type !== messageType)
      return false;
    (async () => {
      try {
        const responseBody = await mainFunction(message, sender);
        sendResponse({
          body: responseBody
        });
      } catch (error) {
        sendResponse({
          body: {}
        });
      }
    })();
    return true;
  };
}

// src/service-workers/index.ts
var fetchDataCallback = async () => {
  const userInfo = await chrome.storage.sync.get();
  return {
    userInfo
  };
};
var changeDataCallback = async (message2) => {
  await chrome.storage.sync.set(message2.body.changedData);
  return;
};
var ttsCallback = async (message2) => {
  chrome.tts.speak(message2.body.speak);
  return;
};
var ttsStopCallback = async () => {
  chrome.tts.stop();
  return;
};
var pageAnalyzerCallback = async ({ body: { pageData } }) => {
  chrome.tts.speak("Wait a second, we are analyzing the current page");
  const script = await analyzePage(pageData);
  chrome.tts.stop();
  chrome.tts.speak(script);
  return;
};
var ImageAnalyzerCallback = async ({ body: { imageUrl } }) => {
  chrome.tts.speak("Wait a second, we are analyzing the current image");
  const script = await analyzeImage(imageUrl);
  chrome.tts.stop();
  chrome.tts.speak(script);
  return;
};
var textSummarizerCallback = async ({ body: { text } }) => {
  chrome.tts.speak("Wait a second, we are analyzing the current text");
  const script = await analyzeText(text);
  chrome.tts.stop();
  chrome.tts.speak(script);
  return;
};
var initializeServiceWorker = async () => {
  const userInfo = await chrome.storage.sync.get();
  if (!userInfo.isCreated) {
    await chrome.storage.sync.set({
      isCreated: true,
      neededHelpers: [],
      personalPreference: {
        colourAdjuster: {
          deficiency: ColourDeficiency.MONOCHROMACY
        },
        ai: {
          apiKey: "",
          degree: 3
        }
      }
    });
  }
  return;
};
initializeServiceWorker();
chrome.runtime.onMessage.addListener(AttachListener("FETCH_DATA", fetchDataCallback));
chrome.runtime.onMessage.addListener(AttachListener("CHANGE_DATA", changeDataCallback));
chrome.runtime.onMessage.addListener(AttachListener("TTS", ttsCallback));
chrome.runtime.onMessage.addListener(AttachListener("TTS_STOP", ttsStopCallback));
chrome.runtime.onMessage.addListener(AttachListener("PAGE_ANALYZER", pageAnalyzerCallback));
chrome.runtime.onMessage.addListener(AttachListener("IMAGE_ANALYZER", ImageAnalyzerCallback));
chrome.runtime.onMessage.addListener(AttachListener("TEXT_ANALYZER", textSummarizerCallback));
