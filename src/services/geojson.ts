import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import GeoJsonObject = GeoJSON.GeoJsonObject;

@Injectable()
export class GeojsonService {

  constructor (private http: Http) {}

  getAreas(type:string): Observable<GeoJsonObject[]> {
    return this.http.get('/assets/geojson/' + type + '.geojson')
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.features || [ ];
  }

  private handleError (error: Response | any) {
    return [];
  }
}
