import { OpenAI } from "openai";
import { ExtractedWebPageContent } from "@src/shapes/analyzer";
import ENV_VAR from "./env";

class AIManager {
  private client: OpenAI;

  constructor() {
    console.log(ENV_VAR.OPENAI_API_KEY);

    this.client = new OpenAI({
      apiKey: ENV_VAR.OPENAI_API_KEY
    });
  }

  public async analyzePage(webpageContent: ExtractedWebPageContent): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: "gpt-3.5-turbo",
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
              text: "Generate a script for blind people. Print script only."
            },
            {
              type: "text",
              text: JSON.stringify(webpageContent)
            }
          ]
        }
      ]
    });

    return this.generateScript(response);
  }

  public async analyzeImage(selectedImageURL: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4-vision-preview",
      temperature: 0.1,
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
              text: "Generate a script for blind people. Print script only."
            },
            {
              type: "image_url",
              image_url: {
                url: selectedImageURL,
                detail: "high"
              }
            }
          ]
        }
      ]
    });

    return this.generateScript(response);
  }

  public async summarizeText(selectedText: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.1,
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
              text: "Generate a script for blind people. Print script only."
            },
            {
              type: "text",
              text: selectedText
            }
          ]
        }
      ]
    });

    return this.generateScript(response);
  }

  private generateScript(response: OpenAI.Chat.Completions.ChatCompletion): string {
    const script = response.choices[0].message.content;

    return script ? script : "The AI does not provide any scripts. Try to refresh or contact to us";
  }
}

export default AIManager;
