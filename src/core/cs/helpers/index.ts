import UserInformation, { MajorHelpers } from "@src/types/user";
// import { getStorageData } from "@src/utils/storage";
// import Logger, { RecordStatus } from "./minor/logger";

abstract class Helper {
  protected userInformation?: UserInformation;
  protected name: MajorHelpers;
  protected description: string;
  protected mainDOM: Document;

  constructor(name: MajorHelpers, description: string) {
    this.name = name;
    this.description = description;
    this.mainDOM = document;

    this.initialize();
  }

  protected async initialize() {
    // this.userInformation = await getStorageData();
    // this.logger.log({
    //   category: "HELPERS",
    //   logger: this.name,
    //   status: "SUCCESSED",
    //   message: `The helper, ${this.name} is being triggered.`
    // });
  }

  // protected act(status: RecordStatus, message: string) {
  // this.logger.log({
  //   category: "HELPERS",
  //   status,
  //   logger: this.name,
  //   message
  // });
  // }

  protected export() {
    // this.logger.export();
  }
}

export default Helper;
