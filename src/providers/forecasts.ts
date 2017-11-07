import { Injectable } from "@angular/core";
import { Forecast } from "../models/Forecast";
import { DataService } from "../providers/data";
import { AreaUtils } from "../utils/area-utils";
import { Observable } from "rxjs";

@Injectable()
export class ForecastService {
  constructor(private _data: DataService) {}

  getForecasts(
    forecastType: string,
    parentId?: string
  ): Observable<Forecast[]> {
    return this._getForecasts(forecastType, parentId);
  }

  getForecastForArea(
    forecastType: string,
    areaId: string
  ): Observable<Forecast> {
    return this._getForecastForArea(forecastType, areaId);
  }

  private _getForecastForArea(
    forecastType: string,
    areaId: string
  ): Observable<Forecast> {
    return this._getForecasts(forecastType, AreaUtils.getParentId(areaId))
      .filter(forecasts => {
        return Forecast.findForecastWithAreaId(forecasts, areaId)
          ? true
          : false;
      })
      .map(forecasts => {
        return Forecast.findForecastWithAreaId(forecasts, areaId);
      });
  }

  private _getForecasts(
    forecastType: string,
    parentId?: string
  ): Observable<Forecast[]> {
    let forecasts$: Observable<any>;
    if ("avalanche" === forecastType) {
      forecasts$ = this._data.getForecastForRegions(forecastType);
    } else if (parentId) {
      forecasts$ = this._data.getForecastForMunicipalities(
        forecastType,
        parentId
      );
    } else {
      forecasts$ = this._data.getForecastForCounties(forecastType);
    }

    return forecasts$.map(items => {
      return items.map(item => {
        return Forecast.createFromFirebaseJSON(item, forecastType);
      });
    });
  }
}
