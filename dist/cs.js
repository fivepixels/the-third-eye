// types/user.ts
var Helpers;
(function(Helpers2) {
  Helpers2["MOVER"] = "MOVER";
  Helpers2["COLOUR_ADJUSTER"] = "COLOUR_ADJUSTER";
  Helpers2["PAGE_ANALYZER"] = "PAGE_ANALYZER";
  Helpers2["IMAGE_ANALYZER"] = "IMAGE_ANALYZER";
  Helpers2["TEXT_ANALYZER"] = "TEXT_ANALYZER";
})(Helpers || (Helpers = {}));
var ColourDeficiency;
(function(ColourDeficiency2) {
  ColourDeficiency2["PROTANOPIA"] = "PROTANOPIA";
  ColourDeficiency2["DEUTERANOPIA"] = "DEUTERANOPIA";
  ColourDeficiency2["TRITANOPIA"] = "TRITANOPIA";
  ColourDeficiency2["PROTANOMALY"] = "PROTANOMALY";
  ColourDeficiency2["DEUTERANOMALY"] = "DEUTERANOMALY";
  ColourDeficiency2["TRITANOMALY"] = "TRITANOMALY";
  ColourDeficiency2["MONOCHROMACY"] = "MONOCHROMACY";
})(ColourDeficiency || (ColourDeficiency = {}));

// src/content-scripts/messenger.ts
function sendCommandMessage({ messageBody, onMessageReceive }) {
  chrome.runtime.sendMessage(messageBody, (response) => {
    if (onMessageReceive)
      onMessageReceive(response.body);
  });
}
async function getResponseFromMessage(messageBody) {
  const response = await chrome.runtime.sendMessage(messageBody);
  return response.body;
}

// src/content-scripts/helpers/colourAdjuster.ts
class ColourAdjuster {
  cssFilters = {
    PROTANOPIA: "0.10889,0.89111,-0.00000,0,0 0.10889,0.89111,0.00000,0,0 0.00447,-0.00447,1.00000,0,0 0,0,0,1,0",
    DEUTERANOPIA: "0.29031,0.70969,-0.00000,0,0 0.29031,0.70969,-0.00000,0,0 -0.02197,0.02197,1.00000,0,0 0,0,0,1,0",
    TRITANOPIA: "1.00000,0.15236,-0.15236,0,0 0.00000,0.86717,0.13283,0,0 -0.00000,0.86717,0.13283,0,0 0,0,0,1,0",
    PROTANOMALY: "0.46533,0.53467,-0.00000,0,0 0.06533,0.93467,0.00000,0,0 0.00268,-0.00268,1.00000,0,0 0,0,0,1,0",
    DEUTERANOMALY: "0.57418,0.42582,-0.00000,0,0 0.17418,0.82582,-0.00000,0,0 -0.01318,0.01318,1.00000,0,0 0,0,0,1,0",
    TRITANOMALY: "1.00000,0.09142,-0.09142,0,0 0.00000,0.92030,0.07970,0,0 -0.00000,0.52030,0.47970,0,0 0,0,0,1,0",
    MONOCHROMACY: "0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0"
  };
  constructor() {
    this.onInitializing();
  }
  async onInitializing() {
    try {
      const { userInfo } = await getResponseFromMessage({
        type: "FETCH_DATA",
        body: {}
      });
      if (!userInfo)
        return;
      this.applyCSSFilter(userInfo.personalPreference.colourAdjuster.deficiency);
    } catch (error) {
      console.error(error);
      sendCommandMessage({
        messageBody: {
          type: "TTS",
          body: {
            speak: "There was an error while receiving your data. Please refresh the page."
          }
        }
      });
      return;
    }
  }
  applyCSSFilter(colourDeficiencyToApply) {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = "html{-webkit-filter:url(#tte);-moz-filter:(#tte);-ms-filter:(#tte);-o-filter:(#tte);filter:(#tte);}";
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
    document.body.appendChild(filterDiv);
    document.body.appendChild(styleTag);
  }
}
var colourAdjuster_default = ColourAdjuster;

