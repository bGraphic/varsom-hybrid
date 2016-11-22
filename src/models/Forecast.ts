import {Warning} from "./Warning";

export class Forecast {
  private static readonly OSLO_ID = '03';
  private _forecastType: string;
  private _areaId: string;
  private _areaName: string;
  private _warnings: Warning[];

  private constructor() { }

  get forecastType(): string {
    return this._forecastType;
  }

  get areaName(): string {
    return this._areaName;
  }

  get areaId(): string {
    return this._areaId;
  }

  getDay(index: number): Warning {
    return this._warnings[index];
  }

  get mapWarning(): Warning {
    return this.getDay(0);
  }

  static createFromFirebaseJSON(item: any, forecastType:string):Forecast {

    if(!item.hasOwnProperty('Forecast') || !item.Forecast.hasOwnProperty('day0') || !item.Forecast.hasOwnProperty('day1') || !item.Forecast.hasOwnProperty('day2') ) {
      console.log("Forecast: Item does not have warnings", item);
      return Forecast.createEmptyForecast();
    }

    if(!item.hasOwnProperty('Name') || !item.hasOwnProperty('Id')) {
      console.log("Forecast: Item does not have name and/or id", item);
      return Forecast.createEmptyForecast();
    }

    let forecast = new Forecast();
    forecast._forecastType = forecastType;
    forecast._areaName = item.Name;
    forecast._areaId = item.Id;
    forecast._warnings = [
      Warning.createFromFirebaseItem(item.Forecast.day0),
      Warning.createFromFirebaseItem(item.Forecast.day1),
      Warning.createFromFirebaseItem(item.Forecast.day2)
    ];

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

  static createHighestForecast(forecastA:Forecast, forecastB:Forecast):Forecast {

    let warnings:Warning[] = [];

    for (let i of [0, 1, 2]) {
      warnings[i] = Warning.getHighest(forecastA.getDay(i), forecastB.getDay(i));
    }

    let forecast = new Forecast();
    forecast._forecastType = 'highest';
    forecast._areaId = forecastA.areaId;
    forecast._areaName = forecastA.areaName;
    forecast._warnings = warnings;

    return forecast;
  }

  static createHighestForecasts(forecastsA, forecastsB):Forecast[] {
    let forecasts:Forecast[] = [];
    for(let forecastA of forecastsA) {
      let forecastB = Forecast.findForecastWithAreaId(forecastsB, forecastA.areaId);
      forecasts.push(Forecast.createHighestForecast(forecastA, forecastB));
    }
    return forecasts;
  }

  static findForecastWithAreaId(forecasts:Forecast[], areaId:string ) {
    for (let forecast of forecasts) {
      if(forecast.areaId == areaId) {
        return forecast;
      }
    }
  }

  static isOslo(forecast):boolean {
    return forecast.areaId == Forecast.OSLO_ID;
  }
}
