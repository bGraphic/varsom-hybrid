import "rxjs/add/operator/map";
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import {
  ForecastType,
  RegionType,
  RegionSubType,
  Forecast
} from "../models/Forecast";

@Injectable()
export class WarningsService {
  private API_PATHS: { [k in ForecastType]?: string } = {
    Avalanche:
      "http://api01.nve.no/hydrology/forecast/avalanche/test/api/RegionSummary/Detail/1/"
  };

  constructor(private _http: Http) {}

  fetchForecasts(
    forecastType: ForecastType
  ): Observable<{ forecastType: ForecastType; forecasts: Forecast[] }> {
    return this._http
      .get(this.API_PATHS[forecastType])
      .map(res => {
        return res.json() || [];
      })
      .map(res => {
        return res.map(forecastJson => {
          return transformToForecast(forecastJson, forecastType);
        });
      })
      .map((res: Forecast[]) => {
        return {
          forecastType: forecastType,
          forecasts: res
        };
      });
  }
}

function transformToForecast(forecastJson, forecastType): Forecast {
  return {
    forecastType: forecastType,
    regionId: extractRegionId(forecastJson),
    regionName: extractRegionName(forecastJson),
    regionType: extractRegionType(extractRegionId(forecastJson)),
    regionSubType: extractRegionSubType(forecastJson),
    warnings: []
  };
}

function extractRegionName(forecastJson): string {
  return forecastJson.Name;
}

function extractRegionId(forecastJson): string {
  if (parseInt(forecastJson.Id, 10) < 10) {
    return "0" + parseInt(forecastJson.Id, 10);
  } else {
    return forecastJson.Id;
  }
}

function extractRegionType(regionId: string): RegionType {
  const id = parseInt(regionId);
  if (id >= 3000) {
    return "AvalancheRegion";
  } else if (id >= 100) {
    return "Municipality";
  } else {
    return "County";
  }
}

function extractRegionSubType(forecastJson): RegionSubType {
  if (forecastJson.hasOwnProperty("TypeId")) {
    return forecastJson.TypeId;
  }
}
