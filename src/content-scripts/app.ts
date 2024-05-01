/**
 * Copyright 2024 Seol SO
 * SPDX-License-Identifier: MIT
 */

import type {
  ExpectedRespondingFetchDataMessage,
  SendingChangeDataMessage,
  SendingFetchDataMessage,
  SendingTTSSpeakMessage,
} from "@type/message";
import { Helpers } from "@type/user";
import ColourAdjuster from "./helpers/colourAdjuster";
import ImageAnalyzer from "./helpers/imageAnaylzer";
import Mover from "./helpers/mover";
import PageAnalyzer from "./helpers/pageAnaylzer";
import TextAnalyzer from "./helpers/textAnalyzer";
import { getResponseFromMessage, sendCommandMessage } from "./messenger";

async function initApp() {
  const { userInfo } = await getResponseFromMessage<
    SendingFetchDataMessage,
    ExpectedRespondingFetchDataMessage
  >({
    type: "FETCH_DATA",
    body: {},
  });

  userInfo.neededHelpers.map((value) => {
    const actions: { [K in Helpers]: () => void } = {
      MOVER: () => new Mover(),
      COLOUR_ADJUSTER: () => new ColourAdjuster(),
      PAGE_ANALYZER: () => new PageAnalyzer(),
      IMAGE_ANALYZER: () => new ImageAnalyzer(),
      TEXT_ANALYZER: () => new TextAnalyzer(),
    };

    actions[value]();
  });
}

interface ShortCut {
  key: string;
  togglingHelper: Helpers | "degree";
}

const ShortCuts: ShortCut[] = [
  {
    key: "m",
    togglingHelper: Helpers.MOVER,
  },
  {
    key: "c",
    togglingHelper: Helpers.COLOUR_ADJUSTER,
  },
  {
    key: "t",
    togglingHelper: Helpers.TEXT_ANALYZER,
  },
  {
    key: "i",
    togglingHelper: Helpers.IMAGE_ANALYZER,
  },
  {
    key: "p",
    togglingHelper: Helpers.PAGE_ANALYZER,
  },
  {
    key: "ArrowUp",
    togglingHelper: "degree",
  },
  {
    key: "ArrowDown",
    togglingHelper: "degree",
  },
];

export async function attachShortcuts() {
  const { userInfo } = await getResponseFromMessage<
    SendingFetchDataMessage,
    ExpectedRespondingFetchDataMessage
  >({
    type: "FETCH_DATA",
    body: {},
  });

  document.addEventListener("keydown", (event) => {
    const pressedKey = event.key;

    const foundShortCut = ShortCuts.find(
      (currentShortCut) => currentShortCut.key === pressedKey,
    );

    if (!foundShortCut) return;

    let enabled: boolean;

    if (foundShortCut.togglingHelper === "degree") {
      if (pressedKey === "ArrowUp") {
        const increasedDegree = userInfo.personalPreference.ai.degree + 1;

        userInfo.personalPreference.ai.degree =
          increasedDegree > 3 ? 3 : increasedDegree;
      } else {
        const increasedDegree = userInfo.personalPreference.ai.degree - 1;

        userInfo.personalPreference.ai.degree =
          increasedDegree < 1 ? 1 : increasedDegree;
      }
    } else {
      const indexOfFoundHelper = userInfo.neededHelpers.indexOf(
        foundShortCut.togglingHelper,
      );

      if (indexOfFoundHelper === -1) {
        userInfo.neededHelpers.push(foundShortCut.togglingHelper);
        enabled = true;
      } else {
        userInfo.neededHelpers.splice(indexOfFoundHelper, 1);
        enabled = false;
      }
    }

    sendCommandMessage<SendingChangeDataMessage>({
      messageBody: {
        type: "CHANGE_DATA",
        body: {
          changedData: userInfo,
        },
      },
      onMessageReceive() {
        sendCommandMessage<SendingTTSSpeakMessage>({
          messageBody: {
            type: "TTS",
            body: {
              speak:
                foundShortCut.togglingHelper === "degree"
                  ? `The degree value has ${
                      event.key === "ArrowUp" ? "increased" : "decreased"
                    } to ${userInfo.personalPreference.ai.degree}`
                  : `The helper ${foundShortCut.togglingHelper} has ${
                      enabled ? "enabled" : "disabled"
                    }`,
            },
          },
        });
      },
    });
  });
}

export default initApp;
