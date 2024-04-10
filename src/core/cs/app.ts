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
import TextAnalyzer from "./helpers/textAnalyzer";

const actions: { [K in Helpers]: () => void } = {
  MOVER: () => new Mover(),
  COLOUR_ADJUSTER: () => new ColourAdjuster(),
  PAGE_ANALYZER: () => new PageAnalyzer(),
  IMAGE_ANALYZER: () => new ImageAnalyzer(),
  TEXT_ANALYZER: () => new TextAnalyzer()
};

async function initApp() {
  const { userInfo } = await getResponseFromMessage<
    SendingFetchDataMessage,
    ExpectedRespondingFetchDataMessage
  >({
    type: "FETCH_DATA",
    body: {}
  });

  userInfo.neededHelpers.map(value => {
    actions[value]();
  });
}

export default initApp;
