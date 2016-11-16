import {Warning} from "./Warning";
export class Forecast {

  constructor(private forecastType: string, private day0: Warning, private day1: Warning, private day2: Warning ) { }

  getDay(index: number): Warning {
    switch (index) {
      case 0:
        return this.day0;
      case 1:
        return this.day1;
      case 2:
        return this.day2;
      default:
        console.log("Warning: getDay - day index out of bounds ", index);
        return new Warning(0, {});

    }
  }

  getMapWarning(): Warning {
    return this.getDay(0);
  }

  getForecastType(): string {
    return this.forecastType;
  }
}
