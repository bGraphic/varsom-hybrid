import {Warning} from "./Warning";

export class Forecast {

  private _forecastType: string;
  private _areaId: string;
  private _areaName: string;
  private _areaTypeId: number;
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

  isTypeA(): boolean {
    if(!this._areaTypeId) {
      return true;
    }
    return this._areaTypeId === 10;
  }

  isTypeB(): boolean {
    return this._areaTypeId === 20;
  }

  getDay(index: number): Warning {
    return this._warnings[index];
  }

  get mapWarning(): Warning {
    return this.getDay(0);
  }

  get warnings() {
    return this._warnings;
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
    forecast._areaId = item.Id.toString();
    forecast._areaTypeId = item.TypeId;
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

    if(!forecastA && !forecastB) {
      return Forecast.createEmptyForecast();
    }

    if(!forecastA && forecastB) {
      return forecastB;
    }

    if(forecastA && !forecastB) {
      return forecastA;
    }

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
    if(!forecastsA || !forecastsB) {
      return [];
    }

    if(0 === forecastsA.length || 0 === forecastsB.length) {
      return [];
    }

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

  static filterARegions(forecasts:Forecast[]) {
    return forecasts.filter(forecast => forecast.isTypeA());
  }

  static filterBRegions(forecasts:Forecast[]) {
    return forecasts.filter(forecast => forecast.isTypeB());
  }

  static getTimeframeFromForecasts(forecasts: Forecast[]):Date[] {
    // In production this should work as all forecasts are updated at the same time
    if(!forecasts || 0 === forecasts.length) {
      return [];
    } else {
      let forecast = forecasts[0];
      return [forecast.getDay(0).date, forecast.getDay(1).date, forecast.getDay(2).date];
    }
  }

  static sortByAreaName(forecasts: Forecast[]) {
    return forecasts.sort((a:Forecast, b:Forecast) => {
      let nameA = a.areaName.toUpperCase(); // ignore upper and lowercase
      let nameB = b.areaName.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
  }

  static sortByAreaId(forecasts: Forecast[], descending?:boolean) {
    return forecasts.sort((a:Forecast, b:Forecast) => {
      let areaIdA = a.areaId.toUpperCase(); // ignore upper and lowercase
      let areaIdB = b.areaId.toUpperCase(); // ignore upper and lowercase
      let decendingMultiplier = descending ? -1 : 1;
      if (areaIdA < areaIdB) {
        return -1 * decendingMultiplier;
      }
      if (areaIdA > areaIdB) {
        return 1 * decendingMultiplier;
      }

      // names must be equal
      return 0;
    });
  }
}
