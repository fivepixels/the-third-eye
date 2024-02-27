import { Helpers } from "@src/shapes/user";

abstract class Helper {
  private name: Helpers;
  private description: string;
  protected mainDOM: Document;

  constructor(name: Helpers, description: string) {
    this.name = name;
    this.description = description;
    this.mainDOM = document;
  }
}

export default Helper;
