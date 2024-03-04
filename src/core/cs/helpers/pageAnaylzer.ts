import {
  ExpectedRespondingFetchDataMessage,
  ExpectedRespondingPageAnalyzerMessage,
  SendingFetchDataMessage,
  SendingPageAnalyzerMessage
} from "@shapes/message";
import {
  ExtractedWebPageContent,
  PageHeadings,
  PageImages,
  PageLinks,
  PageMainData
} from "@shapes/analyzer";
import { AIPreference } from "@shapes/user";
import { getResponseFromMessage, sendCommandMessage } from "../utils/messenger";
import Helper from "./helper";

class PageAnalyzer extends Helper {
  readonly NOT_PROVIDED = "CONTENT NOT PROVIDED";
  readonly worthMetadataTypes = ["description", "author", "keywords"];
  private aiPreference: AIPreference = this.defaultAIPreference;

  constructor() {
    super("PAGE_ANALYZER", "the description about the colour adjuster");

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

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  private attach() {
    this.mainDOM.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        const webpageData = this.analyzePage();

        sendCommandMessage<SendingPageAnalyzerMessage, ExpectedRespondingPageAnalyzerMessage>({
          messageBody: {
            type: "PAGE_ANALYZER",
            body: {
              referencedData: webpageData,
              degree: this.aiPreference.degree,
              speak: this.aiPreference.preferToSpeak,
              log: this.aiPreference.preferToLog
            }
          }
        });
      }
    });
  }

  private analyzePage(): ExtractedWebPageContent {
    const url = window.location.href;
    const title = this.mainDOM.title;
    const metadatas = this.getMetadatas();

    const description = this.findCertainMetada(metadatas, "description");
    const author = this.findCertainMetada(metadatas, "author");
    const keywords = this.convertStringKeywordsToArray(
      this.findCertainMetada(metadatas, "keywords")
    );

    const main = this.getMaindatas();

    return {
      metadata: {
        url,
        title,
        description,
        author,
        keywords
      },
      main
    };
  }

  private getMetadatas(): HTMLMetaElement[] {
    return Array.from(this.mainDOM.head.querySelectorAll("meta")).filter(value => {
      const firstAttribute = value.attributes[0].nodeValue;
      if (firstAttribute === null) return;

      return this.worthMetadataTypes.includes(firstAttribute);
    });
  }

  private getMaindatas(): PageMainData {
    const innerText = this.mainDOM.body.innerText;

    const headings: PageHeadings[] = [];
    const links: PageLinks[] = [];
    const images: PageImages[] = [];

    this.extractPropertiesFromTags<HTMLHeadingElement>("h1, h2, h3, h4, h5, h6", currentHeading => {
      headings.push({
        headingNumber: Number(currentHeading.tagName.slice(1, 2)),
        content: currentHeading.innerHTML
      });
    });

    this.extractPropertiesFromTags<HTMLAnchorElement>("a", currentLink => {
      links.push({
        linkTo: currentLink.href,
        content: currentLink.innerText
      });
    });

    this.extractPropertiesFromTags<HTMLImageElement>("img", currentImage => {
      images.push({
        imageUrl: currentImage.src,
        alt: currentImage.alt
      });
    });

    return {
      innerText,
      headings,
      links,
      images
    };
  }

  private findCertainMetada(metaDatas: HTMLMetaElement[], firstAttribute: string): string {
    const satisfiedMetadata = metaDatas.find(value => {
      const foundFirstAttribute = value.attributes[0].nodeValue;

      if (foundFirstAttribute === firstAttribute) return true;
    });

    if (satisfiedMetadata === undefined) return this.NOT_PROVIDED;

    const mainContent = satisfiedMetadata.attributes[1].nodeValue;

    if (mainContent === null) return this.NOT_PROVIDED;

    return mainContent;
  }

  private convertStringKeywordsToArray(keywords: string): string[] {
    return keywords.split(",");
  }

  private extractPropertiesFromTags<T>(
    querySelector: string,
    callbackFunction: (value: T, index: number, array: T[]) => void
  ): void {
    const allSelectedTags = this.mainDOM.querySelectorAll(querySelector);

    // @ts-ignore
    Array.from(allSelectedTags).map(callbackFunction);
  }
}

export default PageAnalyzer;
