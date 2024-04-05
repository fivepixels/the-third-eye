/* AI Helper: TEXT READER */

import {
  ExpectedRespondingTTSSpeakMessage,
  ExpectedRespondingTTSStopMessage,
  ExpectedRespondingTextSummarizerMessage,
  SendingTTSSpeakMessage,
  SendingTTSStopMessage,
  SendingTextSummarizerMessage
} from "@shapes/message";
import { sendCommandMessage } from "../utils/messenger";
import Helper from "./helper";
import user, { AIPreference, Helpers } from "@shapes/user";

type TextReaderMode = "PLAIN" | "SUMMARIZED";
class TextReader extends Helper {
  private allTags: {
    node: Element;
    selected: boolean;
  }[];
  private currentMode: TextReaderMode | "NONE";
  private aiPreference: AIPreference;

  readonly attachableTagsType =
    "h1, h2, h3, h4, h5, h6, span, p, a, li, ul, ol";

  constructor() {
    super(Helpers.TEXT_SUMMARIZER);

    this.allTags = [];
    this.currentMode = "NONE";

    this.aiPreference = this.defaultAIPreference;

    this.findAllTags();
    this.attach();
  }

  onInitializing(safeUserInfo: user): void {
    const currentUserPersonalAIPreference = safeUserInfo.personalPreference.ai;

    if (currentUserPersonalAIPreference) {
      this.aiPreference = currentUserPersonalAIPreference;

      return;
    }
  }

  private findAllTags() {
    this.allTags = [];

    this.mainDOM.body
      .querySelectorAll(this.attachableTagsType)
      .forEach(selectedNode => {
        const currentNode = selectedNode as HTMLElement;
        currentNode.style.backgroundColor = "transparent";

        this.allTags.push({
          node: selectedNode,
          selected: false
        });
      });
  }

  private attach() {
    /*
     * SHIFT - PLAIN
     * Control - SUMMARIZED
     */

    this.mainDOM.addEventListener("keydown", event => {
      if (event.key === "Shift") {
        this.currentMode = "PLAIN";
      } else if (event.key === "Control") {
        this.currentMode = "SUMMARIZED";
      } else if (event.key === "Enter") {
        this.analyzeText();
      } else if (event.key === "Backspace") {
        sendCommandMessage<
          SendingTTSStopMessage,
          ExpectedRespondingTTSStopMessage
        >({
          messageBody: {
            type: "TTS_STOP",
            body: {}
          }
        });
      } else {
        this.currentMode = "NONE";
      }

      this.allTags.forEach(selectedElement => {
        selectedElement.selected = false;
        const currentNode = selectedElement.node as HTMLElement;
        currentNode.style.backgroundColor = "transparent";
      });

      return;
    });

    this.allTags.forEach((selectedElement, index) => {
      const currentNode = selectedElement.node as HTMLElement;
      currentNode.addEventListener("click", event => {
        if (this.currentMode === "PLAIN" || this.currentMode === "SUMMARIZED")
          event.preventDefault();

        if (!event.target) return;

        const currentTarget = event.target as HTMLElement;
        this.adjustBackgroundColorBasedOnMode(currentTarget);

        const isSelected = this.allTags[index].selected;
        this.allTags[index].selected = !isSelected;
      });

      currentNode.addEventListener("mouseenter", event => {
        if (!event.target) return;

        const currentTarget = event.target as HTMLElement;
        this.adjustBackgroundColorBasedOnMode(currentTarget);
      });

      currentNode.addEventListener("mouseleave", event => {
        if (!event.target) return;

        const currentTarget = event.target as HTMLElement;

        const isSelected = this.allTags[index].selected;
        if (isSelected) {
          this.adjustBackgroundColorBasedOnMode(currentTarget);
        } else {
          this.adjustBackgroundColor(currentTarget, "transparent");
        }
      });
    });
  }

  private async analyzeText(): Promise<void> {
    const allText = this.generateText();

    if (this.currentMode === "PLAIN") {
      sendCommandMessage<
        SendingTTSSpeakMessage,
        ExpectedRespondingTTSSpeakMessage
      >({
        messageBody: {
          type: "TTS",
          body: {
            speak: allText
          }
        }
      });
    } else {
      sendCommandMessage<
        SendingTextSummarizerMessage,
        ExpectedRespondingTextSummarizerMessage
      >({
        messageBody: {
          type: "TEXT_SUMMARIZER",
          body: {
            referencedData: allText,
            degree: this.aiPreference.degree,
            speak: this.aiPreference.preferToSpeak,
            log: this.aiPreference.preferToLog
          }
        }
      });
    }
  }

  private adjustBackgroundColor(
    currentElement: HTMLElement,
    to: "transparent" | "red" | "blue"
  ) {
    currentElement.style.backgroundColor = to;
  }

  private adjustBackgroundColorBasedOnMode(currentElement: HTMLElement) {
    this.adjustBackgroundColor(
      currentElement,
      this.currentMode === "PLAIN"
        ? "blue"
        : this.currentMode === "SUMMARIZED"
          ? "red"
          : "transparent"
    );
  }

  private generateText(): string {
    const allTagsInnerText: string[] = [];

    this.allTags.forEach(currentElement => {
      if (!currentElement.selected) return;

      const currentNode = currentElement.node as HTMLElement;
      allTagsInnerText.push(currentNode.innerText);
    });

    return allTagsInnerText.join("\n\n");
  }
}

export default TextReader;
