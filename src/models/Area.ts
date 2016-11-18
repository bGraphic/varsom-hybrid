import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Forecast } from "./Forecast";
import { Warning } from "./Warning";
export class Area {

  private _key: string;
  private _name: string;
  private _parentKey: string;
  private _areaType: string;
  private _forecasts: BehaviorSubject<Forecast>[] = [];

  private constructor() {

  }

  private _getForecast(forecastType:string): BehaviorSubject<Forecast> {
    if(this._forecasts[forecastType]) {
      return this._forecasts[forecastType];
    } else {
      this._forecasts[forecastType] = new BehaviorSubject(Forecast.createEmptyForecast());
      if('region' !== this.areaType && 'highest' !== forecastType) {
        this._forecasts[forecastType].subscribe(
          forecast => {
            this._updateHighest();
          }
        );
      }
      return this._forecasts[forecastType]
    }
  }

  private _updateHighest() {
    let floodForecast = this._getForecast('flood').getValue();
    let landslideForecast = this._getForecast('landslide').getValue();

    let warnings = [];

    for (let i of [0, 1, 2]) {
      if (floodForecast.getDay(i).rating > landslideForecast.getDay(i).rating) {
        warnings[i] = floodForecast.getDay(i);
      } else {
        warnings[i] = landslideForecast.getDay(i);
      }
    }
    this._getForecast('highest').next(Forecast.createWithWarnings('highest', warnings));
  }

  get name(): string {
    return this._name;
  }

  get key(): string {
    return this._key;
  }

  get parentKey(): string {
    return this._parentKey;
  }

  get areaType():string {
    return this._areaType;
  }

  getForecast(forecastType: string): Observable<Forecast> {
    return this._getForecast(forecastType) as Observable<Forecast>;
  }

  getForecastValue(forecastType: string): Forecast {
    return this._getForecast(forecastType).getValue();
  }

  setForecast(forecastType: string, forecast: Forecast) {
    this._getForecast(forecastType).next(forecast);
  }

  static areaKeyFromGeoJsonFeature(geoJsonFeature) {
    let id: number;

    if(geoJsonFeature.hasOwnProperty('properties')) {
      if(geoJsonFeature.properties.hasOwnProperty('fylkesnr')) {
        id = Number(geoJsonFeature.properties.fylkesnr);
      } else if (geoJsonFeature.properties.hasOwnProperty('omraadeid')){
        id = Number(geoJsonFeature.properties.omraadeid);
      }
    }

    if(id < 10) {
      return "id0" + id;
    } else {
      return "id" + id;
    }

  }

  static findAreaWithAreaKey(areas:Area[], areaKey: string): Area {
    for (let area of areas){
      if( area.key == areaKey) {
        return area;
      }
    }
  }

  static createFromFirebaseJson(item: any, areaType:string):Area {
    let area = new Area();
    area._name = item.Name;
    area._areaType = areaType;
    area._key = item.$key;
    if(area._key.length > 4) {
      area._parentKey = area._key.substr(0, 4);
    }
    return area;
  }
}
