import { ExtractedWebPageContent } from "@shapes/analyzer";
import ENV_VAR from "./env";
import OpenAI from "openai";

class AIManager {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: ENV_VAR.OPENAI_API_KEY
    });
  }

  public async analyzePage(
    webpageContent: ExtractedWebPageContent,
    degree: number
  ): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: this.getTemperature(degree),
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
                text: this.generateUserScript(degree)
              },
              {
                type: "text",
                text:
                  "This is the metadata: " +
                  JSON.stringify(webpageContent.metadata)
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

      return this.generateScript(response);
    } catch (error) {
      console.error(error);
      return this.generateErrorScript();
    }
  }

  public async analyzeImage(
    selectedImageURL: string,
    degree: number
  ): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4-vision-preview",
        temperature: this.getTemperature(degree),
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
                text: this.generateUserScript(degree)
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

      return this.generateScript(response);
    } catch (error) {
      console.error(error);
      return this.generateErrorScript();
    }
  }

  public async summarizeText(
    selectedText: string,
    degree: number
  ): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: this.getTemperature(degree),
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
                text: this.generateUserScript(degree)
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
    } catch (error) {
      console.error(error);
      return this.generateErrorScript();
    }
  }

  private generateScript(response: OpenAI.Chat.ChatCompletion): string {
    const script = response.choices[0].message.content;

    return script
      ? script
      : "The AI does not provide any scripts. Try to refresh or contact to us";
  }

  private generateErrorScript() {
    return "There was an error while communicating with the AI. Please attempt again.";
  }

  private generateUserScript(degree: number): string {
    const adjective =
      degree === 1
        ? "simple and consice"
        : degree === 2
          ? "normal"
          : "long fully descriptive";

    return `Generate a ${adjective} script for blind people. Print ONLY SCRIPT please.`;
  }

  private getTemperature(degree: number): number {
    return (degree / 10) * 1.4;
  }

  private getMaxTokens(degree: number): number {
    return degree === 1 ? 200 : degree === 2 ? 500 : 1200;
  }
}

export default AIManager;
