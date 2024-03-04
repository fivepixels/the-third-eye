import { AIPreference, Helpers } from "@shapes/user";

abstract class Helper {
  private name: Helpers;
  private description: string;
  protected mainDOM: Document;

  protected readonly defaultAIPreference: AIPreference = {
    degree: 1,
    preferToSpeak: true,
    preferToLog: true
  };

  constructor(name: Helpers, description: string) {
    this.name = name;
    this.description = description;
    this.mainDOM = document;
  }
}

export default Helper;