// src/content-scripts/helpers/imageAnaylzer.ts
class ImageAnalyzer {
  selectMode;
  selectedImageSrc;
  allImages;
  mouseIndicator;
  marginPrefix = 10;
  paddingPrefix = 15;
  constructor() {
    this.selectMode = false;
    this.selectedImageSrc = null;
    this.allImages = [];
    this.mouseIndicator = document.createElement("div");
    this.initialize();
  }
  async initialize() {
    this.allImages = this.grabAllImageTags();
    this.attach();
    this.setupIndicator();
  }
  setupIndicator() {
    const mouseIndicatorRadius = 100;
    this.mouseIndicator.style.width = `${mouseIndicatorRadius}px`;
    this.mouseIndicator.style.height = `${mouseIndicatorRadius}px`;
    this.mouseIndicator.style.backgroundColor = "green";
    this.mouseIndicator.style.borderRadius = "100%";
    this.mouseIndicator.style.position = "absolute";
    this.mouseIndicator.style.top = "0px";
    this.mouseIndicator.style.right = "0px";
    this.mouseIndicator.style.pointerEvents = "none";
    document.body.addEventListener("mousemove", (event) => {
      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      this.mouseIndicator.style.left = `${event.clientX + scrollX}px`;
      this.mouseIndicator.style.top = `${event.clientY + scrollY}px`;
    });
    document.body.appendChild(this.mouseIndicator);
    this.changeIndicatorVisibility(false);
  }
  changeIndicatorVisibility(visibility) {
    this.mouseIndicator.style.backgroundColor = visibility ? "green" : "transparent";
  }
  attach() {
    document.addEventListener("keydown", (event) => {
      const currentKey = event.key;
      if (currentKey === "Shift") {
        this.selectMode = true;
        this.changeIndicatorVisibility(true);
        this.allImages.map((currentImage) => this.adjustBackgroundColoursOfImages(currentImage, "red"));
        return;
      }
      if (currentKey === "Enter") {
        if (!this.selectedImageSrc)
          return;
        this.analyzeSelectedImage(this.selectedImageSrc);
        return;
      }
      if (currentKey === "r") {
        this.selectMode = false;
        this.allImages.map((currentImage) => this.adjustBackgroundColoursOfImages(currentImage, "none"));
        this.allImages = this.grabAllImageTags();
        return;
      }
      if (currentKey === "Backspace") {
        sendCommandMessage({
          messageBody: {
            type: "TTS_STOP",
            body: {}
          }
        });
        return;
      }
    });
    document.addEventListener("keyup", () => {
      this.selectMode = false;
      this.changeIndicatorVisibility(false);
      this.allImages.map((currentImage) => this.adjustBackgroundColoursOfImages(currentImage, "none"));
    });
    this.allImages.map((currentImage) => {
      if (!currentImage.parentElement)
        return;
      currentImage.parentElement.addEventListener("mouseenter", () => {
        if (!this.selectMode)
          return;
        this.selectedImageSrc = currentImage.src;
        this.adjustBackgroundColoursOfImages(currentImage, "blue");
      });
      currentImage.parentElement.addEventListener("mouseleave", () => {
        if (!this.selectMode)
          return;
        this.selectedImageSrc = null;
        this.adjustBackgroundColoursOfImages(currentImage, "red");
      });
    });
  }
  grabAllImageTags() {
    return Array.from(document.body.querySelectorAll("img, image"));
  }
  adjustBackgroundColoursOfImages(imageTag, changeTo) {
    const isNone = changeTo === "none";
    if (!imageTag.parentElement)
      return;
    if (isNone) {
      imageTag.parentElement.style.backgroundColor = "transparent";
      imageTag.style.margin = "0px";
      imageTag.style.padding = "0px";
    } else {
      imageTag.parentElement.style.backgroundColor = changeTo;
      imageTag.style.margin = `${imageTag.style.margin + this.marginPrefix}px`;
      imageTag.style.padding = `${imageTag.style.padding + this.paddingPrefix}px`;
    }
    Array.from(imageTag.parentElement.children).map((child) => {
      const selectedChild = child;
      selectedChild.style.visibility = isNone ? "visible" : "hidden";
    });
  }
  analyzeSelectedImage(imageUrl) {
    sendCommandMessage({
      messageBody: {
        type: "IMAGE_ANALYZER",
        body: {
          imageUrl
        }
      }
    });
  }
}
var imageAnaylzer_default = ImageAnalyzer;

