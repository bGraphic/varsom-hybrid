import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
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
          let area = this.createArea(item);
          return area
        })
      }) as FirebaseListObservable<Area[]>;

    this.counties = this.af.database.list('/areas/counties')
      .map((items) => {
        console.log("counties");
        return items.map(item => {
          let area = this.createArea(item);
          return area
        })
      }) as FirebaseListObservable<Area[]>;
  }

  private createArea(item: any): Area {
    let area = new Area(item);
    let floodForecast = this.af.database.list('/forecast/flood/counties/' + item.$key + '/Forecast');
    area.setForecast('flood', floodForecast);
    return area;
  }

  getRegions():FirebaseListObservable<Area[]> {
    return this.regions;
  }

  getCounties():FirebaseListObservable<Area[]> {
    return this.counties;
  }
}
