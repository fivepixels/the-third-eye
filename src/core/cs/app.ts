import {
  ExpectedRespondingFetchDataMessage,
  SendingFetchDataMessage
} from "@shapes/message";
import { getResponseFromMessage } from "./utils/messenger";
import { Helpers } from "@src/shapes/user";
import Mover from "./helpers/mover";
import ColourAdjuster from "./helpers/colourAdjuster";
import PageAnalyzer from "./helpers/pageAnaylzer";
import ImageAnalyzer from "./helpers/imageAnaylzer";
import TextReader from "./helpers/textReader";

class App {
  private readonly actions: { [K in Helpers]: () => void } = {
    MOVER: () => new Mover(),
    ZOOMER: () => {},
    COLOUR_ADJUSTER: () => new ColourAdjuster(),
    PAGE_ANALYZER: () => new PageAnalyzer(),
    IMAGE_ANALYZER: () => new ImageAnalyzer(),
    TEXT_SUMMARIZER: () => new TextReader()
  };

  constructor() {}

  public async init() {
    const { userInfo } = await getResponseFromMessage<
      SendingFetchDataMessage,
      ExpectedRespondingFetchDataMessage
    >({
      type: "FETCH_DATA",
      body: {}
    });

    userInfo.neededHelpers.map(value => {
      this.actions[value]();
    });
  }
}

export default App;