// src/content-scripts/helpers/mover.ts
class Mover {
  currentMode;
  currentX;
  currentY;
  currentScale;
  isMouseDown;
  indicator;
  pencil;
  isIndicatorOn;
  constructor() {
    this.currentMode = "NONE";
    this.currentX = 0;
    this.currentY = 0;
    this.currentScale = 1;
    this.isMouseDown = false;
    this.indicator = document.createElement("canvas");
    this.pencil = this.indicator.getContext("2d");
    this.isIndicatorOn = false;
    this.init();
  }
  onInitializing() {
    this.initializeIndicator();
  }
  init() {
    document.addEventListener("keyup", () => {
      this.currentMode = "NONE";
      this.removeIndicator();
    });
    document.addEventListener("keydown", (keyEvent) => {
      if (keyEvent.key === "Alt") {
        this.currentMode = "MOVING";
        this.attachIndicator();
        this.adjustMovability(false);
        return;
      }
      if (keyEvent.key === "Shift") {
        this.currentMode = "ZOOMING";
        this.attachIndicator();
        this.adjustMovability(true);
        return;
      }
      if (keyEvent.key === "r") {
        this.currentMode = "NONE";
        this.removeIndicator();
        this.adjustMovability(false);
        this.currentX = 0;
        this.currentY = 0;
        this.currentScale = 1;
        this.apply();
        return;
      }
      this.currentMode = "NONE";
      this.removeIndicator();
      this.adjustMovability(false);
    });
    document.addEventListener("wheel", (wheelEvent) => {
      if (this.currentMode === "ZOOMING") {
        this.zoomMainDOM(wheelEvent.deltaY);
        return;
      }
    });
    document.addEventListener("mousemove", (movingMouseEvent) => {
      if (this.currentMode === "NONE" || this.currentMode === "ZOOMING" || !this.isMouseDown)
        return;
      if (this.currentMode === "MOVING") {
        this.moveMainDOM(movingMouseEvent.movementX, movingMouseEvent.movementY);
        return;
      }
    });
    document.addEventListener("mousedown", () => {
      this.isMouseDown = true;
      if (this.currentMode === "MOVING") {
        document.body.style.border = "solid white 2px";
        return;
      }
      if (this.currentMode === "ZOOMING") {
        return;
      }
    });
    document.addEventListener("mouseup", () => {
      this.isMouseDown = false;
      if (this.currentMode === "MOVING") {
        document.body.style.border = "none";
        return;
      }
      if (this.currentMode === "ZOOMING") {
        return;
      }
    });
  }
  initializeIndicator() {
    this.indicator.style.display = "absolute";
    this.indicator.style.position = "fixed";
    this.indicator.style.left = "0px";
    this.indicator.style.top = "0px";
    this.indicator.style.width = "100%";
    this.indicator.style.height = "100%";
    this.indicator.width = window.innerWidth * 2;
    this.indicator.height = window.innerHeight * 2;
    this.pencil.scale(2, 2);
  }
  adjustMovability(enable) {
    document.body.style.overflow = enable ? "hidden" : "scroll";
  }
  attachIndicator() {
    if (this.isIndicatorOn)
      return;
    document.body.appendChild(this.indicator);
    this.isIndicatorOn = true;
    document.body.style.border = "solid white 2px";
  }
  removeIndicator() {
    this.indicator.remove();
    this.isIndicatorOn = false;
    document.body.style.border = "none";
  }
  moveMainDOM(deltaX, deltaY) {
    this.currentX += deltaX;
    this.currentY += deltaY;
    this.apply();
  }
  zoomMainDOM(amount) {
    this.currentScale += amount / 3000;
    this.apply();
  }
  apply() {
    document.body.style.transform = `translate(${this.currentX}px, ${this.currentY}px) scale(${this.currentScale})`;
  }
}
var mover_default = Mover;

