import "rxjs/add/operator/map";
import { Injectable } from "@angular/core";
import { SectionType } from "../models/Section";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class GeojsonService {
  private API_GEOJSON_PATHS: { [k in SectionType]?: string } = {
    Avalanche: "/assets/geojson/regions.geojson",
    FloodLandslide: "/assets/geojson/counties.geojson"
  };

  constructor(private _http: Http) {}

  private _fetch(path: string) {
    return this._http
      .get(path)
      .map(res => {
        const body = res.json();
        return body.features;
      })
      .catch((res: any) => {
        return Observable.throw(new Error(res.json().error || "Geojson error"));
      });
  }

  fetchGeojson(sectionType: SectionType): Observable<GeoJSON.GeoJsonObject> {
    return this._fetch(this.API_GEOJSON_PATHS[sectionType]);
  }
}
