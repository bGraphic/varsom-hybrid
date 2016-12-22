import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFire } from 'angularfire2';
import { Forecast } from "../models/Forecast";

@Injectable()
export class DataService {

  private static readonly OSLO_COUNTY_ID = '03';
  private static readonly OSLO_MUNICIPALITY_ID = '0301';
  private static readonly MUNICIPALITIES_START_OF_NUMBER_SERIES = 100;
  private static readonly MUNICIPALITIES_END_OF_NUMBER_SERIES = 3000;

  private _forecastsMap: BehaviorSubject<Forecast[]>[] = [];

  constructor (private af: AngularFire) {
    this.getForecasts('flood');
    this.getForecasts('landslide');
    this.getForecasts('avalanche');
  }

  getForecasts(forecastType: string, parentId?:string):Observable<Forecast[]> {
    return this._getForecasts(forecastType, parentId).asObservable();
  }

  getForecastForArea(forecastType: string, areaId:string):Observable<Forecast> {
    return this._getForecastForArea(forecastType, areaId);
  }

  private _getForecastForArea(forecastType: string, areaId:string):Observable<Forecast> {
    let forecast = new BehaviorSubject<Forecast>(null);
    this._getForecasts(forecastType, DataService._getParentId(areaId))
      .subscribe(items => {
        forecast.next(Forecast.findForecastWithAreaId(items, areaId));
      });

    return forecast.asObservable();
  }

  private _getForecasts(forecastType: string, parentId?:string):BehaviorSubject<Forecast[]> {

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

    if ('avalanche' === forecastType) {
      return this.af.database.list('/forecast/avalanche/regions/')
        .map((items) => {
          return items.map(item => {
            return Forecast.createFromFirebaseJSON(item, forecastType);
          })
        });
    } else {
      console.error('DataService: Regions can only have avalanche forecasts', forecastType);
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
      console.error('DataService: Counties can only have flood/landslide forecasts', forecastType);
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
      console.error('DataService: Municipalities can only have flood/landslide forecasts', forecastType);
    }
  }

  private static _getCacheKey(forecastType: string, parentId?:string):string {

    let cacheKey = forecastType;
    if(parentId) {
      cacheKey += parentId;
    }
    return cacheKey;
  }

  static isOslo(areaId:string):boolean {
    return DataService.OSLO_COUNTY_ID === areaId || DataService.OSLO_MUNICIPALITY_ID === areaId;
  }

  private static _getParentId(areaId):string {
    if(DataService.isMunicipality(areaId)) {
      return areaId.substr(0, 2);
    }
  }

  static isCounty(areaId:string) {
    let areaIdAsNumber = Number(areaId);
    return DataService.MUNICIPALITIES_START_OF_NUMBER_SERIES > areaIdAsNumber;
  }

  static isRegion(areaId:string) {
    let areaIdAsNumber = Number(areaId);
    return DataService.MUNICIPALITIES_END_OF_NUMBER_SERIES <= areaIdAsNumber;
  }

  static isMunicipality(areaId:string) {
    return !DataService.isRegion(areaId) && !DataService.isCounty(areaId);
  }
}
