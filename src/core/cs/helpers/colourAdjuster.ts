/*
 * Inspired by ColorBlindly extension by @Andrew VanNess<http://oftheheadland.github.io/>
 * The fold that I copied the cssFilters values from : https://github.com/oftheheadland/Colorblindly/tree/master/filters
 *
 * I took his idea of apply the CSS Filters and changed the approach better to this google chrome extension.
 *
 * Big Thanks to @Andrew Vaness<http://oftheheadland.github.io/> again.
 */

import Helper from "./helper";
import { getResponseFromMessage } from "../utils/messenger";
import { ExpectedRespondingFetchDataMessage, SendingFetchDataMessage } from "@shapes/message";
import { ColourDeficiency, Helpers } from "@src/shapes/user";

type CSSFilters = {
  [K in keyof typeof ColourDeficiency]: string;
};

class ColourAdjuster extends Helper {
  private colourDeficiency: ColourDeficiency;

  private readonly cssFilters: CSSFilters = {
    PROTANOPIA:
      "0.10889,0.89111,-0.00000,0,0 0.10889,0.89111,0.00000,0,0 0.00447,-0.00447,1.00000,0,0 0,0,0,1,0",
    DEUTERANOPIA:
      "0.29031,0.70969,-0.00000,0,0 0.29031,0.70969,-0.00000,0,0 -0.02197,0.02197,1.00000,0,0 0,0,0,1,0",
    TRITANOPIA:
      "1.00000,0.15236,-0.15236,0,0 0.00000,0.86717,0.13283,0,0 -0.00000,0.86717,0.13283,0,0 0,0,0,1,0",
    ACHROMATOPSIA: "0.299,0.587,0.114,0,0 0.299,0.587,0.114,0,0 0.299,0.587,0.114,0,0 0,0,0,1,0",
    PROTANOMALY:
      "0.46533,0.53467,-0.00000,0,0 0.06533,0.93467,0.00000,0,0 0.00268,-0.00268,1.00000,0,0 0,0,0,1,0",
    DEUTERANOMALY:
      "0.57418,0.42582,-0.00000,0,0 0.17418,0.82582,-0.00000,0,0 -0.01318,0.01318,1.00000,0,0 0,0,0,1,0",
    TRITANOMALY:
      "1.00000,0.09142,-0.09142,0,0 0.00000,0.92030,0.07970,0,0 -0.00000,0.52030,0.47970,0,0 0,0,0,1,0",
    ACHROMATOMALY: "0.618,0.320,0.062,0,0 0.163,0.775,0.062,0,0 0.163,0.320,0.516,0,0 0,0,0,1,0",
    MONOCHROMACY:
      "0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0"
  };

  constructor() {
    super(Helpers.COLOUR_ADJUSTER, "the description about the colour adjuster");

    this.colourDeficiency = ColourDeficiency.MONOCHROMACY;

    const result = this.init();

    if (!result) {
      return;
    }

    this.applyCSSFilter();
  }

  private async init(): Promise<boolean> {
    const { userInfo } = await getResponseFromMessage<
      SendingFetchDataMessage,
      ExpectedRespondingFetchDataMessage
    >({
      type: "FETCH_DATA",
      body: {}
    });

    const currentUserDeficiency = userInfo.personalPreference.colourAdjuster.deficiency;

    if (!currentUserDeficiency) {
      alert("Please select your colour deficiency by clicking on the popup menu.");
      return false;
    }

    this.colourDeficiency = userInfo.personalPreference.colourAdjuster.deficiency;
    return true;
  }

  private applyCSSFilter() {
    const styleTag = document.createElement("style");
    styleTag.innerHTML =
      "html{-webkit-filter:url(#tte);-moz-filter:(#tte);-ms-filter:(#tte);-o-filter:(#tte);filter:(#tte);}";

    const filterDiv = document.createElement("div");
    filterDiv.style.height = "0px";
    filterDiv.style.width = "0px";
    filterDiv.style.padding = "0px";
    filterDiv.style.margin = "0px";
    filterDiv.style.display = "none";

    filterDiv.innerHTML = `
      <svg id="colorblind-filters" style="display: none">
        <defs>
          <filter id="tte" color-interpolation-filters="linearRGB">
            <feColorMatrix
              type="matrix"
              values="${this.cssFilters[this.colourDeficiency]}"
              in="SourceGraphic">
            </feColorMatrix>
          </filter>
        </defs>
      </svg>
    `;

    document.body.appendChild(filterDiv);
    document.body.appendChild(styleTag);
  }
}

export default ColourAdjuster;
