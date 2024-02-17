export default interface UserInformation {
  isConfigured: boolean;

  personal: {
    name: string;
    age?: number;
    phone?: string;
    email?: string;
    origin?: string;
  };

  major: {
    name: MajorProblems;
    neededHelpers: {
      helper: MajorHelpers;
      info: ExtraInfoType;
    }[];
  };

  extra: {
    pinnedLinks: PinnedLinks[];
    pinnedActions: PinnedActions[];
    disabledOn: string[];
    logging: boolean;
  };
}

/*
 * OB - Complete Blindness
 * PB - Partial Blindness
 * BL - Bluriness
 * CB - Colouir Deficiency
 */
export type MajorProblems = "OB" | "PB" | "BL" | "CB";
export type MajorHelpers = "SPEAKER" | "COLOUR_ADJUSTER" | "MOVER" | "NOTIFIER";

export type ExtraInfoType =
  | ExtraColourDeficiencyProblems
  | ExtraPartialBlindnessProblems
  | ExtraBlurinessProblems;

export interface ExtraColourDeficiencyProblems {
  type: ColourDeficiencyType;
  strongestColours: string[];
  weakestColours: string[];
}

export interface ExtraPartialBlindnessProblems {
  areas: {
    x: number;
    y: number;
    size: number;
    degree: number;
  }[];
}

export interface ExtraBlurinessProblems {
  degree: number;
}

export type ColourDeficiencyType =
  | "PROTANOPIA"
  | "PROTANOMALY"
  | "DEUTERANOPIA"
  | "DEUTERANOMALY"
  | "TRITANOPIA"
  | "TRITANO"
  | "ACHROMATOPSIA";

export interface PinnedLinks {
  url: string;
  name: string;
  majorColour: string;
}

export interface PinnedActions {
  name: string;
  majorColour: string;
}

/**

  - Protanopia - blue and green as well as between red and green
  - Deuteranopia - between red and gree HUES
  - Tritanopia - between blue and green and yellow and red

  - Protanomaly - reduced sensitivity to red light, making reds, organes, and yellows look greener
  - Deuteranomaly - reduced sensitivity to green light
  - Tritanomaly - reduced sensitivity to blue light

  - Monochromacy or Achromatopsia - in shades of gray

*/
