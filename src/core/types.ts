export interface UserInformation {
  personal: {
    name: string;
    age?: number;
    phone?: string;
    email?: string;
    origin?: string;
  };

  problem: {
    name: MajorProblems;
    info: ExtraInfoType;
    helper: MajorHelpers;
  };

  extra: {};

  disabledOn: string[];
  logging: boolean;
}

export enum MajorProblems {
  COLOUR_BLINDNESS = "COLOUR_BLINDNESS",
  PARTIAL_BLINDNESS = "PARTIAL_BLINDNESS",
  BLURINESS = "BLURINESS"
}

export enum MajorHelpers {
  SPEAKER = "SPEAKER",
  COLOUR_ADJUSTER = "COLOUR_ADJUSTER",
  MOVER = "MOVER"
}

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

// Communicating between content script(cs) and service workers(sw)
export enum RESPONDING_MESSAGE_TYPES {
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED"
}

export interface SendingMessage<T = string> {
  sender: string;
  senderDescription: string;
  content: T;
}

export interface RespondingMessage<T = string> {
  messageType: RESPONDING_MESSAGE_TYPES;
  content: T;
}

export type RespondCallback<T> = (response: RespondingMessage<T>) => void;

export type ShortCut = {
  url: string;
  colour: string;
};

export type ActionCode =
  | "NEWTAB"
  | "CLOSETAB"
  | "QUIT"
  | "DISABLE"
  | "ADD_SHORTCUT"
  | "REMOVE_SHORTCUT";
export type Action = {
  actionName: string;
  description: string;
  code: ActionCode | ActionCode[];
};
