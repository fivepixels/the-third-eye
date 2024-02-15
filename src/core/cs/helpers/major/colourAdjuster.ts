import Helper from "@core/cs/helpers";
import Logger from "@core/cs/helpers/minor/logger";

class ColourAdjusterHelper extends Helper {
  constructor(logger: Logger) {
    super(
      "COLOUR_ADJUSTER",
      "The helper colour adjuster is the main helper that adjusts the colours used in the website so that the people who have colour blindness can see proper colours.",
      logger
    );
  }
}

export default ColourAdjusterHelper;
