import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs';

@Injectable()
export class DataService {

  constructor(private _af: AngularFire) {

  }

  getForecastForRegions(forecastType:string):Observable<any[]> {

    if ('avalanche' === forecastType) {
      return this._af.database.list('/forecast/avalanche/regions/');
    } else {
      console.error('DataService: Regions can only have avalanche forecasts, not', forecastType);
    }
  }

  getForecastForCounties(forecastType:string):Observable<any[]> {

    if ('flood' === forecastType || 'landslide' === forecastType) {
      return this._af.database.list('/forecast/' + forecastType + '/counties/');
    } else {
      console.error('DataService: Counties can only have flood/landslide forecasts, not', forecastType);
    }
  }

  getForecastForMunicipalities(forecastType:string, parentId: string):Observable<any[]> {

    if ('flood' === forecastType || 'landslide' === forecastType) {
      return this._af.database.list('/forecast/' + forecastType + '/municipalities/id' + parentId);
    } else {
      console.error('DataService: Municipalities can only have flood/landslide forecasts, not', forecastType);
    }
  }

  addPushTokenForArea(pushToken: string, areaId:string) {
    if(!pushToken) {
      return;
    }

    let item = this._af.database.object('/subscriptions/id' + areaId + '/' + pushToken);
    item.set(true)
      .catch(error => {
        console.log('DataService: Error saving push token', pushToken, areaId, error);
      });
  }

  removePushTokenForArea(pushToken: string, areaId:string) {
    if(!pushToken) {
      return;
    }

    let item = this._af.database.object('/subscriptions/id' + areaId + '/' + pushToken);
    item.remove()
      .catch(error => {
        console.log('DataService: Error saving push token', pushToken, areaId, error);
      });
  }

}
