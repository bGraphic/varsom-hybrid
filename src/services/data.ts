import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFire } from 'angularfire2';
import { Area } from "../models/Area";
import { Forecast } from "../models/Forecast";
import { Warning } from "../models/Warning";

@Injectable()
export class DataService {

  constructor (private af: AngularFire) {
    this.getCounties();
    this.getRegions();
  }

  getForecast(area: Area, forecastType: string):Observable<Forecast> {
    switch (area.areaType) {
      case 'county':
        return this.af.database.object('/forecast/' + forecastType + '/counties/' + area.key + '/Forecast')
          .map((item) => {
            return Forecast.createFromFirebaseJSON(item, forecastType);
          });
      case 'municipality':
        return this.af.database.object('/forecast/' + forecastType + '/municipalities/' + area.parentKey + '/' + area.key + '/Forecast')
          .map((item) => {
            return Forecast.createFromFirebaseJSON(item, forecastType);
          });
      case 'region':
        return this.af.database.object('/forecast/avalanche/regions/' + area.key + '/Forecast')
          .map((item) => {
            return Forecast.createFromFirebaseJSON(item, forecastType);
          });
      default:
        console.log("Data Service: No valid area type provided.");
    }
  }

  getRegions():Observable<Area[]> {
    return this.af.database.list('/areas/regions')
      .map((items) => {
        return items.map(item => {
          return Area.createFromFirebaseJson(item, "region");
        })
      });
  }

  getCounties():Observable<Area[]> {
    return this.af.database.list('/areas/counties')
      .map((items) => {
        return items.map(item => {
          return Area.createFromFirebaseJson(item, "county");
        })
      });
  }

  getMunicipalitiesForCountyWithKey(key: string):Observable<Area[]> {
    return this.af.database.list('/areas/municipalities/' + key)
      .map((items) => {
        return items.map(item => {
          return Area.createFromFirebaseJson(item, "municipality", key);
        })
      });
  }
}
