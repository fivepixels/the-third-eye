import { AIPreference, Helpers } from "@src/shapes/user";
import Helper from "./helper";

abstract class AIHelper extends Helper {
  private aiPreference: AIPreference;

  constructor(name: Helpers) {
    super(name);

    this.aiPreference = this.defaultAIPreference;
  }
}

export default AIHelper;