// src/content-scripts/helpers/pageAnaylzer.ts
class PageAnalyzer {
  NOT_PROVIDED = "CONTENT NOT PROVIDED";
  worthMetadataTypes = ["description", "author", "keywords"];
  constructor() {
    this.attach();
  }
  onInitializing() {
  }
  attach() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const webpageData = this.analyzePage();
        sendCommandMessage({
          messageBody: {
            type: "PAGE_ANALYZER",
            body: {
              pageData: webpageData
            }
          }
        });
        return;
      }
      if (event.key === "Backspace") {
        sendCommandMessage({
          messageBody: {
            type: "TTS_STOP",
            body: {}
          }
        });
        return;
      }
    });
  }
  analyzePage() {
    const url = window.location.href;
    const title = document.title;
    const metadatas = this.getMetadatas();
    const description = this.findCertainMetada(metadatas, "description");
    const author = this.findCertainMetada(metadatas, "author");
    const keywords = this.convertStringKeywordsToArray(this.findCertainMetada(metadatas, "keywords"));
    const main = this.getMaindatas();
    return {
      metadata: {
        url,
        title,
        description,
        author,
        keywords
      },
      main
    };
  }
  getMetadatas() {
    return Array.from(document.head.querySelectorAll("meta")).filter((value) => {
      const firstAttribute = value.attributes[0].nodeValue;
      if (firstAttribute === null)
        return;
      return this.worthMetadataTypes.includes(firstAttribute);
    });
  }
  getMaindatas() {
    const innerText = document.body.innerText;
    const headings = [];
    const links = [];
    const images = [];
    this.extractPropertiesFromTags("h1, h2, h3, h4, h5, h6", (currentHeading) => {
      headings.push({
        headingNumber: Number(currentHeading.tagName.slice(1, 2)),
        content: currentHeading.innerHTML
      });
    });
    this.extractPropertiesFromTags("a", (currentLink) => {
      links.push({
        linkTo: currentLink.href,
        content: currentLink.innerText
      });
    });
    this.extractPropertiesFromTags("img", (currentImage) => {
      images.push({
        imageUrl: currentImage.src,
        alt: currentImage.alt
      });
    });
    return {
      innerText,
      headings,
      links,
      images
    };
  }
  findCertainMetada(metaDatas, firstAttribute) {
    const satisfiedMetadata = metaDatas.find((value) => {
      const foundFirstAttribute = value.attributes[0].nodeValue;
      if (foundFirstAttribute === firstAttribute)
        return true;
    });
    if (satisfiedMetadata === undefined)
      return this.NOT_PROVIDED;
    const mainContent = satisfiedMetadata.attributes[1].nodeValue;
    if (mainContent === null)
      return this.NOT_PROVIDED;
    return mainContent;
  }
  convertStringKeywordsToArray(keywords) {
    return keywords.split(",");
  }
  extractPropertiesFromTags(querySelector, callbackFunction) {
    const allSelectedTags = document.querySelectorAll(querySelector);
    Array.from(allSelectedTags).map(callbackFunction);
  }
}
var pageAnaylzer_default = PageAnalyzer;

// src/content-scripts/helpers/textAnalyzer.ts
class TextAnalyzer {
  allTags;
  currentMode;
  attachableTagsType = "h1, h2, h3, h4, h5, h6, span, p, a, li, ul, ol";
  constructor() {
    this.allTags = [];
    this.currentMode = "NONE";
    this.findAllTags();
    this.attach();
  }
  onInitializing() {
  }
  findAllTags() {
    this.allTags = [];
    for (const currentElement of document.body.querySelectorAll(this.attachableTagsType)) {
      const currentNode = currentElement;
      currentNode.style.backgroundColor = "transparent";
      this.allTags.push({
        node: currentNode,
        selected: false
      });
    }
  }
  attach() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Shift") {
        this.currentMode = "PLAIN";
      } else if (event.key === "Control") {
        this.currentMode = "SUMMARIZED";
      } else if (event.key === "Enter") {
        this.analyzeText();
      } else if (event.key === "Backspace") {
        sendCommandMessage({
          messageBody: {
            type: "TTS_STOP",
            body: {}
          }
        });
      } else {
        this.currentMode = "NONE";
      }
      for (const currentElement of this.allTags) {
        currentElement.selected = false;
        const currentNode = currentElement.node;
        currentNode.style.backgroundColor = "transparent";
      }
      return;
    });
    this.allTags.forEach((selectedElement, index) => {
      const currentNode = selectedElement.node;
      currentNode.addEventListener("click", (event) => {
        if (this.currentMode === "PLAIN" || this.currentMode === "SUMMARIZED")
          event.preventDefault();
        if (!event.target)
          return;
        const currentTarget = event.target;
        this.adjustBackgroundColorBasedOnMode(currentTarget);
        const isSelected = this.allTags[index].selected;
        this.allTags[index].selected = !isSelected;
      });
      currentNode.addEventListener("mouseenter", (event) => {
        if (!event.target)
          return;
        const currentTarget = event.target;
        this.adjustBackgroundColorBasedOnMode(currentTarget);
      });
      currentNode.addEventListener("mouseleave", (event) => {
        if (!event.target)
          return;
        const currentTarget = event.target;
        const isSelected = this.allTags[index].selected;
        if (isSelected) {
          this.adjustBackgroundColorBasedOnMode(currentTarget);
        } else {
          this.adjustBackgroundColor(currentTarget, "transparent");
        }
      });
    });
  }
  async analyzeText() {
    const allText = this.generateText();
    if (this.currentMode === "PLAIN") {
      sendCommandMessage({
        messageBody: {
          type: "TTS",
          body: {
            speak: allText
          }
        }
      });
    } else {
      sendCommandMessage({
        messageBody: {
          type: "TEXT_ANALYZER",
          body: {
            text: allText
          }
        }
      });
    }
  }
  adjustBackgroundColor(currentElement, to) {
    currentElement.style.backgroundColor = to;
  }
  adjustBackgroundColorBasedOnMode(currentElement) {
    this.adjustBackgroundColor(currentElement, this.currentMode === "PLAIN" ? "blue" : this.currentMode === "SUMMARIZED" ? "red" : "transparent");
  }
  generateText() {
    const allTagsInnerText = [];
    for (const currentElement of this.allTags) {
      if (!currentElement.selected)
        continue;
      const currentNode = currentElement.node;
      allTagsInnerText.push(currentNode.innerText);
    }
    return allTagsInnerText.join("\n\n");
  }
}
var textAnalyzer_default = TextAnalyzer;

