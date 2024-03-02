import {
  ExpectedRespondingImageAnalyzerMessage,
  SendingImageAnalyzerMessage
} from "@src/shapes/message";
import { sendCommandMessage } from "../utils/messenger";
import Helper from "./helper";

class ImageAnalyzer extends Helper {
  constructor() {
    super("IMAGE_ANAYLZER", "the description about the colour adjuster");

    this.attach();
  }

  private attach() {
    const allImages = this.mainDOM.body.querySelectorAll("img");

    Array.from(allImages).map(currentImageTag => {
      currentImageTag.addEventListener("mouseenter", event => {
        if (!event.target) return;

        const currentTarget = event.target as HTMLImageElement;

        currentTarget.style.backgroundColor = "red";
      });

      currentImageTag.addEventListener("mouseleave", event => {
        if (!event.target) return;

        const currentTarget = event.target as HTMLImageElement;

        currentTarget.style.backgroundColor = "transparent";
      });

      currentImageTag.addEventListener("click", event => {
        event.preventDefault();

        if (!event.target) return;

        const currentTarget = event.target as HTMLImageElement;

        currentTarget.style.backgroundColor = "blue";

        sendCommandMessage<SendingImageAnalyzerMessage, ExpectedRespondingImageAnalyzerMessage>({
          messageBody: {
            type: "IMAGE_ANALYZER",
            body: {
              referencedData: this.allSources[imageIdx],
              degree: 3,
              speak: true,
              log: true
            }
          }
        });
      });
    });
  }
}

export default ImageAnalyzer;
