import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Area } from "../models/Area";

@Injectable()
export class DataService {
  private regions: FirebaseListObservable<Area[]>;
  private counties: FirebaseListObservable<Area[]>;
  private municipalities: FirebaseListObservable<Area[]>[];

  constructor (private af: AngularFire) {
    this.getCounties();
    this.getRegions();
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
    if(!this.regions) {
      this.regions = this.af.database.list('/areas/regions')
        .map((items) => {
          console.log("regions");
          return items.map(item => {
            let area = this.createArea(item, "region");
            return area
          })
        }) as FirebaseListObservable<Area[]>;
    }

    return this.regions;
  }

  getCounties():FirebaseListObservable<Area[]> {
    if(!this.counties) {
      this.counties = this.af.database.list('/areas/counties')
        .map((items) => {
          console.log("counties");
          return items.map(item => {
            let area = this.createArea(item, "county");
            return area
          })
        }) as FirebaseListObservable<Area[]>;
    }
    return this.counties;
  }

  getMunicipalities(key: string):FirebaseListObservable<Area[]> {
    if(!this.municipalities[key]) {
      this.municipalities[key] = this.af.database.list('/areas/municipalities/' + key)
        .map((items) => {
          console.log("municipality");
          return items.map(item => {
            let area = this.createArea(item, "municipality", key);
            return area
          })
        }) as FirebaseListObservable<Area[]>;
    }
    return this.municipalities[key];
  }
}
