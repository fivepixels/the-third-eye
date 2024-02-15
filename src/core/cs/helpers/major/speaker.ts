import Helper from "@core/cs/helpers";
import Logger from "@core/cs/helpers/minor/logger";

class SpeakerHelper extends Helper {
  constructor(logger: Logger) {
    super(
      "SPEAKER",
      "The speaker helper is the main helper for the people who cannot see anything. This helper helps them by analyzing and using tts to tell them what is going on to the user, and also listening to the user so that the helper can do what the user wants it to do.",
      logger
    );
  }
}

export default SpeakerHelper;
