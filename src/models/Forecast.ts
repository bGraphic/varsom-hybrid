import { Warning } from "./Warning"

export class Forecast {
  private day0: Warning;
  private day1: Warning;
  private day2: Warning;
  constructor() { }

  getWarningForIndex(i: number): Warning {
    switch (i) {
      case 0:
        return this.day0;
      case 1:
        return this.day1;
      case 2:
        return this.day2;
    }
  }

}
