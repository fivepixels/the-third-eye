import UserInformation, { MajorHelpers } from "user";
import { getStorageData } from "@src/utils/storage";
import Logger, { RecordStatus } from "./minor/logger";

abstract class Helper {
  protected userInformation?: UserInformation;
  protected name: MajorHelpers;
  protected description: string;
  protected mainDOM: Document;

  private logger: Logger;

  constructor(name: MajorHelpers, description: string, logger: Logger) {
    this.name = name;
    this.description = description;
    this.mainDOM = document;

    this.logger = logger;

    this.initialize();
  }

  protected async initialize() {
    this.userInformation = await getStorageData();
    this.logger.makeLog({
      category: "HELPERS",
      logger: this.name,
      status: "SUCCESSED",
      message: `The helper, ${this.name} is being triggered.`
    });
  }

  protected act(status: RecordStatus, message: string) {
    this.logger.makeLog({
      category: "HELPERS",
      status,
      logger: this.name,
      message
    });
  }

  protected export() {
    this.logger.export();
  }
}

export default Helper;
