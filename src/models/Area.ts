import { Observable } from 'rxjs/Observable';
import {Forecast} from "./Forecast";
export class Area {

  private forecasts: Observable<Forecast>[] = [];

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

  setForecast(forecast: Observable<Forecast>, forecastType: string) {
    this.forecasts[forecastType] = forecast;
  }

  getForecast(forecastType: string): Observable<Forecast> {
    return this.forecasts[forecastType];
  }
}
