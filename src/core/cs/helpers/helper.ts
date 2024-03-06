import { AIPreference, Helpers } from "@shapes/user";

abstract class Helper {
  private name: Helpers;
  protected mainDOM: Document;

  protected readonly defaultAIPreference: AIPreference = {
    degree: 1,
    preferToSpeak: true,
    preferToLog: true
  };

  constructor(name: Helpers) {
    this.name = name;
    this.mainDOM = document;
  }
}

export default Helper;
