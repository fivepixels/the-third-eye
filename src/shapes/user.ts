interface user {
  problems: Problems;
  abilities: Difficulties[];
  neededHelpers: Helpers[];
}

export type Problems =
  | "COMPLETE_BLINDNESS"
  | "PARTIAL_BLINDNESS"
  | "BLURINESS"
  | "COLOUR_BLINDNESS";

export type Difficulties =
  | "CAN_SEE_WHOLE_SCREEN"
  | "CAN_SEE_PART_SCREEN"
  | "CAN_READ_TEXT"
  | "CAN_SEE_IMAGES"
  | "CAN_RECOGNIZE_COLOURS";

export type Helpers =
  | "SUMMARIZER"
  | "TEXT_READER"
  | "IMAGE_ANAYLZER"
  | "MOVER"
  | "FILTER"
  | "COLOUR_ADJUSTER";

export type ColourDeficiency =
  | "PROTANOPIA"
  | "DEUTERANOPIA"
  | "TRITANOPIA"
  | "PROTANOMALY"
  | "DEUTERANOMALY"
  | "TRITANOMALY"
  | "MONOCHROMACY";

export default user;
