import UserInformation from "@src/types/user";

import Helper from "@core/cs/helpers";

// import Mover from "./helpers/major/mover";
// import ColourAdjuster from "./helpers/major/colourAdjuster";
// import Speaker from "./helpers/major/speaker";

class App {
  private id: number;
  private userInformation?: UserInformation;
  private neededHelpers: Helper[];

  constructor(userInformation?: UserInformation) {
    this.id = 1;
    this.userInformation = userInformation;

    this.neededHelpers = [];

    this.init();

    console.log("NEW APP INSTANCE HAS BEEN CREATED.", Math.random() * 1000);

    // this.logger.log({
    //   logger: "MAIN",
    //   message: "New Tab is open. New APP instance has been created.",
    //   status: "SUCCESSED",
    //   category: "SYSTEM"
    // });
  }

  private init() {
    if (!this.userInformation || !this.userInformation.major) return;

    this.userInformation.major.neededHelpers.map(value => {
      if (value.helper === "MOVER") {
        // this.neededHelpers.push(new Mover(this.logger));
      } else if (value.helper === "COLOUR_ADJUSTER") {
        // this.neededHelpers.push(new ColourAdjuster(this.logger));
      } else if (value.helper === "SPEAKER") {
        // this.neededHelpers.push(new Speaker(this.logger));
      }
    });
  }
}

export default App;
