/**
 * Copyright 2024 Seol SO
 * SPDX-License-Identifier: MIT
 */

interface user {
  isCreated: boolean;
  neededHelpers: Helpers[];
  personalPreference: {
    colourAdjuster: {
      deficiency: ColourDeficiency;
    };
    ai: AIPreference;
  };
}

export enum Helpers {
  MOVER = "MOVER",
  COLOUR_ADJUSTER = "COLOUR_ADJUSTER",
  PAGE_ANALYZER = "PAGE_ANALYZER",
  IMAGE_ANALYZER = "IMAGE_ANALYZER",
  TEXT_ANALYZER = "TEXT_ANALYZER",
}

export enum ColourDeficiency {
  PROTANOPIA = "PROTANOPIA",
  DEUTERANOPIA = "DEUTERANOPIA",
  TRITANOPIA = "TRITANOPIA",
  PROTANOMALY = "PROTANOMALY",
  DEUTERANOMALY = "DEUTERANOMALY",
  TRITANOMALY = "TRITANOMALY",
  MONOCHROMACY = "MONOCHROMACY",
}

export interface AIPreference {
  apiKey?: string;
  degree: number;
}

export default user;
