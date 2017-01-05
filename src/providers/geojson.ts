import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';

@Injectable()
export class GeoJsonService {

  private _counties$: Observable<GeoJSON.GeoJsonObject>;
  private _regions$: Observable<GeoJSON.GeoJsonObject>;

  constructor (private http: Http) {
    this._counties$ = this._createAreaObservable('counties');
    this._regions$ = this._createAreaObservable('regions');
  }

  get counties$(): Observable<GeoJSON.GeoJsonObject> {
    return this._counties$;
  }

  get regions$(): Observable<GeoJSON.GeoJsonObject> {
    return this._regions$;
  }

  private _createAreaObservable(type:string): Observable<GeoJSON.GeoJsonObject> {
    return this.http.get('assets/geojson/' + type + '.geojson')
      .map(this._extractData)
      .catch(this._handleError)
      .publishReplay(1)
      .refCount();
  }

  private _extractData(res: Response) {
    let body = res.json();
    return body.features;
  }

  private _handleError (error: Response | any) {
    return [];
  }
}
