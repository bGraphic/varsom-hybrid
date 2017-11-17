import "rxjs/add/operator/map";
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { ForecastType, Warning } from "../models/Warning";
import { RegionType, Region, RegionImportance } from "../models/Region";

@Injectable()
export class DataService {
  private API_REGION_PATHS: { [k in RegionType]?: string } = {
    AvalancheRegion:
      "http://api01.nve.no/hydrology/forecast/avalanche/test/api/Region/",
    County: "http://api01.nve.no/hydrology/forecast/flood/v1.0.4/api/Region/" // Lang key for Region endpoint is not needed
  };

  private API_WARNING_PATHS: { [k in ForecastType]?: string } = {
    Avalanche:
      "http://api01.nve.no/hydrology/forecast/avalanche/test/api/Warning/All/1/",
    Flood:
      "http://api01.nve.no/hydrology/forecast/flood/v1.0.4/api/Warning/All/1/2016-12-29",
    Landslide:
      "http://api01.nve.no/hydrology/forecast/landslide/v1.0.4/api/Warning/All/1/"
  };

  constructor(private _http: Http) {}

  private _fetch(
    path: string,
    transformFunction: (json: any) => Region | Warning
  ) {
    return this._http
      .get(path)
      .map(res => {
        return res.json() || [];
      })
      .map(res => {
        return res.map(json => {
          return transformFunction(json);
        });
      })
      .catch((res: any) => {
        return Observable.throw(new Error(res.json().error || "Server error"));
      });
  }

  fetchRegions(regionType: RegionType): Observable<Region[]> {
    return this._fetch(this.API_REGION_PATHS[regionType], transformToRegion);
  }

  fetchWarnings(warningType: ForecastType): Observable<Warning[]> {
    return this._fetch(this.API_WARNING_PATHS[warningType], transformToWarning);
  }
}

function transformToRegion(json: any): Region {
  const id = extractRegionId(json);
  const name = extractRegionName(json);
  const type = extractRegionType(id);
  const importance = extractImportance(json);
  const municipalies = extractMunicipalities(json);

  const region: Region = { id, name, type, importance };

  if (municipalies) {
    region.children = municipalies;
  }

  return region;
}

function transformToWarning(json: any): Warning {
  const regionId = extractWarningRegionId(json);
  const rating = extractWarningRating(json);
  const date = extractDate(json);
  return { regionId, rating, date, meta: json };
}

function extractMunicipalities(json: any): Region[] {
  if (json.hasOwnProperty("MunicipalityList")) {
    return json.MunicipalityList.map(json => transformToRegion(json));
  }
}

function extractRegionName(json): string {
  return json.Name;
}

function extractRegionId(json): string {
  if (json.hasOwnProperty("Id")) {
    return String(json.Id);
  }
}

function extractWarningRegionId(json): string {
  if (json.hasOwnProperty("RegionId")) {
    return String(json.RegionId);
  } else if (json.hasOwnProperty("MunicipalityList")) {
    return String(json.MunicipalityList[0].Id);
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

function extractImportance(json): RegionImportance {
  if (json.hasOwnProperty("TypeId")) {
    return json.TypeId;
  } else {
    return RegionImportance.A;
  }
}

function extractWarningRating(json): number {
  if (json.hasOwnProperty("DangerLevel")) {
    return parseInt(json.DangerLevel);
  } else if (json.hasOwnProperty("ActivityLevel")) {
    return parseInt(json.ActivityLevel);
  }
}

function extractDate(json): Date {
  if (json.hasOwnProperty("ValidFrom")) {
    return new Date(json.ValidFrom);
  }
}
