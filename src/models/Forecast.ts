import { Warning } from "./Warning"

export class Forecast {
  warnings: Warning[];
  constructor(
  ) {
    this.warnings =  [new Warning(), new Warning(), new Warning()]
  }
}
