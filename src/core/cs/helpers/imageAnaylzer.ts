import {
  ExpectedRespondingFetchDataMessage,
  ExpectedRespondingImageAnalyzerMessage,
  SendingFetchDataMessage,
  SendingImageAnalyzerMessage
} from "@shapes/message";
import { AIPreference, Helpers } from "@shapes/user";
import { getResponseFromMessage, sendCommandMessage } from "../utils/messenger";
import Helper from "./helper";

class ImageAnalyzer extends Helper {
  private selectMode: boolean;
  private selectedImageSrc: string | null;
  private allImages: HTMLImageElement[];
  private aiPreference: AIPreference;
  private mouseIndicator: HTMLDivElement;
  private readonly marginPrefix = 10;
  private readonly paddingPrefix = 15;

  constructor() {
    super(Helpers.IMAGE_ANALYZER);

    this.selectMode = false;
    this.selectedImageSrc = null;
    this.allImages = [];
    this.aiPreference = this.defaultAIPreference;
    this.mouseIndicator = document.createElement("div");

    this.setupIndicator();
    this.init();
  }

  private setupIndicator() {
    const mouseIndicatorRadius = 20;

    this.mouseIndicator.style.width = `${mouseIndicatorRadius}px`;
    this.mouseIndicator.style.height = `${mouseIndicatorRadius}px`;
    this.mouseIndicator.style.backgroundColor = "green";
    this.mouseIndicator.style.borderRadius = "100%";
    this.mouseIndicator.style.position = "absolute";
    this.mouseIndicator.style.top = "0px";
    this.mouseIndicator.style.right = "0px";
    this.mouseIndicator.style.pointerEvents = "none";

    this.mainDOM.body.addEventListener("mousemove", event => {
      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      const scrollY = window.scrollY || document.documentElement.scrollTop;

      this.mouseIndicator.style.left = `${event.clientX + scrollX}px`;
      this.mouseIndicator.style.top = `${event.clientY + scrollY}px`;
    });

    this.mainDOM.body.appendChild(this.mouseIndicator);

    this.changeIndicatorVisibility(false);
  }

  private changeIndicatorVisibility(visibility: boolean) {
    this.mouseIndicator.style.backgroundColor = visibility ? "green" : "transparent";
  }

  private async init() {
    try {
      const { userInfo } = await getResponseFromMessage<
        SendingFetchDataMessage,
        ExpectedRespondingFetchDataMessage
      >({
        type: "FETCH_DATA",
        body: {}
      });

      const currentUserPersonalAIPreference = userInfo.personalPreference.ai;

      if (!currentUserPersonalAIPreference) return;

      this.aiPreference = currentUserPersonalAIPreference;
      this.allImages = this.grabAllImageTags();

      this.attach();
    } catch (error) {
      console.error(error);
      alert("Please select your ai preference by clicking on the popup menu.");
    }
  }

  private attach() {
    this.mainDOM.addEventListener("keydown", event => {
      const currentKey = event.key as "Shift" | "Enter" | "r";

      if (currentKey === "Shift") {
        this.selectMode = true;
        this.changeIndicatorVisibility(true);

        this.allImages.map(currentImage =>
          this.adjustBackgroundColoursOfImages(currentImage, "red")
        );
      }

      if (currentKey === "Enter") {
        console.log(this.selectedImageSrc);

        if (!this.selectedImageSrc) return;

        this.analyzeSelectedImage(this.selectedImageSrc);
      }

      if (currentKey === "r") {
        this.selectMode = false;
        this.allImages.map(currentImage =>
          this.adjustBackgroundColoursOfImages(currentImage, "none")
        );
        this.allImages = this.grabAllImageTags();
      }
    });

    this.mainDOM.addEventListener("keyup", () => {
      this.selectMode = false;
      this.changeIndicatorVisibility(false);
      this.allImages.map(currentImage =>
        this.adjustBackgroundColoursOfImages(currentImage, "none")
      );
    });

    this.allImages.map(currentImage => {
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
    return Array.from(this.mainDOM.body.querySelectorAll("img, image"));
  }

  private adjustBackgroundColoursOfImages(
    imageTag: HTMLImageElement,
    changeTo: "red" | "blue" | "none"
  ) {
    const isNone = changeTo === "none";

    if (!imageTag.parentElement) return;

    if (isNone) {
      imageTag.parentElement.style.backgroundColor = "transparent";
      imageTag.style.margin = `0px`;
      imageTag.style.padding = `0px`;
    } else {
      imageTag.parentElement.style.backgroundColor = changeTo;
      imageTag.style.margin = `${imageTag.style.margin + this.marginPrefix}px`;
      imageTag.style.padding = `${imageTag.style.padding + this.paddingPrefix}px`;
    }

    Array.from(imageTag.parentElement.children).map(child => {
      const selectedChild = child as HTMLElement;
      selectedChild.style.visibility = isNone ? "visible" : "hidden";
    });
  }

  private analyzeSelectedImage(imageUrl: string) {
    sendCommandMessage<SendingImageAnalyzerMessage, ExpectedRespondingImageAnalyzerMessage>({
      messageBody: {
        type: "IMAGE_ANALYZER",
        body: {
          referencedData: imageUrl,
          degree: this.aiPreference.degree,
          speak: this.aiPreference.preferToSpeak,
          log: this.aiPreference.preferToLog
        }
      }
    });
  }
}

export default ImageAnalyzer;
