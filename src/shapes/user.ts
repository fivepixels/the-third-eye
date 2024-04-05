interface user {
  isCreated: boolean;
  neededHelpers: Helpers[];
  personalPreference: PersonalReferenceType;
}

export enum Helpers {
  MOVER = "MOVER",
  COLOUR_ADJUSTER = "COLOUR_ADJUSTER",
  PAGE_ANALYZER = "PAGE_ANALYZER",
  IMAGE_ANALYZER = "IMAGE_ANALYZER",
  TEXT_SUMMARIZER = "TEXT_SUMMARIZER"
}

export enum ColourDeficiency {
  PROTANOPIA = "PROTANOPIA",
  DEUTERANOPIA = "DEUTERANOPIA",
  TRITANOPIA = "TRITANOPIA",
  PROTANOMALY = "PROTANOMALY",
  DEUTERANOMALY = "DEUTERANOMALY",
  TRITANOMALY = "TRITANOMALY",
  MONOCHROMACY = "MONOCHROMACY"
}

export interface PersonalReferenceType {
  colourAdjuster: {
    deficiency: ColourDeficiency;
  };
  ai: AIPreference;
}

export interface AIPreference {
  degree: number;
  preferToLog: boolean;
  preferToSpeak: boolean;
}

export default user;
