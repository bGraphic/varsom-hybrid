import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFire } from 'angularfire2';
import { Forecast } from "../models/Forecast";

@Injectable()
export class DataService {

  private static readonly OSLO_COUNTY_ID = '03';
  private static readonly OSLO_MUNICIPALITY_ID = '0301';
  private static readonly MUNICIPALITIES_START_OF_NUMBER_SERIES = 100;
  private static readonly MUNICIPALITIES_END_OF_NUMBER_SERIES = 3000;

  constructor (private af: AngularFire) {

  }

  getForecasts(forecastType: string, parentId?:string):Observable<Forecast[]> {
    return this._getForecasts(forecastType, parentId);
  }

  getForecastForArea(forecastType: string, areaId:string):Observable<Forecast> {
    return this._getForecastForArea(forecastType, areaId);
  }

  private _getForecastForArea(forecastType: string, areaId:string):Observable<Forecast> {
    return this._getForecasts(forecastType, DataService._getParentId(areaId))
      .filter(forecasts => {
        return Forecast.findForecastWithAreaId(forecasts, areaId) ? true : false;
      })
      .map(forecasts => {
        return Forecast.findForecastWithAreaId(forecasts, areaId);
      });

  }

  private _getForecasts(forecastType: string, parentId?:string):Observable<Forecast[]> {
    if('avalanche' === forecastType) {
      return this._getForecastForRegions(forecastType);
    } else if (parentId) {
      return this._getForecastForMunicipalities(forecastType, parentId);
    } else {
      return this._getForecastForCounties(forecastType);
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
      console.error('DataService: Regions can only have avalanche forecasts, not', forecastType);
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
      console.error('DataService: Counties can only have flood/landslide forecasts, not', forecastType);
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
      console.error('DataService: Municipalities can only have flood/landslide forecasts, not', forecastType);
    }
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
