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
  private selectingMode: boolean;
  private allImages: HTMLImageElement[];
  private allSources: string[];
  private aiPreference: AIPreference;

  constructor() {
    super(Helpers.IMAGE_ANALYZER, "the description about the colour adjuster");

    this.selectingMode = false;

    this.allImages = [];
    this.allSources = [];
    this.aiPreference = this.defaultAIPreference;

    const result = this.init();

    if (!result) {
      alert("Please select your ai preference by clicking on the popup menu.");
    }

    this.attach();
  }

  private async init(): Promise<boolean> {
    try {
      const { userInfo } = await getResponseFromMessage<
        SendingFetchDataMessage,
        ExpectedRespondingFetchDataMessage
      >({
        type: "FETCH_DATA",
        body: {}
      });

      const currentUserPersonalAIPreference = userInfo.personalPreference.ai;

      if (!currentUserPersonalAIPreference) return false;

      this.aiPreference = currentUserPersonalAIPreference;

      this.allImages = [];
      this.allSources = [];

      const allImages = this.mainDOM.body.querySelectorAll("img, image");

      Array.from(allImages).map(currentElement => {
        const currentImage = currentElement as HTMLImageElement;

        this.allImages.push(currentImage);
        this.allSources.push(currentImage.src);
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  private attach() {
    this.mainDOM.addEventListener("keydown", event => {
      if (event.key === "Shift") {
        this.selectingMode = true;

        Array.from(this.allImages).map(currentImageTag => {
          if (!event.target) return;

          currentImageTag.style.zIndex = "10";
          currentImageTag.style.backgroundColor = "red";
          currentImageTag.src = "";
        });

        console.log(this.allImages.length);

        return;
      }

      if (event.key === "r") {
        this.init();
      }
    });

    this.mainDOM.addEventListener("keyup", event => {
      this.selectingMode = false;

      Array.from(this.allImages).map((currentImageTag, index) => {
        if (!event.target) return;
        currentImageTag.style.backgroundColor = "transparent";
        currentImageTag.src = this.allSources[index];
      });
    });

    Array.from(this.allImages).map((currentImageTag, imageIdx) => {
      currentImageTag.addEventListener("mouseenter", event => {
        if (!event.target) return;

        if (this.selectingMode) {
          const currentTarget = event.target as HTMLImageElement;
          currentTarget.style.backgroundColor = "blue";
        }
      });

      currentImageTag.addEventListener("mouseleave", event => {
        if (!event.target) return;

        const currentTarget = event.target as HTMLImageElement;

        if (this.selectingMode) {
          currentTarget.style.backgroundColor = "red";
        } else {
          currentTarget.style.backgroundColor = "transparent";
        }
      });

      currentImageTag.addEventListener("click", event => {
        if (!this.selectingMode || !event.target) return;

        event.preventDefault();

        const currentTarget = event.target as HTMLImageElement;

        currentTarget.style.backgroundColor = "blue";

        sendCommandMessage<SendingImageAnalyzerMessage, ExpectedRespondingImageAnalyzerMessage>({
          messageBody: {
            type: "IMAGE_ANALYZER",
            body: {
              referencedData: this.allSources[imageIdx],
              degree: this.aiPreference.degree,
              speak: this.aiPreference.preferToSpeak,
              log: this.aiPreference.preferToLog
            }
          }
        });
      });
    });
  }
}

export default ImageAnalyzer;
