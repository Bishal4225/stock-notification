import {
  getDowntrendStocks,
  // getSidewaysStocks,
  getUptrendStocks,
} from "./get-intraday-stocks";

export class Cron {
  private tasks = {
    getUptrendStocks,
    getDowntrendStocks,
    // getSidewaysStocks,
  };

  public start() {
    Object.values(this.tasks).forEach((task) => task.start());
  }

  public stop() {
    Object.values(this.tasks).forEach((task) => task.stop());
  }

  public getTasks() {
    return this.tasks;
  }
}
