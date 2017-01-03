import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';

@Injectable()
export class GeoJsonService {

  constructor (private http: Http) {}

  getCounties(): Observable<GeoJSON.GeoJsonObject> {
    return this.getAreas('counties');
  }

  getRegions(): Observable<GeoJSON.GeoJsonObject> {
    return this.getAreas('regions');
  }

  private getAreas(type:string): Observable<GeoJSON.GeoJsonObject> {
    return this.http.get('assets/geojson/' + type + '.geojson')
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.features;
  }

  private handleError (error: Response | any) {
    return [];
  }
}
