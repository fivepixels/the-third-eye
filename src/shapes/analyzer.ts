export interface ExtractedWebPageContent {
  metadata: PageMetaData;
  main: PageMainData;
}

export interface PageMetaData {
  url: string;
  title: string;
  description: string;
  author: string;
  keywords: string[];
}

export interface PageMainData {
  innerText: string;
  headings: PageHeadings[];
  links: PageLinks[];
  images: PageImages[];
}

export type PageHeadings = {
  headingNumber: number;
  content: string;
};
export type PageLinks = { linkTo: string; content: string };
export type PageImages = { imageUrl: string; alt: string };
