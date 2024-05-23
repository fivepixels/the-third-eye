/**
 * Copyright 2024 Seol SO
 * SPDX-License-Identifier: MIT
 * Helper - Page Analyzer
 */

import type {
  SendingPageAnalyzerMessage,
  SendingTTSStopMessage,
} from "@type/message";
import { sendCommandMessage } from "../messenger";

export interface ExtractedWebPageContent {
  metadata: PageMetaData;
  main: PageMainData;
}

interface PageMetaData {
  url: string;
  title: string;
  description: string;
  author: string;
  keywords: string[];
}

interface PageMainData {
  innerText: string;
  headings: PageHeadings[];
  links: PageLinks[];
  images: PageImages[];
}

type PageHeadings = {
  headingNumber: number;
  content: string;
};
type PageLinks = { linkTo: string; content: string };
type PageImages = { imageUrl: string; alt: string };

class PageAnalyzer {
  readonly NOT_PROVIDED = "CONTENT NOT PROVIDED";
  readonly worthMetadataTypes = ["description", "author", "keywords"];

  constructor() {
    this.attach();
  }

  onInitializing(): void {}

  private attach() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const webpageData = this.analyzePage();

        sendCommandMessage<SendingPageAnalyzerMessage>({
          messageBody: {
            type: "PAGE_ANALYZER",
            body: {
              pageData: webpageData,
            },
          },
        });

        return;
      }

      if (event.key === "Backspace") {
        sendCommandMessage<SendingTTSStopMessage>({
          messageBody: {
            type: "TTS_STOP",
            body: {},
          },
        });

        return;
      }
    });
  }

  private analyzePage(): ExtractedWebPageContent {
    const url = window.location.href;
    const title = document.title;
    const metadatas = this.getMetadatas();

    const description = this.findCertainMetada(metadatas, "description");
    const author = this.findCertainMetada(metadatas, "author");
    const keywords = this.convertStringKeywordsToArray(
      this.findCertainMetada(metadatas, "keywords"),
    );

    const main = this.getMaindatas();

    return {
      metadata: {
        url,
        title,
        description,
        author,
        keywords,
      },
      main,
    };
  }

  private getMetadatas(): HTMLMetaElement[] {
    return Array.from(document.head.querySelectorAll("meta")).filter(
      (value) => {
        const firstAttribute = value.attributes[0].nodeValue;
        if (firstAttribute === null) return;

        return this.worthMetadataTypes.includes(firstAttribute);
      },
    );
  }

  private getMaindatas(): PageMainData {
    const innerText = document.body.innerText;

    const headings: PageHeadings[] = [];
    const links: PageLinks[] = [];
    const images: PageImages[] = [];

    this.extractPropertiesFromTags<HTMLHeadingElement>(
      "h1, h2, h3, h4, h5, h6",
      (currentHeading) => {
        headings.push({
          headingNumber: Number(currentHeading.tagName.slice(1, 2)),
          content: currentHeading.innerHTML,
        });
      },
    );

    this.extractPropertiesFromTags<HTMLAnchorElement>("a", (currentLink) => {
      links.push({
        linkTo: currentLink.href,
        content: currentLink.innerText,
      });
    });

    this.extractPropertiesFromTags<HTMLImageElement>("img", (currentImage) => {
      images.push({
        imageUrl: currentImage.src,
        alt: currentImage.alt,
      });
    });

    return {
      innerText,
      headings,
      links,
      images,
    };
  }

  private findCertainMetada(
    metaDatas: HTMLMetaElement[],
    firstAttribute: string,
  ): string {
    const satisfiedMetadata = metaDatas.find((value) => {
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
    callbackFunction: (value: T, index: number, array: T[]) => void,
  ): void {
    const allSelectedTags = document.querySelectorAll(querySelector);

    // @ts-expect-error since the `callbackFunction` function will be the same...?
    Array.from(allSelectedTags).map(callbackFunction);
  }
}

export default PageAnalyzer;
