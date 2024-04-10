/* BASIC HELPER */

import user, { AIPreference, Helpers } from "@shapes/user";
import { getResponseFromMessage, sendCommandMessage } from "../utils/messenger";
import {
  ExpectedRespondingFetchDataMessage,
  SendingFetchDataMessage,
  SendingTTSSpeakMessage,
  SendingTTSStopMessage
} from "@src/shapes/message";

abstract class Helper {
  private name: Helpers;
  protected mainDOM: Document;
  protected userInfo?: user;

  protected readonly defaultAIPreference: AIPreference = {
    degree: 1
  };

  constructor(name: Helpers) {
    this.name = name;
    this.mainDOM = document;

    this.initialize();
  }

  abstract onInitializing(safeUserInfo: user): void;

  private async initialize() {
    try {
      const { userInfo } = await getResponseFromMessage<
        SendingFetchDataMessage,
        ExpectedRespondingFetchDataMessage
      >({
        type: "FETCH_DATA",
        body: {}
      });

      this.userInfo = userInfo;
      this.onInitializing(userInfo);
    } catch (error) {
      console.error(error);
      alert(
        "There was an error while receiving your data. Please refresh the page."
      );
    }
  }

  protected speak(speak: string) {
    sendCommandMessage<SendingTTSSpeakMessage>({
      messageBody: {
        type: "TTS",
        body: {
          speak
        }
      }
    });

    return;
  }

  protected stopSpeaking() {
    sendCommandMessage<SendingTTSStopMessage>({
      messageBody: {
        type: "TTS_STOP",
        body: {}
      }
    });

    return;
  }
}

export default Helper;
