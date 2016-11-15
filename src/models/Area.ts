import {FirebaseObjectObservable} from "angularfire2";
import {Forecast} from "./Forecast";
export class Area {

  private forecasts: FirebaseObjectObservable<Forecast>[] = [];

  constructor(private areaType: string, private key: string, private name: string, private parentKey?: string) {

  }

  getName(): string {
    return this.name;
  }

  getKey(): string {
    return this.key;
  }

  getParentKey(): string {
    return this.parentKey;
  }

  getAreaType(): string {
    return this.areaType;
  }

  setForecast(forecast: FirebaseObjectObservable<Forecast>, forecastType: string) {
    this.forecasts[forecastType] = forecast;
  }

  getForecast(forecastType): FirebaseObjectObservable<Forecast> {
    return this.forecasts[forecastType];
  }
}
