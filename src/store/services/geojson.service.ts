import "rxjs/add/operator/map";
import { Injectable } from "@angular/core";
import { SectionType } from "../models/Section";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { RegionImportance } from "../models/Region";

@Injectable()
export class GeojsonService {
  private API_GEOJSON_PATHS: { [k in SectionType]?: string } = {
    // Must be relative otherwise it will not work on Android
    Avalanche: "assets/geojson/regions.geojson",
    FloodLandslide: "assets/geojson/counties.geojson"
  };

  constructor(private _http: Http) {}

  private _fetch(path: string) {
    return this._http
      .get(path)
      .map(res => {
        const body = res.json();
        return body.features || [];
      })
      .map(features => {
        return features.map(feature => {
          feature.properties = {
            regionId: featureToRegionId(feature),
            regionImportance: featureToRegionImportance(feature)
          };
          return feature;
        });
      })
      .catch((res: any) => {
        return Observable.throw(new Error(res.json().error || "Geojson error"));
      });
  }

  fetchGeojson(sectionType: SectionType): Observable<any[]> {
    return this._fetch(this.API_GEOJSON_PATHS[sectionType]);
  }
}

const featureToRegionId = (feature: any): string => {
  let id: number;

  if (feature.hasOwnProperty("properties")) {
    if (feature.properties.hasOwnProperty("fylkesnr")) {
      id = Number(feature.properties.fylkesnr);
    } else if (feature.properties.hasOwnProperty("omraadeid")) {
      id = Number(feature.properties.omraadeid);
    }
  }

  if (id < 10) {
    return "0" + id;
  } else {
    return "" + id;
  }
};

const featureToRegionImportance = (feature): RegionImportance => {
  if (feature.hasOwnProperty("properties")) {
    if (feature.properties.hasOwnProperty("regiontype")) {
      return feature.properties.regiontype === "B"
        ? RegionImportance.B
        : RegionImportance.A;
    }
  }
};
