import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Area } from "../models/Area";
import { Forecast } from "../models/Forecast";

@Injectable()
export class DataService {

  constructor (private af: AngularFire) {
    this.getCounties();
    this.getRegions();
  }

  private createArea(item: any, areaType: string, parentKey?: string): Area {
    let area = new Area(areaType, item.$key, item.Name, parentKey);
    if('region' == areaType) {
      area.setForecast(this.getForecast(area, 'avalanche'), 'avalanche');
    } else {
      area.setForecast(this.getForecast(area, 'flood'), 'flood');
      area.setForecast(this.getForecast(area, 'landslide'), 'landslide');
    }
    return area;
  }

  private createForecast(item: any, forecastType: string): Forecast {
    return new Forecast(forecastType, item.day0, item.day1, item.day2);
  }

  getForecast(area: Area, forecastType: string):FirebaseObjectObservable<Forecast> {
    switch (area.getAreaType()) {
      case 'county':
        return this.af.database.object('/forecast/' + forecastType + '/counties/' + area.getKey() + '/Forecast')
          .map((item) => {
            return this.createForecast(item, forecastType);
          }) as FirebaseObjectObservable<Forecast>;
      case 'municipality':
        return this.af.database.object('/forecast/' + forecastType + '/municipalities/' + area.getParentKey() + '/' + area.getKey() + '/Forecast')
          .map((item) => {
            return this.createForecast(item, forecastType);
          }) as FirebaseObjectObservable<Forecast>;
      case 'region':
        return this.af.database.object('/forecast/avalanche/regions/' + area.getKey() + '/Forecast')
          .map((item) => {
            return this.createForecast(item, forecastType);
          }) as FirebaseObjectObservable<Forecast>;
      default:
        console.log("Data Service: No valid area type provided.");
    }
  }

  getRegions():FirebaseListObservable<Area[]> {
    return this.af.database.list('/areas/regions')
      .map((items) => {
        return items.map(item => {
          let area = this.createArea(item, "region");
          return area
        })
      }) as FirebaseListObservable<Area[]>;
  }

  getCounties():FirebaseListObservable<Area[]> {
    return this.af.database.list('/areas/counties')
      .map((items) => {
        return items.map(item => {
          let area = this.createArea(item, "county");
          return area;
        })
      }) as FirebaseListObservable<Area[]>;
  }

  getMunicipalities(key: string):FirebaseListObservable<Area[]> {
    return this.af.database.list('/areas/municipalities/' + key)
      .map((items) => {
        return items.map(item => {
          let area = this.createArea(item, "municipality", key);
          return area;
        })
      }) as FirebaseListObservable<Area[]>;
  }
}
