/* BASIC HELPER */

import { AIPreference, Helpers } from "@shapes/user";
import { sendCommandMessage } from "../utils/messenger";
import {
  ExpectedRespondingTTSSpeakMessage,
  ExpectedRespondingTTSStopMessage,
  SendingTTSSpeakMessage,
  SendingTTSStopMessage
} from "@src/shapes/message";

abstract class Helper {
  private name: Helpers;
  protected mainDOM: Document;

  protected readonly defaultAIPreference: AIPreference = {
    degree: 1,
    preferToSpeak: true,
    preferToLog: true
  };

  constructor(name: Helpers) {
    this.name = name;
    this.mainDOM = document;
  }

  protected speak(speak: string) {
    sendCommandMessage<
      SendingTTSSpeakMessage,
      ExpectedRespondingTTSSpeakMessage
    >({
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
    sendCommandMessage<SendingTTSStopMessage, ExpectedRespondingTTSStopMessage>(
      {
        messageBody: {
          type: "TTS_STOP",
          body: {}
        }
      }
    );

    return;
  }
}

export default Helper;
