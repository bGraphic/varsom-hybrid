import { Injectable } from '@angular/core';
import { Platform } from "ionic-angular";
import { AngularFire } from 'angularfire2';
import {Observable, Subscription} from 'rxjs';
import * as moment from 'moment';

@Injectable()
export class DataService {

  private _floodCache$:Observable<any[]>[] = [];
  private _landslideCache$:Observable<any[]>[] = [];
  private _avalancheCache$:Observable<any[]>[] = [];
  private _subscriptions:Subscription[] = [];

  constructor(
    private _af: AngularFire,
    private _platform: Platform

  ) {

    this._platform.pause.subscribe(e => {
      this._clearCache();
    });
  }

  getForecastForRegions(forecastType:string):Observable<any[]> {

    if ('avalanche' === forecastType) {
      return this._getForecasts('/forecast/avalanche/regions/', this._avalancheCache$, 0);
    } else {
      console.error('DataService: Regions can only have avalanche forecasts, not', forecastType);
    }
  }

  getForecastForCounties(forecastType:string):Observable<any[]> {

    let db_url = '/forecast/' + forecastType + '/counties/';

    if ('flood' === forecastType ) {
      return this._getForecasts(db_url, this._floodCache$, 0);
    } else if('landslide' === forecastType) {
      return this._getForecasts(db_url, this._landslideCache$, 0);
    } else {
      console.error('DataService: Counties can only have flood/landslide forecasts, not', forecastType);
    }
  }

  getForecastForMunicipalities(forecastType:string, parentId: string):Observable<any[]> {

    let db_url = '/forecast/' + forecastType + '/municipalities/id' + parentId;

    if ('flood' === forecastType ) {
      return this._getForecasts(db_url, this._floodCache$, Number(parentId));
    } else if('landslide' === forecastType) {
      return this._getForecasts(db_url, this._landslideCache$, Number(parentId));
    } else {
      console.error('DataService: Municipalities can only have flood/landslide forecasts, not', forecastType);
    }
  }

  getParseFavorites(pushToken:string):Observable<string[]> {
    console.log('DataService: Fetching parse favorites for token', pushToken);
    return this._getList('/parse_favorites/' + pushToken);
  }

  getAppVersion():Observable<{ versionNumber: string, hard: boolean }> {
    return this._getObject('/api/app_release')
      .map( appRelease => {
        return { versionNumber: appRelease.version_number, hard: appRelease.hard };
      });
  }

  addPushTokenForArea(pushToken: string, areaId:string) {
    if(!pushToken) {
      return;
    }
    console.log('DataService: Adding push token to area', pushToken, areaId);
    let item = this._af.database.object('/subscriptions/id' + areaId + '/' + pushToken);
    item.set(moment().format())
      .catch(error => {
        console.log('DataService: Error saving push token', pushToken, areaId, error);
      });
  }

  removePushTokenForArea(pushToken: string, areaId:string) {
    if(!pushToken) {
      return;
    }

    console.log('DataService: Removing push token from area', pushToken, areaId);
    let item = this._af.database.object('/subscriptions/id' + areaId + '/' + pushToken);
    item.remove()
      .catch(error => {
        console.log('DataService: Error saving push token', pushToken, areaId, error);
      });
  }

  private _clearCache() {
    console.log('DataService: Clear cache');

    for(let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }

    this._subscriptions = [];
    this._floodCache$ = [];
    this._landslideCache$ = [];
    this._avalancheCache$ = [];
  }

  private _getForecasts(db_url:string, caches$:Observable<any[]>[], cacheIndex:number) {
    if(!caches$[cacheIndex]) {
      console.log("DataService: Add to cache", cacheIndex);
      caches$[cacheIndex] = this._getList(db_url);
      this._subscriptions.push(caches$[cacheIndex].subscribe());
    }

    return caches$[cacheIndex]
  }

  private _getList(db_url: string):Observable<any[]> {
    return this._af.database.list(db_url).catch(error => {
      console.log("DataService: Error getting", db_url, error);
      return Observable.of([]);
    });
  }

  private _getObject(db_url: string):Observable<any> {
    return this._af.database.list(db_url).catch(error => {
      console.log("DataService: Error getting", db_url, error);
      return Observable.of(null);
    });
  }

}
