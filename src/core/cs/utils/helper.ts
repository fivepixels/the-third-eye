import {
  ExpectedRespondingFetchDataMessage,
  SendingFetchDataMessage,
  SendingTTSSpeakMessage
} from "@src/shapes/message";
import user from "@src/shapes/user";
import { getResponseFromMessage, sendCommandMessage } from "./messenger";

async function getUserInfo(): Promise<user | false> {
  try {
    const { userInfo } = await getResponseFromMessage<
      SendingFetchDataMessage,
      ExpectedRespondingFetchDataMessage
    >({
      type: "FETCH_DATA",
      body: {}
    });

    return userInfo;
  } catch (error) {
    console.error(error);

    sendCommandMessage<SendingTTSSpeakMessage>({
      messageBody: {
        type: "TTS",
        body: {
          speak:
            "There was an error while receiving your data. Please refresh the page."
        }
      }
    });

    return false;
  }
}

export default getUserInfo;
