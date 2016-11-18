import {Warning} from "./Warning";
export class Forecast {

  private _item: any;
  private _forecastType: string;

  private constructor() { }

  getDay(index: number): Warning {
    switch (index) {
      case 0:
        return this._item.day0;
      case 1:
        return this._item.day1;
      case 2:
        return this._item.day2;
      default:
        console.log("Warning: getDay - day index out of bounds ", index);
        return new Warning(0, {});

    }
  }

  get mapWarning(): Warning {
    return this.getDay(0);
  }

  get forecastType(): string {
    return this._forecastType;
  }

  static createFromFirebaseJSON(item: any, forecastType:string):Forecast {
    let forecast = new Forecast();
    forecast._item = item;
    forecast._forecastType = forecastType;
    return forecast;
  }
}
