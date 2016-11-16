import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Forecast } from "./Forecast";
import { Warning } from "./Warning";
export class Area {

  private forecasts: BehaviorSubject<Forecast>[] = [];

  private updateHighest() {
    let floodForecast = this.forecasts['flood'].getValue();
    let landslideForecast = this.forecasts['landslide'].getValue();

    let warnings = [];

    for (let i of [0, 1, 2]) {
      if (floodForecast.getDay(i).getLevel() > landslideForecast.getDay(i).getLevel()) {
        warnings[i] = floodForecast.getDay(i);
      } else {
        warnings[i] = landslideForecast.getDay(i);
      }
    }
    this.forecasts['highest'].next(new Forecast('highest', warnings[0], warnings[1], warnings[2]) );
  }

  constructor(private areaType: string, private key: string, private name: string, private parentKey?: string) {
    if('region' != areaType) {
      this.forecasts['highest'] =  new BehaviorSubject<Forecast>(new Forecast('highest', new Warning(null), new Warning(null), new Warning(null)));
      this.forecasts['landslide'] =  new BehaviorSubject<Forecast>(new Forecast('landslide', new Warning(null), new Warning(null), new Warning(null)));
      this.forecasts['flood'] =  new BehaviorSubject<Forecast>(new Forecast('flood', new Warning(null), new Warning(null), new Warning(null)));

      this.getForecast('flood').subscribe(forecast => { this.updateHighest() });
      this.getForecast('landslide').subscribe(forecast => { this.updateHighest() });

    } else {
      this.forecasts['avalanche'] =  new BehaviorSubject<Forecast>(new Forecast('avalanche', new Warning(null), new Warning(null), new Warning(null)));
    }
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
    if(forecast) {
      forecast.subscribe(forecast => {
        this.forecasts[forecastType].next(forecast);
      });
    }
  }

  getForecast(forecastType: string): Observable<Forecast> {
    return this.forecasts[forecastType].asObservable();
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

  static findAreaWithAreaKey(areas:Area[], areaKey: string) {
    for (let area of areas){
      if( area.getKey() == areaKey) {
        return area;
      }
    }
  }
}