// src/content-scripts/app.ts
async function initApp() {
  const { userInfo } = await getResponseFromMessage({
    type: "FETCH_DATA",
    body: {}
  });
  userInfo.neededHelpers.map((value) => {
    const actions = {
      MOVER: () => new mover_default,
      COLOUR_ADJUSTER: () => new colourAdjuster_default,
      PAGE_ANALYZER: () => new pageAnaylzer_default,
      IMAGE_ANALYZER: () => new imageAnaylzer_default,
      TEXT_ANALYZER: () => new textAnalyzer_default
    };
    actions[value]();
  });
}
async function attachShortcuts() {
  const { userInfo } = await getResponseFromMessage({
    type: "FETCH_DATA",
    body: {}
  });
  document.addEventListener("keydown", (event) => {
    if (!document.activeElement)
      return;
    const activeTagName = document.activeElement.tagName;
    if (activeTagName.toLowerCase() === "input" || activeTagName.toLowerCase() === "textarea") {
      return;
    }
    const pressedKey = event.key;
    const foundShortCut = ShortCuts.find((currentShortCut) => currentShortCut.key === pressedKey);
    if (!foundShortCut)
      return;
    let enabled;
    if (foundShortCut.togglingHelper === "degree") {
      if (pressedKey === "ArrowUp") {
        const increasedDegree = userInfo.personalPreference.ai.degree + 1;
        userInfo.personalPreference.ai.degree = increasedDegree > 3 ? 3 : increasedDegree;
      } else {
        const increasedDegree = userInfo.personalPreference.ai.degree - 1;
        userInfo.personalPreference.ai.degree = increasedDegree < 1 ? 1 : increasedDegree;
      }
    } else {
      const indexOfFoundHelper = userInfo.neededHelpers.indexOf(foundShortCut.togglingHelper);
      if (indexOfFoundHelper === -1) {
        userInfo.neededHelpers.push(foundShortCut.togglingHelper);
        enabled = true;
      } else {
        userInfo.neededHelpers.splice(indexOfFoundHelper, 1);
        enabled = false;
      }
    }
    sendCommandMessage({
      messageBody: {
        type: "CHANGE_DATA",
        body: {
          changedData: userInfo
        }
      },
      onMessageReceive() {
        sendCommandMessage({
          messageBody: {
            type: "TTS",
            body: {
              speak: foundShortCut.togglingHelper === "degree" ? `The degree value has ${event.key === "ArrowUp" ? "increased" : "decreased"} to ${userInfo.personalPreference.ai.degree}` : `The helper ${foundShortCut.togglingHelper} has ${enabled ? "enabled" : "disabled"}`
            }
          }
        });
      }
    });
  });
}
var ShortCuts = [
  {
    key: "m",
    togglingHelper: Helpers.MOVER
  },
  {
    key: "c",
    togglingHelper: Helpers.COLOUR_ADJUSTER
  },
  {
    key: "t",
    togglingHelper: Helpers.TEXT_ANALYZER
  },
  {
    key: "i",
    togglingHelper: Helpers.IMAGE_ANALYZER
  },
  {
    key: "p",
    togglingHelper: Helpers.PAGE_ANALYZER
  },
  {
    key: "ArrowUp",
    togglingHelper: "degree"
  },
  {
    key: "ArrowDown",
    togglingHelper: "degree"
  }
];
var app_default = initApp;

// src/content-scripts/index.ts
window.onload = async () => {
  app_default();
  attachShortcuts();
};
