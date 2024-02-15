import UserInformation from "user";
import Helper from "@core/cs/helpers";
import Logger from "@core/cs/helpers/minor/logger";
import Notifier from "@core/cs/helpers/minor/notifier";

class App {
  private userInformation: UserInformation;
  private neededHelpers: Helper[];
  private logger: Logger;
  private notifier: Notifier;

  constructor(userInformation: UserInformation) {
    this.userInformation = userInformation;
    this.logger = new Logger();
    this.notifier = new Notifier();

    this.neededHelpers = [];
  }
}

export default App;
