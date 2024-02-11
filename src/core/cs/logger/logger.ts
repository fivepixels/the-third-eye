import { MajorHelpers } from "@src/core/types";

interface Record {
  category: RecordCategory;
  status: RecordStatus;
  logger: LoggerType;
  message: string;
  happenedAt: string;
}

export type LoggerType = MajorHelpers | "LOGGER";
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

    this.makeLog({
      category: "SYSTEM",
      logger: "LOGGER",
      status: "SUCCESSED",
      message: "The logger is being initialized."
    });
  }

  public makeLog(info: LogMakerReceive) {
    this.records.push({
      ...info,
      happenedAt: this.getCurrentTime()
    });
  }

  public export() {
    this.makeLog({
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

  private convertRecordsToString(): string {
    let plainText: string = "";

    this.records.map((value, idx) => {
      plainText +=
        `${idx} | [${value.category}] | [${value.logger}] | ${value.message} | ${value.happenedAt}` +
        "\n";
    });

    return plainText;
  }

  private getCurrentTime(): string {
    return new Date().toString();
  }
}

export default Logger;
