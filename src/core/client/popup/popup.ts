import {
  getResponseFromMessage,
  sendCommandMessage
} from "@src/core/cs/utils/messenger";
import {
  ExpectedRespondingChangeDataMessage,
  ExpectedRespondingFetchDataMessage,
  SendingChangeDataMessage,
  SendingFetchDataMessage
} from "@src/shapes/message";
import user, { ColourDeficiency, Helpers } from "@src/shapes/user";

async function popup() {
  const main = document.querySelector("main");
  const saveOptionButton = document.querySelector("#save-options");

  if (!main || !saveOptionButton) {
    console.error("There is an error with initializing the UI/UX.");

    const createdErrorMessage = document.createElement("p");

    createdErrorMessage.innerText =
      "There is an error with initializing the UI/UX.";
    createdErrorMessage.style.color = "red";
    createdErrorMessage.style.fontWeight = "700";

    document.body.appendChild(createdErrorMessage);

    return;
  }

  saveOptionButton.addEventListener("click", () => {});

  const helpersLayout = addLayout(
    main,
    "Helpers",
    "You can select multiple helpers that will be helping you/your person."
  );

  const preferenceLayout = addLayout(
    main,
    "Preferences",
    "You can select preference options that will adjust values for helpers."
  );

  const colourDeficiencyLaouyt = addLayout(
    preferenceLayout,
    "Colour Deficiency",
    "These options for the people who have Colour Blindness. You can choose one of these selections."
  );

  const aiLayout = addLayout(
    preferenceLayout,
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
      defaultValue: () => userInfo.neededHelpers.includes(currentHelper),
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
      defaultValue: () =>
        userInfo.personalPreference.colourAdjuster.deficiency ===
        currentDeficiency,
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
    defaultValue: () => ({
      min: 1,
      max: 3,
      default: userInfo.personalPreference.ai.degree
    }),
    onChanged(prevUser, _id, changedTo) {
      if (typeof changedTo === "boolean") return prevUser;
      prevUser.personalPreference.ai.degree = changedTo;
      return prevUser;
    }
  });

  allPreferences.push({
    title: "Prefer To Log",
    layout: aiLayout,
    defaultValue: () => userInfo.personalPreference.ai.preferToLog,
    onChanged(prevUser, _id, changedTo) {
      if (typeof changedTo === "number") return prevUser;
      prevUser.personalPreference.ai.preferToLog = changedTo;
      return prevUser;
    }
  });

  allPreferences.push({
    title: "Prefer to Speak",
    layout: aiLayout,
    defaultValue: () => userInfo.personalPreference.ai.preferToSpeak,
    onChanged(prevUser, _id, changedTo) {
      if (typeof changedTo === "number") return prevUser;
      prevUser.personalPreference.ai.preferToSpeak = changedTo;
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
  title: string,
  description: string
): HTMLDivElement {
  const createdLayout = document.createElement("div");
  const createdTitle = document.createElement("h2");
  const createdDescription = document.createElement("p");

  createdTitle.innerText = title;
  createdTitle.id = title.replace(" ", "-");
  createdDescription.innerText = description;

  createdLayout.appendChild(createdTitle);
  createdLayout.appendChild(createdDescription);
  parentLayout.appendChild(createdLayout);

  return createdLayout;
}

interface AddButtonReceive {
  layout: HTMLElement;
  title: string;
  uniqueAmong?: string[];
  defaultValue: () =>
    | boolean
    | {
        max: number;
        min: number;
        default: number;
      };
  onChanged: (prevUser: user, id: string, changedTo: boolean | number) => user;
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
  const isDefaultValueBoolean = typeof defaultButtonValue === "boolean";

  createdParentDiv.style.display = "flex";
  createdParentDiv.style.flexDirection = "row";
  createdParentDiv.style.alignItems = "center";
  createdParentDiv.style.justifyContent = "left";

  if (isDefaultValueBoolean) {
    createdButton.type = "checkbox";
    createdButton.defaultChecked = defaultButtonValue;
  } else {
    createdButton.type = "number";
    createdButton.max = `${defaultButtonValue.max}`;
    createdButton.min = `${defaultButtonValue.min}`;
    createdButton.defaultValue = `${defaultButtonValue.default}`;
  }

  createdButton.id = title;

  createdButton.addEventListener(
    isDefaultValueBoolean ? "click" : "change",
    async () => {
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
        isDefaultValueBoolean
          ? createdButton.checked
          : Number(createdButton.value)
      );

      sendCommandMessage<
        SendingChangeDataMessage,
        ExpectedRespondingChangeDataMessage
      >({
        messageBody: {
          type: "CHANGE_DATA",
          body: {
            changedData: changedUserData
          }
        }
      });
    }
  );

  createdLabel.innerText = title;
  createdLabel.htmlFor = title;

  if (isDefaultValueBoolean) {
    createdParentDiv.appendChild(createdButton);
    createdParentDiv.appendChild(createdLabel);
  } else {
    createdParentDiv.appendChild(createdLabel);
    createdParentDiv.appendChild(createdButton);
  }

  layout.appendChild(createdParentDiv);
}

popup();
