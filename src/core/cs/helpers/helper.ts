import { Helpers as MajorHelpersName } from "@src/shapes/user";

abstract class Helper {
  private name: MajorHelpersName;
  private description: string;

  constructor(name: MajorHelpersName, description: string) {
    this.name = name;
    this.description = description;
  }
}

export default Helper;
