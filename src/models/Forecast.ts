import {Warning} from "./Warning";
export class Forecast {

  private _forecastType: string;
  private _warnings: Warning[];

  private constructor() { }

  getDay(index: number): Warning {
    return this._warnings[index];
  }

  get mapWarning(): Warning {
    return this.getDay(0);
  }

  get forecastType(): string {
    return this._forecastType;
  }

  static createFromFirebaseJSON(item: any, forecastType:string):Forecast {

    if(!item.hasOwnProperty('day0') || !item.hasOwnProperty('day1') || !item.hasOwnProperty('day2') ) {
      console.log("Forecast: Item does not have warnings", item);
      return Forecast.createEmptyForecast();
    }

    let forecast = new Forecast();
    forecast._warnings = [
      Warning.createFromFirebaseItem(item.day0),
      Warning.createFromFirebaseItem(item.day1),
      Warning.createFromFirebaseItem(item.day2)
    ];
    forecast._forecastType = forecastType;
    return forecast;
  }

  static createWithWarnings(forecastType:string, warnings: Warning[]) {
    if(!warnings) {
      return this.createEmptyForecast();
    }

    let forecast = new Forecast();
    forecast._warnings = warnings;
    return forecast;
  }

  static createEmptyForecast() {
    let forecast = new Forecast();
    forecast._warnings = [
      Warning.createEmptyWarning(),
      Warning.createEmptyWarning(),
      Warning.createEmptyWarning()
    ];
    return forecast;
  }
}
