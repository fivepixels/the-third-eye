import { AIType } from "./ai";

interface user {
  isConfigured: boolean;
  neededHelpers: Helpers[];
  personalPreference: PersonalReferenceType;
}

export type Helpers = "MOVER" | "COLOUR_ADJUSTER" | AIType;

export enum ColourDeficiency {
  PROTANOPIA = "PROTANOPIA",
  DEUTERANOPIA = "DEUTERANOPIA",
  TRITANOPIA = "TRITANOPIA",
  PROTANOMALY = "PROTANOMALY",
  DEUTERANOMALY = "DEUTERANOMALY",
  TRITANOMALY = "TRITANOMALY",
  ACHROMATOMALY = "ACHROMATOMALY",
  ACHROMATOPSIA = "ACHROMATOPSIA",
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
