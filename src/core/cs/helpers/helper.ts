import { Helpers } from "@src/shapes/user";

abstract class Helper {
  private name: Helpers;
  private description: string;

  constructor(name: Helpers, description: string) {
    this.name = name;
    this.description = description;
  }
}

export default Helper;
