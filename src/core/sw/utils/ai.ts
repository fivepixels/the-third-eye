import { ExtractedWebPageContent } from "@shapes/analyzer";
import { AIContent, AIModels } from "@src/shapes/ai";
import user, { AIPreference } from "@src/shapes/user";

export const AIErrorMessages = {
  404: "There is no API Key input or the API Key is not valid. If you have entered the API key, then please refresh the page or change it.",
  500: "There was an error while communicating with the AI. Please attempt again."
};

interface AskAIReceive {
  model: AIModels;
  messages: AIContent[];
  apiKey?: string;
  temperature?: number;
}

export async function askAI(questionInfo: AskAIReceive): Promise<string> {
  if (
    !questionInfo.apiKey ||
    questionInfo.apiKey === "" ||
    questionInfo.apiKey.length <= 50
  ) {
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

export async function getAIPreference(): Promise<AIPreference> {
  return ((await chrome.storage.sync.get()) as user).personalPreference.ai;
}

export async function analyzePage(
  webpageContent: ExtractedWebPageContent
): Promise<string> {
  const { apiKey, degree } = await getAIPreference();

  const script = await askAI({
    apiKey,
    model: "gpt-3.5-turbo",
    temperature: getTemperature(degree),
    messages: [
      {
        role: "system",
        content:
          'You are the assistant for Blind People exploring websites in a Google Chrome Extension called "The Third Eye." Your name is Bob for now. Your main job is to generate a script for blind people to understand the website based on the analyzed serialized JSON object provided as a string. The JSON object will introduce you to the metadata, which is additional information about the page, and the main page data, which includes all Inner Text of the page, all headings, links and images.'
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: generateUserScript(degree)
          },
          {
            type: "text",
            text:
              "This is the metadata: " + JSON.stringify(webpageContent.metadata)
          },
          {
            type: "text",
            text:
              "This is the all headings: " +
              JSON.stringify(webpageContent.main.headings)
          },
          {
            type: "text",
            text:
              "This is all links included: " +
              JSON.stringify(webpageContent.main.links)
          },
          {
            type: "text",
            text:
              "This is all images attached: " +
              JSON.stringify(webpageContent.main.images)
          },
          {
            type: "text",
            text:
              "This is the innerText property of the body: " +
              JSON.stringify(webpageContent.main.innerText)
          }
        ]
      }
    ]
  });

  return script;
}

export async function analyzeImage(selectedImageURL: string): Promise<string> {
  const { apiKey, degree } = await getAIPreference();

  const script = await askAI({
    apiKey,
    model: "gpt-4-vision-preview",
    temperature: getTemperature(degree),
    messages: [
      {
        role: "system",
        content:
          'You are the assistant for Blind People exploring websites in a Google Chrome Extension called  "The Third Eye." Your name is Bob for now. Your main job is to generate a script for blind people to understand a provided image. TTS will speak the script in Google Chrome Extension.'
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: generateUserScript(degree)
          },
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

export async function analyzeText(selectedText: string): Promise<string> {
  const { apiKey, degree } = await getAIPreference();

  const script = askAI({
    apiKey,
    model: "gpt-3.5-turbo",
    temperature: getTemperature(degree),
    messages: [
      {
        role: "system",
        content:
          'You are the assistant for Blind People exploring websites in a Google Chrome Extension called  "The Third Eye." Your name is Bob for now. Your main job is to summarize the provided text and generate a script for blind people to understand a provided text. TTS will speak the script in Google Chrome Extension.'
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: generateUserScript(degree)
          },
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

function generateUserScript(degree: number): string {
  const adjective =
    degree === 1
      ? "simple and consice"
      : degree === 2
        ? "normal"
        : "long fully descriptive";

  return `Generate a ${adjective} script for blind people. Print ONLY SCRIPT please.`;
}

function getTemperature(degree: number): number {
  return (degree / 10) * 1.4;
}
