import "rxjs/add/operator/map";
import { Injectable } from "@angular/core";
import { Http, ResponseContentType } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { NVE_API, FIREBASE_PATHS } from "../../config/config";
import { Warning, WarningType } from "../models/Warning";
import { RegionType, Region, RegionImportance } from "../models/Region";
import { SectionType } from "../models/Section";
import { LatestAppVersion } from "../models/AppVersion";
import { AngularFireDatabase } from "angularfire2/database";
import * as moment from "moment";

@Injectable()
export class DataService {
  constructor(private _http: Http, private _db: AngularFireDatabase) {}

  private _object(db_url) {
    return this._db.object(db_url).catch(error => {
      return Observable.throw(error || "Firebase error");
    });
  }

  private _fetch(
    path: string,
    transformFunction: (json: any) => Region[] | Warning[]
  ) {
    return this._http
      .get(path, { responseType: ResponseContentType.Json })
      .retry(2)
      .map(res => {
        return res.json() || [];
      })
      .map(res => {
        return res.reduce((acc, json) => {
          return acc.concat(transformFunction(json));
        }, []);
      })
      .catch((error: any) => {
        return Observable.throw(error || "api.nve.no error");
      });
  }

  fetchRegions(sectionType: SectionType): Observable<Region[]> {
    return this._fetch(NVE_API.REGIONS_PATHS[sectionType], transformToRegion);
  }

  fetchWarnings(warningType: WarningType): Observable<Warning[]> {
    return this._fetch(NVE_API.WARNINGS_PATHS[warningType], transformToWarning);
  }

  fetchLatestAppVersion(): Observable<LatestAppVersion> {
    return this._object(FIREBASE_PATHS.AppVersion).map(object => {
      return {
        version: object.version_number,
        forced: object.hard
      };
    });
  }

  addPushTokenForRegion(pushToken: string, regionId: string) {
    if (!pushToken) {
      return;
    }

    let item = this._db.object(
      "/subscriptions/id" + regionId + "/" + pushToken
    );
    item
      .set(moment().format())
      .then(() => console.log("Added push token to ", regionId));
  }

  removePushTokenForArea(pushToken: string, regionId: string) {
    if (!pushToken) {
      return;
    }

    let item = this._db.object(
      "/subscriptions/id" + regionId + "/" + pushToken
    );
    item.remove().then(() => console.log("Removed push token from ", regionId));
  }
}

function transformToRegion(json: any): Region[] {
  const id = extractRegionId(json);
  const name = extractRegionName(json);
  const type = extractRegionType(id);
  const importance = extractImportance(json);
  const municipalities = type === "County" ? extractMunicipalities(json) : [];

  const region: Region = { id, name, type, importance };
  return [region, ...municipalities];
}

function transformToWarning(json: any): Warning[] {
  const regionId = extractWarningRegionId(json);
  const rating = extractWarningRating(json);
  const date = extractDate(json);
  return [{ regionId, rating, date, meta: json }];
}

function extractMunicipalities(json: any): Region[] {
  if (json.hasOwnProperty("MunicipalityList") && json.MunicipalityList) {
    return json.MunicipalityList.reduce(
      (acc, json) => acc.concat(transformToRegion(json)),
      []
    );
  } else {
    return [];
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
  if (id < 100) {
    return "County";
  } else if (id >= 3000 && id < 5000) {
    return "AvalancheRegion";
  } else {
    return "Municipality";
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
