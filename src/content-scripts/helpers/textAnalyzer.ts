/**
 * Copyright 2024 Seol SO
 * SPDX-License-Identifier: MIT
 */

import type {
  SendingTTSSpeakMessage,
  SendingTTSStopMessage,
  SendingTextSummarizerMessage,
} from "@type/message";
import { sendCommandMessage } from "../utils/messenger";

type TextReaderMode = "PLAIN" | "SUMMARIZED";
class TextAnalyzer {
  private allTags: {
    node: Element;
    selected: boolean;
  }[];
  private currentMode: TextReaderMode | "NONE";

  readonly attachableTagsType =
    "h1, h2, h3, h4, h5, h6, span, p, a, li, ul, ol";

  constructor() {
    this.allTags = [];
    this.currentMode = "NONE";

    this.findAllTags();
    this.attach();
  }

  onInitializing(): void {}

  private findAllTags() {
    this.allTags = [];

    for (const currentElement of document.body.querySelectorAll(
      this.attachableTagsType,
    )) {
      const currentNode = currentElement as HTMLElement;
      currentNode.style.backgroundColor = "transparent";

      this.allTags.push({
        node: currentNode,
        selected: false,
      });
    }
  }

  private attach() {
    /*
     * SHIFT - PLAIN
     * Control - SUMMARIZED
     */

    document.addEventListener("keydown", (event) => {
      if (event.key === "Shift") {
        this.currentMode = "PLAIN";
      } else if (event.key === "Control") {
        this.currentMode = "SUMMARIZED";
      } else if (event.key === "Enter") {
        this.analyzeText();
      } else if (event.key === "Backspace") {
        sendCommandMessage<SendingTTSStopMessage>({
          messageBody: {
            type: "TTS_STOP",
            body: {},
          },
        });
      } else {
        this.currentMode = "NONE";
      }

      for (const currentElement of this.allTags) {
        currentElement.selected = false;
        const currentNode = currentElement.node as HTMLElement;
        currentNode.style.backgroundColor = "transparent";
      }

      return;
    });

    this.allTags.forEach((selectedElement, index) => {
      const currentNode = selectedElement.node as HTMLElement;
      currentNode.addEventListener("click", (event) => {
        if (this.currentMode === "PLAIN" || this.currentMode === "SUMMARIZED")
          event.preventDefault();

        if (!event.target) return;

        const currentTarget = event.target as HTMLElement;
        this.adjustBackgroundColorBasedOnMode(currentTarget);

        const isSelected = this.allTags[index].selected;
        this.allTags[index].selected = !isSelected;
      });

      currentNode.addEventListener("mouseenter", (event) => {
        if (!event.target) return;

        const currentTarget = event.target as HTMLElement;
        this.adjustBackgroundColorBasedOnMode(currentTarget);
      });

      currentNode.addEventListener("mouseleave", (event) => {
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
      sendCommandMessage<SendingTTSSpeakMessage>({
        messageBody: {
          type: "TTS",
          body: {
            speak: allText,
          },
        },
      });
    } else {
      sendCommandMessage<SendingTextSummarizerMessage>({
        messageBody: {
          type: "TEXT_ANALYZER",
          body: {
            text: allText,
          },
        },
      });
    }
  }

  private adjustBackgroundColor(
    currentElement: HTMLElement,
    to: "transparent" | "red" | "blue",
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
          : "transparent",
    );
  }

  private generateText(): string {
    const allTagsInnerText: string[] = [];

    for (const currentElement of this.allTags) {
      if (!currentElement.selected) continue;

      const currentNode = currentElement.node as HTMLElement;
      allTagsInnerText.push(currentNode.innerText);
    }

    return allTagsInnerText.join("\n\n");
  }
}

export default TextAnalyzer;
