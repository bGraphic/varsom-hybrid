import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFire } from 'angularfire2';
import { Forecast } from "../models/Forecast";

@Injectable()
export class DataService {

  private _forecastsMap: BehaviorSubject<Forecast[]>[] = [];

  constructor (private af: AngularFire) {
    this.getForecasts('flood');
    this.getForecasts('landslide');
    this.getForecasts('avalanche');
  }

  getForecasts(forecastType: string, parentId?:string):Observable<Forecast[]> {
    return this._getForecasts(forecastType, parentId);
  }

  private _getForecasts(forecastType: string, parentId?:string) {

    let cacheKey = DataService._getCacheKey(forecastType, parentId);
    if(this._forecastsMap[cacheKey]) {
      return this._forecastsMap[cacheKey];
    } else {
      let forecasts = new BehaviorSubject<Forecast[]>([]);
      this._forecastsMap[cacheKey] = forecasts;

      if('flood' === forecastType || 'landslide' === forecastType) {
        forecasts.subscribe(items => {
          this._updateHighestForecasts(parentId);
        })
      }

      if('avalanche' === forecastType) {
        this._subscribeToFirebaseForecasts('avalanche');
      } else {
        this._subscribeToFirebaseForecasts('flood', parentId);
        this._subscribeToFirebaseForecasts('landslide', parentId)
      }
      return forecasts;
    }
  }

  private _updateHighestForecasts(parentId?:string) {

    let forecasts:Forecast[] = [];
    let floodForecasts = this._getForecasts('flood', parentId).getValue();
    let landslideForecasts = this._getForecasts('landslide', parentId).getValue();

    if(floodForecasts.length == 0) {
      forecasts = landslideForecasts;
    } else if(landslideForecasts.length == 0) {
      forecasts = floodForecasts;
    } else {
      forecasts = Forecast.createHighestForecasts(floodForecasts, landslideForecasts);
    }
    this._getForecasts('highest', parentId).next(forecasts);
  }

  private _subscribeToFirebaseForecasts(forecastType: string, parentId?:string) {

    if('highest' === forecastType) {
      return;
    } else {
      let firebaseForecasts:Observable<Forecast[]>;

      if('avalanche' === forecastType) {
        firebaseForecasts = this._getForecastForRegions(forecastType);
      } else if (parentId) {
        firebaseForecasts = this._getForecastForMunicipalities(forecastType, parentId);
      } else {
        firebaseForecasts = this._getForecastForCounties(forecastType);
      }

      firebaseForecasts.subscribe(items => {
        let forecasts = this._getForecasts(forecastType, parentId);
        forecasts.next(items);
      });
    }
  }

  private _getForecastForRegions(forecastType:string):Observable<Forecast[]> {

    if (forecastType === 'avalanche') {
      return this.af.database.list('/forecast/avalanche/regions/')
        .map((items) => {
          return items.map(item => {
            return Forecast.createFromFirebaseJSON(item, forecastType);
          })
        });
    } else {
      console.error('DataService: Regions only have avalanche forecasts', forecastType);
    }
  }

  private _getForecastForCounties(forecastType:string):Observable<Forecast[]> {

    if ('flood' === forecastType || 'landslide' === forecastType) {
      return this.af.database.list('/forecast/' + forecastType + '/counties/')
        .map((items) => {
          return items.map(item => {
            return Forecast.createFromFirebaseJSON(item, forecastType);
          })
        });
    } else {
      console.error('DataService: Counties only have flood/landslide forecasts', forecastType);
    }
  }

  private _getForecastForMunicipalities(forecastType:string, parentId: string):Observable<Forecast[]> {

    if ('flood' === forecastType || 'landslide' === forecastType) {
      return this.af.database.list('/forecast/' + forecastType + '/municipalities/id' + parentId)
        .map((items) => {
          return items.map(item => {
            return Forecast.createFromFirebaseJSON(item, forecastType);
          })
        });
    } else {
      console.error('DataService: Municipalities only have flood/landslide forecasts', forecastType);
    }
  }

  private static _getCacheKey(forecastType: string, parentId?:string) {

    let cacheKey = forecastType;
    if(parentId) {
      cacheKey += parentId;
    }
    return cacheKey;
  }
}
