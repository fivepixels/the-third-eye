import { MajorHelpers } from "@src/types/user";
import { getCurrentTime } from "../time";

interface Record {
  category: RecordCategory;
  status: RecordStatus;
  logger: LoggerType;
  message: string;
  happenedAt: string;
}

export type LoggerType = MajorHelpers | "LOGGER" | "MAIN";
export type RecordCategory = "SYSTEM" | "HELPERS" | "ACTION";
export type RecordStatus = "SUCCESSED" | "FAILED";

interface LogMakerReceive {
  category: RecordCategory;
  status: RecordStatus;
  logger: LoggerType;
  message: string;
}

class Logger {
  private records: Record[];

  constructor() {
    this.records = [];

    this.log({
      category: "SYSTEM",
      logger: "LOGGER",
      status: "SUCCESSED",
      message: "The logger is being initialized."
    });
  }

  public log(info: LogMakerReceive) {
    // 0 | year-month-dayThour:minute:second | [category] > [logger] | [status] | message
    // idx | 2024-02-15T21:57:28.584Z | SYSTEM > LOGGER | SUCCESSED | The logger is being initialized

    this.records.push({
      ...info,
      happenedAt: getCurrentTime()
    });
  }

  public export() {
    this.log({
      category: "SYSTEM",
      logger: "LOGGER",
      status: "SUCCESSED",
      message: "ALL RECORDS ARE BEING EXPORTED AS TEXT PLAIN FORMAT"
    });

    const data = new Blob([this.convertRecordsToString()], {
      type: "text/plain"
    });

    const url = window.URL.createObjectURL(data);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "records.txt";
    document.body.appendChild(anchor);
    anchor.click();
    window.URL.revokeObjectURL(url);
    anchor.remove();
  }

  public logOnConsole() {
    console.table(this.records);
  }

  private convertRecordsToString(): string {
    let plainText: string = "";

    this.records.map((value, idx) => {
      plainText += `${idx} | ${value.happenedAt} | ${value.category} > ${value.logger} | ${value.status} | ${value.message}\n`;
    });

    return plainText;
  }
}

export default Logger;