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
 * CB - Colouir Blindness
 */
export type MajorProblems = "OB" | "PB" | "BL" | "CB";
export type MajorHelpers = "SPEAKER" | "COLOUR_ADJUSTER" | "MOVER" | "NOTIFIER";

export type ExtraInfoType =
  | ExtraColourBlindnessProblems
  | ExtraPartialBlindnessProblems
  | ExtraBlurinessProblems;

export interface ExtraColourBlindnessProblems {
  type: ColourBlindnessType;
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

export enum ColourBlindnessType {
  TRICHROMACY = "TRICHROMACY",
  ANOMALOUS_TRICHROMACY = "ANOMALOUS_TRICHROMACY",
  DICHROMACY = "DICHROMACY",
  PROTANOPIA = "PROTANOPIA",
  DEUTERANOPIA = "DEUTERANOPIA",
  TRITANOPIA = "TRITANOPIA",
  MONOCHROMACY = "MONOCHROMACY",
  ROD = "ROD",
  CONE = "CONE"
}

export interface PinnedLinks {
  url: string;
  name: string;
  majorColour: string;
}

export interface PinnedActions {
  name: string;
  majorColour: string;
}
