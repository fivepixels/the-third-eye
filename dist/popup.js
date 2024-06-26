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

// src/client/popup/popup.ts
async function popup() {
  const main = document.querySelector("main");
  if (!main) {
    onError();
    return;
  }
  const helpersLayout = addLayout(main, 2, "Helpers", "You can select multiple helpers that will be helping you.");
  const preferenceLayout = addLayout(main, 2, "Preferences", "You can select preference options that will adjust values for helpers.");
  const colourDeficiencyLaouyt = addLayout(preferenceLayout, 3, "Colour Deficiency", "These options for the people who have Colour Blindness. You can choose one of these selections.");
  const aiLayout = addLayout(preferenceLayout, 3, "AI Settings", "These options for AI options that you can change AI's preferences as you want.");
  const { userInfo } = await getResponseFromMessage({
    type: "FETCH_DATA",
    body: {}
  });
  const allHelpers = [];
  const allPreferences = [];
  Object.keys(Helpers).map((currentKey) => {
    const currentHelper = Helpers[currentKey];
    allHelpers.push({
      title: currentHelper,
      layout: helpersLayout,
      defaultValue() {
        return userInfo.neededHelpers.includes(currentHelper);
      },
      onChanged(prevUser, id, changedTo) {
        if (typeof changedTo === "number")
          return prevUser;
        const currentId = id;
        if (changedTo === true) {
          prevUser.neededHelpers.push(currentId);
          return prevUser;
        }
        prevUser.neededHelpers = prevUser.neededHelpers.filter((value) => value !== currentId);
        return prevUser;
      }
    });
  });
  Object.keys(ColourDeficiency).map((currentKey) => {
    const currentDeficiency = ColourDeficiency[currentKey];
    allPreferences.push({
      title: currentDeficiency,
      layout: colourDeficiencyLaouyt,
      uniqueAmong: Object.values(ColourDeficiency),
      defaultValue() {
        return userInfo.personalPreference.colourAdjuster.deficiency === currentDeficiency;
      },
      onChanged(prevUser) {
        prevUser.personalPreference.colourAdjuster.deficiency = currentDeficiency;
        return prevUser;
      }
    });
  });
  allPreferences.push({
    title: "Degree",
    layout: aiLayout,
    defaultValue() {
      return { min: 1, max: 3, default: userInfo.personalPreference.ai.degree };
    },
    onChanged(prevUser, _id, changedTo) {
      if (typeof changedTo !== "number")
        return prevUser;
      prevUser.personalPreference.ai.degree = changedTo;
      return prevUser;
    }
  });
  allPreferences.push({
    title: "OpenAI API KEY",
    layout: aiLayout,
    defaultValue() {
      return userInfo.personalPreference.ai.apiKey ? userInfo.personalPreference.ai.apiKey : "";
    },
    onChanged(prevUser, _id, changedTo) {
      if (typeof changedTo !== "string")
        return prevUser;
      prevUser.personalPreference.ai.apiKey = changedTo;
      return prevUser;
    }
  });
  allHelpers.map((currentHelperUIOption) => {
    addButton(currentHelperUIOption);
  });
  allPreferences.map((currentHelperUIOption) => {
    addButton(currentHelperUIOption);
  });
}
var addLayout = function(parentLayout, degree, title, description) {
  const createdLayout = document.createElement("div");
  const createdTitle = document.createElement(`h${degree}`);
  const createdDescription = document.createElement("p");
  createdTitle.innerText = title;
  createdTitle.id = title.replace(" ", "-");
  createdDescription.innerText = description;
  createdTitle.style.marginBottom = "5px";
  if (degree === 2) {
    const createdLine = document.createElement("hr");
    createdLine.style.marginTop = "20px";
    createdLayout.appendChild(createdLine);
  }
  createdLayout.appendChild(createdTitle);
  createdLayout.appendChild(createdDescription);
  parentLayout.appendChild(createdLayout);
  return createdLayout;
};
var addButton = function({
  layout,
  title,
  defaultValue,
  uniqueAmong,
  onChanged
}) {
  const createdParentDiv = document.createElement("div");
  const createdButton = document.createElement("input");
  const createdLabel = document.createElement("label");
  const defaultButtonValue = defaultValue();
  createdParentDiv.style.display = "flex";
  createdParentDiv.style.flexDirection = "row";
  createdParentDiv.style.alignItems = "center";
  createdParentDiv.style.justifyContent = "space-between";
  createdParentDiv.style.marginBottom = "5px";
  createdButton.style.width = "50%";
  if (typeof defaultButtonValue === "object") {
    const defaultValue2 = defaultButtonValue;
    createdButton.type = "number";
    createdButton.max = `${defaultValue2.max}`;
    createdButton.min = `${defaultValue2.min}`;
    createdButton.defaultValue = `${defaultValue2.default}`;
  } else if (typeof defaultButtonValue === "string") {
    createdButton.type = "input";
    createdButton.defaultValue = `${defaultButtonValue}`;
  } else if (typeof defaultButtonValue === "boolean") {
    createdButton.type = "checkbox";
    createdButton.defaultChecked = defaultButtonValue;
    createdButton.style.display = "flex";
    createdButton.style.alignItems = "center";
    createdButton.style.justifyContent = "flex-end";
  }
  createdButton.id = title;
  createdButton.addEventListener("input", async () => {
    const { userInfo } = await getResponseFromMessage({
      type: "FETCH_DATA",
      body: {}
    });
    if (uniqueAmong) {
      const allButtons = document.querySelectorAll("input");
      const selectedButtons = Array.from(allButtons).filter((currentButton) => uniqueAmong.includes(currentButton.id));
      selectedButtons.map((currentButton) => {
        currentButton.checked = false;
        createdButton.checked = true;
      });
    }
    const changedUserData = onChanged(userInfo, title, typeof defaultButtonValue === "object" ? Number(createdButton.value) : typeof defaultButtonValue === "boolean" ? createdButton.checked : createdButton.value);
    sendCommandMessage({
      messageBody: {
        type: "CHANGE_DATA",
        body: {
          changedData: changedUserData
        }
      }
    });
  });
  createdLabel.innerText = title;
  createdLabel.htmlFor = title;
  createdParentDiv.appendChild(createdLabel);
  createdParentDiv.appendChild(createdButton);
  layout.appendChild(createdParentDiv);
};
var onError = function() {
  const errorMessage = "There is an error with initializing the UI and UX. Please refresh the page.";
  console.error(errorMessage);
  const createdErrorMessage = document.createElement("p");
  createdErrorMessage.innerText = errorMessage;
  createdErrorMessage.style.color = "red";
  createdErrorMessage.style.fontWeight = "700";
  document.body.appendChild(createdErrorMessage);
  sendCommandMessage({
    messageBody: {
      type: "TTS",
      body: {
        speak: errorMessage
      }
    }
  });
  return;
};
popup();
