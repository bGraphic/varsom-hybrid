import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Geolocation } from 'ionic-native';

@Injectable()
export class SettingsService {

  private _currentForecastType = new BehaviorSubject<string>('highest');
  private _currentPosition = new BehaviorSubject({ latLng: L.latLng(64.871, 16.949), zoom: 4 });

  constructor () {
    Geolocation.getCurrentPosition().then((resp) => {
      this._currentPosition.next({ latLng: L.latLng(resp.coords.latitude, resp.coords.longitude), zoom: 6 });
      console.log('Settings: Updating user location', resp);
    }, (error) => {
      console.log('Settings: Error getting location', error);
    });
  }

  get currentForecastTypeObs():Observable<string> {
    return this._currentForecastType.asObservable();
  }

  set currentForecastType(forecastType: string) {
    this._currentForecastType.next(forecastType);
  }

  get currentPositionObs():Observable<{ latLng: L.LatLng, zoom: number }> {
    return this._currentPosition.asObservable();
  }
}
