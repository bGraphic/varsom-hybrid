import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFire } from 'angularfire2';
import { Area } from "../models/Area";
import { Forecast } from "../models/Forecast";

@Injectable()
export class DataService {

  private _forecastsMap: BehaviorSubject<Forecast[]>[] = [];

  constructor (private af: AngularFire) {
    this.getCounties();
    this.getRegions();
  }

  private createArea(item: any, areaType:string):Area {
    let area = Area.createFromFirebaseJson(item, areaType);
    if('region' != areaType) {
      this.getForecast(area, 'flood')
        .subscribe(
          forecast => {
            area.setForecast('flood', forecast);
          }
        );
      this.getForecast(area, 'landslide')
        .subscribe(
          forecast => {
            area.setForecast('landslide', forecast);
          }
        );
    } else {
      this.getForecast(area, 'avalanche')
        .subscribe(
          forecast => {
            area.setForecast('avalanche', forecast);
          }
        );
    }
    return area;
  }

  getForecast(area: Area, forecastType: string):Observable<Forecast> {
    switch (area.areaType) {
      case 'county':
        return this.af.database.object('/forecast/' + forecastType + '/counties/' + area.key + '/Forecast')
          .map((item) => {
            return Forecast.createFromFirebaseJSON(item, forecastType);
          });
      case 'municipality':
        console.log(area, area.parentKey)
        return this.af.database.object('/forecast/' + forecastType + '/municipalities/' + area.parentKey + '/' + area.key + '/Forecast')
          .map((item) => {
            return Forecast.createFromFirebaseJSON(item, forecastType);
          });
      case 'region':
        return this.af.database.object('/forecast/avalanche/regions/' + area.key + '/Forecast')
          .map((item) => {
            return Forecast.createFromFirebaseJSON(item, forecastType);
          });
      default:
        console.log("Data Service: No valid area type provided.");
    }
  }

  getRegions():Observable<Area[]> {
    return this.af.database.list('/areas/regions')
      .map((items) => {
        return items.map(item => {
          return this.createArea(item, "region");
        })
      });
  }

  getCounties():Observable<Area[]> {
    return this.af.database.list('/areas/counties')
      .map((items) => {
        return items.map(item => {
          return this.createArea(item, "county");
        })
      });
  }

  getMunicipalitiesForCountyWithKey(key: string):Observable<Area[]> {
    return this.af.database.list('/areas/municipalities/' + key)
      .map((items) => {
        return items.map(item => {
          return this.createArea(item, "municipality");
        })
      });
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

  private _getForecasts(forecastType: string, parentId?:string) {

    let cacheKey = DataService._getCacheKey(forecastType, parentId);
    if(this._forecastsMap[cacheKey]) {
      return this._forecastsMap[cacheKey];
    } else {
      let forecasts = new BehaviorSubject([]);
      this._forecastsMap[cacheKey] = forecasts;

      if('flood' === forecastType || 'landslide' === forecastType) {
        forecasts.subscribe(items => {
          this._updateHighestForecasts(parentId);
        })
      }

      if('highest' !== forecastType) {
        this._subscribeToFirebaseForecasts(forecastType, parentId);
      }
      return forecasts;
    }
  }

  getForecasts(forecastType: string, parentId:string):Observable<Forecast[]> {
    return this._getForecasts(forecastType, parentId);
  }
}
