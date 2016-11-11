import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Area } from "../models/Area";
import {Warning} from "../models/Warning";

@Injectable()
export class DataService {
  private regions: FirebaseListObservable<Area[]>;
  private counties: FirebaseListObservable<Area[]>;

  constructor (private af: AngularFire) {
    this.regions = this.af.database.list('/areas/regions');
    this.counties = this.af.database.list('/areas/counties');
  }

  getRegions():FirebaseListObservable<Area[]> {
    return this.regions;
  }

  getCounties():FirebaseListObservable<Area[]> {
    return this.counties;
  }
}
