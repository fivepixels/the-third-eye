import {
  ExpectedRespondingChangeDataMessage,
  ExpectedRespondingFetchDataMessage,
  SendingChangeDataMessage,
  SendingFetchDataMessage
} from "@shapes/message";
import { getResponseFromMessage } from "../utils/messenger";
import user from "@shapes/user";

class StorageManager {
  constructor() {}

  public async getUser(): Promise<user> {
    const response = await getResponseFromMessage<
      SendingFetchDataMessage,
      ExpectedRespondingFetchDataMessage
    >({
      type: "FETCH_DATA",
      body: {}
    });

    return response.userInfo;
  }

  public async setUser(
    setUserCallback: (userInfo: user) => Partial<user>
  ): Promise<void> {
    const prevUserInfo = await this.getUser();
    const updatedUserInfo = setUserCallback(prevUserInfo);
    const changedUserInfo = {
      ...prevUserInfo,
      ...updatedUserInfo
    };

    await getResponseFromMessage<
      SendingChangeDataMessage,
      ExpectedRespondingChangeDataMessage
    >({
      type: "CHANGE_DATA",
      body: {
        changedData: changedUserInfo
      }
    });
  }
}

export default StorageManager;
