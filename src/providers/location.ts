import { Injectable } from '@angular/core';
import { Geolocation } from 'ionic-native';
import { Platform } from 'ionic-angular';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class LocationService {

  private _currentPosition$ = new BehaviorSubject({ latLng: L.latLng(64.871, 16.949), zoom: 4 });

  get currentPosition$(): Observable<{ latLng: L.LatLng, zoom: number }> {
    return this._currentPosition$.asObservable();
  }

  constructor(
    private _platform: Platform
  ) {

    this._platform.ready().then(() => {
      this._watchPosition();
    });

    this._platform.resume.subscribe(e => {
      this._watchPosition();
    });
  }

  private _watchPosition() {
    Geolocation.watchPosition()
      .filter((p: any) => {
        return p.code === undefined; //Filter Out Errors
      })
      .first()
      .map((p: any) => {
        return { latLng: L.latLng(p.coords.latitude, p.coords.longitude), zoom: 6 }
      })
      .subscribe((p: { latLng: L.LatLng, zoom: number }) => {
        this._currentPosition$.next(p);
      });
  }
}
