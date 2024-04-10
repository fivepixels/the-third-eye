import {
  getResponseFromMessage,
  sendCommandMessage
} from "@src/core/cs/utils/messenger";
import {
  ExpectedRespondingFetchDataMessage,
  SendingChangeDataMessage,
  SendingFetchDataMessage,
  SendingTTSSpeakMessage
} from "@src/shapes/message";
import user, { ColourDeficiency, Helpers } from "@src/shapes/user";

async function popup() {
  const main = document.querySelector("main");

  if (!main) {
    onError();

    return;
  }

  const helpersLayout = addLayout(
    main,
    2,
    "Helpers",
    "You can select multiple helpers that will be helping you."
  );

  const preferenceLayout = addLayout(
    main,
    2,
    "Preferences",
    "You can select preference options that will adjust values for helpers."
  );

  const colourDeficiencyLaouyt = addLayout(
    preferenceLayout,
    3,
    "Colour Deficiency",
    "These options for the people who have Colour Blindness. You can choose one of these selections."
  );

  const aiLayout = addLayout(
    preferenceLayout,
    3,
    "AI Deficiency",
    "These options for AI options that you can change AI's preferences as you want."
  );

  const { userInfo } = await getResponseFromMessage<
    SendingFetchDataMessage,
    ExpectedRespondingFetchDataMessage
  >({
    type: "FETCH_DATA",
    body: {}
  });

  const allHelpers: AddButtonReceive[] = [];
  const allPreferences: AddButtonReceive[] = [];

  Object.keys(Helpers).map(currentKey => {
    const currentHelper = Helpers[currentKey as keyof typeof Helpers];

    allHelpers.push({
      title: currentHelper,
      layout: helpersLayout,
      defaultValue() {
        return userInfo.neededHelpers.includes(currentHelper);
      },
      onChanged(prevUser, id, changedTo) {
        if (typeof changedTo === "number") return prevUser;

        const currentId = id as Helpers;

        if (changedTo === true) {
          prevUser.neededHelpers.push(currentId);
          return prevUser;
        }

        prevUser.neededHelpers = prevUser.neededHelpers.filter(
          value => value !== currentId
        );

        return prevUser;
      }
    });
  });

  Object.keys(ColourDeficiency).map(currentKey => {
    const currentDeficiency =
      ColourDeficiency[currentKey as keyof typeof ColourDeficiency];

    allPreferences.push({
      title: currentDeficiency,
      layout: colourDeficiencyLaouyt,
      uniqueAmong: Object.values(ColourDeficiency),
      defaultValue() {
        return (
          userInfo.personalPreference.colourAdjuster.deficiency ===
          currentDeficiency
        );
      },
      onChanged(prevUser) {
        prevUser.personalPreference.colourAdjuster.deficiency =
          currentDeficiency;
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
      if (typeof changedTo !== "number") return prevUser;
      prevUser.personalPreference.ai.degree = changedTo;
      return prevUser;
    }
  });

  allPreferences.push({
    title: "OpenAI API KEY",
    layout: aiLayout,
    defaultValue() {
      return userInfo.personalPreference.ai.apiKey
        ? userInfo.personalPreference.ai.apiKey
        : "";
    },
    onChanged(prevUser, _id, changedTo) {
      if (typeof changedTo !== "string") return prevUser;
      prevUser.personalPreference.ai.apiKey = changedTo;
      return prevUser;
    }
  });

  allHelpers.map(currentHelperUIOption => {
    addButton(currentHelperUIOption);
  });

  allPreferences.map(currentHelperUIOption => {
    addButton(currentHelperUIOption);
  });
}

function addLayout(
  parentLayout: HTMLElement,
  degree: number,
  title: string,
  description: string
): HTMLDivElement {
  const createdLayout = document.createElement("div");
  const createdTitle = document.createElement(`h${degree}`);
  const createdDescription = document.createElement("p");

  createdTitle.innerText = title;
  createdTitle.id = title.replace(" ", "-");
  createdDescription.innerText = description;

  if (degree === 2) {
    const createdLine = document.createElement("hr");
    createdLine.style.marginTop = "20px";
    createdLayout.appendChild(createdLine);
  }

  createdLayout.appendChild(createdTitle);
  createdLayout.appendChild(createdDescription);
  parentLayout.appendChild(createdLayout);

  return createdLayout;
}

interface AddButtonReceive {
  layout: HTMLElement;
  title: string;
  uniqueAmong?: string[];
  defaultValue: () => boolean | string | ButtonDefaultValue;
  onChanged: (
    prevUser: user,
    id: string,
    changedTo: boolean | number | string
  ) => user;
}

interface ButtonDefaultValue {
  max: number;
  min: number;
  default: number;
}

function addButton({
  layout,
  title,
  defaultValue,
  uniqueAmong,
  onChanged
}: AddButtonReceive) {
  const createdParentDiv = document.createElement("div");
  const createdButton = document.createElement("input");
  const createdLabel = document.createElement("label");

  const defaultButtonValue = defaultValue();

  createdParentDiv.style.display = "flex";
  createdParentDiv.style.flexDirection = "row";
  createdParentDiv.style.alignItems = "center";
  createdParentDiv.style.justifyContent = "space-between";

  createdButton.style.width = "50%";

  if (typeof defaultButtonValue === "object") {
    const defaultValue = defaultButtonValue as ButtonDefaultValue;

    createdButton.type = "number";
    createdButton.max = `${defaultValue.max}`;
    createdButton.min = `${defaultValue.min}`;
    createdButton.defaultValue = `${defaultValue.default}`;
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
    const { userInfo } = await getResponseFromMessage<
      SendingFetchDataMessage,
      ExpectedRespondingFetchDataMessage
    >({
      type: "FETCH_DATA",
      body: {}
    });

    if (uniqueAmong) {
      const allButtons = document.querySelectorAll("input");

      const selectedButtons = Array.from(allButtons).filter(currentButton =>
        uniqueAmong.includes(currentButton.id)
      );

      selectedButtons.map(currentButton => {
        currentButton.checked = false;
        createdButton.checked = true;
      });
    }

    const changedUserData = onChanged(
      userInfo,
      title,
      typeof defaultButtonValue === "object"
        ? Number(createdButton.value)
        : typeof defaultButtonValue === "boolean"
          ? createdButton.checked
          : createdButton.value
    );

    sendCommandMessage<SendingChangeDataMessage>({
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
}

function onError() {
  const errorMessage =
    "There is an error with initializing the UI and UX. Please refresh the page.";

  console.error(
    "There is an error with initializing the UI and UX. Please refresh the page."
  );

  const createdErrorMessage = document.createElement("p");

  createdErrorMessage.innerText = errorMessage;
  createdErrorMessage.style.color = "red";
  createdErrorMessage.style.fontWeight = "700";

  document.body.appendChild(createdErrorMessage);

  sendCommandMessage<SendingTTSSpeakMessage>({
    messageBody: {
      type: "TTS",
      body: {
        speak: errorMessage
      }
    }
  });

  return;
}

popup();
