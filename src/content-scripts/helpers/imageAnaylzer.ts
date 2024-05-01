/**
 * Copyright 2024 Seol SO
 * SPDX-License-Identifier: MIT
 */

import type {
  SendingImageAnalyzerMessage,
  SendingTTSStopMessage,
} from "@type/message";
import { sendCommandMessage } from "../messenger";

class ImageAnalyzer {
  private selectMode: boolean;
  private selectedImageSrc: string | null;
  private allImages: HTMLImageElement[];
  private mouseIndicator: HTMLDivElement;

  private readonly marginPrefix = 10;
  private readonly paddingPrefix = 15;

  constructor() {
    this.selectMode = false;
    this.selectedImageSrc = null;
    this.allImages = [];
    this.mouseIndicator = document.createElement("div");

    this.initialize();
  }

  private async initialize(): Promise<void> {
    this.allImages = this.grabAllImageTags();
    this.attach();
    this.setupIndicator();
  }

  private setupIndicator() {
    const mouseIndicatorRadius = 100;

    this.mouseIndicator.style.width = `${mouseIndicatorRadius}px`;
    this.mouseIndicator.style.height = `${mouseIndicatorRadius}px`;
    this.mouseIndicator.style.backgroundColor = "green";
    this.mouseIndicator.style.borderRadius = "100%";
    this.mouseIndicator.style.position = "absolute";
    this.mouseIndicator.style.top = "0px";
    this.mouseIndicator.style.right = "0px";
    this.mouseIndicator.style.pointerEvents = "none";

    document.body.addEventListener("mousemove", (event) => {
      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      const scrollY = window.scrollY || document.documentElement.scrollTop;

      this.mouseIndicator.style.left = `${event.clientX + scrollX}px`;
      this.mouseIndicator.style.top = `${event.clientY + scrollY}px`;
    });

    document.body.appendChild(this.mouseIndicator);

    this.changeIndicatorVisibility(false);
  }

  private changeIndicatorVisibility(visibility: boolean) {
    this.mouseIndicator.style.backgroundColor = visibility
      ? "green"
      : "transparent";
  }

  private attach() {
    document.addEventListener("keydown", (event) => {
      const currentKey = event.key as "Shift" | "Enter" | "r";

      if (currentKey === "Shift") {
        this.selectMode = true;
        this.changeIndicatorVisibility(true);

        this.allImages.map((currentImage) =>
          this.adjustBackgroundColoursOfImages(currentImage, "red"),
        );

        return;
      }

      if (currentKey === "Enter") {
        if (!this.selectedImageSrc) return;

        this.analyzeSelectedImage(this.selectedImageSrc);

        return;
      }

      if (currentKey === "r") {
        this.selectMode = false;
        this.allImages.map((currentImage) =>
          this.adjustBackgroundColoursOfImages(currentImage, "none"),
        );
        this.allImages = this.grabAllImageTags();

        return;
      }
      if (currentKey === "Backspace") {
        sendCommandMessage<SendingTTSStopMessage>({
          messageBody: {
            type: "TTS_STOP",
            body: {},
          },
        });

        return;
      }
    });

    document.addEventListener("keyup", () => {
      this.selectMode = false;
      this.changeIndicatorVisibility(false);
      this.allImages.map((currentImage) =>
        this.adjustBackgroundColoursOfImages(currentImage, "none"),
      );
    });

    this.allImages.map((currentImage) => {
      if (!currentImage.parentElement) return;

      currentImage.parentElement.addEventListener("mouseenter", () => {
        if (!this.selectMode) return;

        this.selectedImageSrc = currentImage.src;
        this.adjustBackgroundColoursOfImages(currentImage, "blue");
      });

      currentImage.parentElement.addEventListener("mouseleave", () => {
        if (!this.selectMode) return;

        this.selectedImageSrc = null;
        this.adjustBackgroundColoursOfImages(currentImage, "red");
      });
    });
  }

  private grabAllImageTags(): HTMLImageElement[] {
    return Array.from(document.body.querySelectorAll("img, image"));
  }

  private adjustBackgroundColoursOfImages(
    imageTag: HTMLImageElement,
    changeTo: "red" | "blue" | "none",
  ) {
    const isNone = changeTo === "none";

    if (!imageTag.parentElement) return;

    if (isNone) {
      imageTag.parentElement.style.backgroundColor = "transparent";
      imageTag.style.margin = "0px";
      imageTag.style.padding = "0px";
    } else {
      imageTag.parentElement.style.backgroundColor = changeTo;
      imageTag.style.margin = `${imageTag.style.margin + this.marginPrefix}px`;
      imageTag.style.padding = `${
        imageTag.style.padding + this.paddingPrefix
      }px`;
    }

    Array.from(imageTag.parentElement.children).map((child) => {
      const selectedChild = child as HTMLElement;
      selectedChild.style.visibility = isNone ? "visible" : "hidden";
    });
  }

  private analyzeSelectedImage(imageUrl: string) {
    sendCommandMessage<SendingImageAnalyzerMessage>({
      messageBody: {
        type: "IMAGE_ANALYZER",
        body: {
          imageUrl: imageUrl,
        },
      },
    });
  }
}

export default ImageAnalyzer;
