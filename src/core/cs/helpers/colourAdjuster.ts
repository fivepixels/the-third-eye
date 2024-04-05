/* Normal Helper: COLOUR ADJUSTER */

/*
 * Inspired by ColorBlindly extension by @Andrew VanNess<http://oftheheadland.github.io/>
 * The fold that I copied the cssFilters values from : https://github.com/oftheheadland/Colorblindly/tree/master/filters
 *
 * I took his idea of apply the CSS Filters and changed the approach better to this google chrome extension.
 *
 * Big Thanks to @Andrew Vaness<http://oftheheadland.github.io/> again.
 */

import Helper from "./helper";
import user, { ColourDeficiency, Helpers } from "@src/shapes/user";

type CSSFilters = {
  [K in keyof typeof ColourDeficiency]: string;
};

class ColourAdjuster extends Helper {
  private readonly cssFilters: CSSFilters = {
    PROTANOPIA:
      "0.10889,0.89111,-0.00000,0,0 0.10889,0.89111,0.00000,0,0 0.00447,-0.00447,1.00000,0,0 0,0,0,1,0",
    DEUTERANOPIA:
      "0.29031,0.70969,-0.00000,0,0 0.29031,0.70969,-0.00000,0,0 -0.02197,0.02197,1.00000,0,0 0,0,0,1,0",
    TRITANOPIA:
      "1.00000,0.15236,-0.15236,0,0 0.00000,0.86717,0.13283,0,0 -0.00000,0.86717,0.13283,0,0 0,0,0,1,0",
    PROTANOMALY:
      "0.46533,0.53467,-0.00000,0,0 0.06533,0.93467,0.00000,0,0 0.00268,-0.00268,1.00000,0,0 0,0,0,1,0",
    DEUTERANOMALY:
      "0.57418,0.42582,-0.00000,0,0 0.17418,0.82582,-0.00000,0,0 -0.01318,0.01318,1.00000,0,0 0,0,0,1,0",
    TRITANOMALY:
      "1.00000,0.09142,-0.09142,0,0 0.00000,0.92030,0.07970,0,0 -0.00000,0.52030,0.47970,0,0 0,0,0,1,0",
    MONOCHROMACY:
      "0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0"
  };

  constructor() {
    super(Helpers.COLOUR_ADJUSTER);
  }

  onInitializing(safeUserInfo: user): void {
    this.applyCSSFilter(
      safeUserInfo.personalPreference.colourAdjuster.deficiency
    );
  }

  private applyCSSFilter(colourDeficiencyToApply: ColourDeficiency) {
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
              values="${this.cssFilters[colourDeficiencyToApply]}"
              in="SourceGraphic">
            </feColorMatrix>
          </filter>
        </defs>
      </svg>
    `;

    this.mainDOM.body.appendChild(filterDiv);
    this.mainDOM.body.appendChild(styleTag);
  }
}

export default ColourAdjuster;
