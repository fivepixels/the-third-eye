export type MajorProblems = "COLOUR_BLINDNESS" | "PARTIAL_BLINDNESS" | "BLURINESS";
export type MajorHelpers = "SPEAKER" | "COLOUR_ADJUSTER" | "MODIFIER";

export type ExtraColourBlindnessProblems =
  | "TRICHROMACY"
  | "ANOMALOUS_TRICHROMACY"
  | "DICHROMACY"
  | "PROTANOPIA"
  | "DEUTERANOPIA"
  | "TRITANOPIA"
  | "MONOCHROMACY"
  | "ROD"
  | "CONE";

export type ExtraPartialBlindnessProblems = PartialBlindnessInfo[];
export type ExtraBlurinessProblems = BlurinessInfo;

export type PartialBlindnessInfo = {
  x: number;
  y: number;
  size: number;
  degree: number;
};

export type BlurinessInfo = {
  degree: number;
};

export type ExtraInfoType =
  | ExtraColourBlindnessProblems
  | ExtraPartialBlindnessProblems
  | ExtraBlurinessProblems;

export interface UserInformation {
  problemType: MajorProblems[];
  extraInfo: ExtraInfoType;
  neededHelpers: MajorHelpers[];

  disabledOn: string[];
  logging: boolean;
}
