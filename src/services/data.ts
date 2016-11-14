import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Area } from "../models/Area";

@Injectable()
export class DataService {
  private regions: FirebaseListObservable<any[]>;
  private counties: FirebaseListObservable<Area[]>;

  constructor (private af: AngularFire) {

    this.regions = this.af.database.list('/areas/regions')
      .map((items) => {
        console.log("regions");
        return items.map(item => {
          let area = this.createArea(item, "region");
          return area
        })
      }) as FirebaseListObservable<Area[]>;

    this.counties = this.af.database.list('/areas/counties')
      .map((items) => {
        console.log("counties");
        return items.map(item => {
          let area = this.createArea(item, "county");
          return area
        })
      }) as FirebaseListObservable<Area[]>;
  }

  private createArea(item: any, type: string, parentKey: string = null): Area {
    let area = new Area(item);
    let floodForecast;
    if('county' == type) {
      floodForecast = this.af.database.object('/forecast/flood/counties/' + item.$key + '/Forecast');
    } else {
      floodForecast = this.af.database.object('/forecast/flood/municipalities/' + parentKey + "/" + item.$key + '/Forecast');
    }
    area.setForecast('flood', floodForecast);
    return area;
  }

  getRegions():FirebaseListObservable<Area[]> {
    return this.regions;
  }

  getCounties():FirebaseListObservable<Area[]> {
    return this.counties;
  }

  getMunicipalities(key: string):FirebaseListObservable<Area[]> {
    console.log("Get municipalities");
    return this.af.database.list('/areas/municipalities/' + key)
      .map((items) => {
        console.log("municipality");
        return items.map(item => {
          let area = this.createArea(item, "municipality", key);
          return area
        })
      }) as FirebaseListObservable<Area[]>;
  }
}
