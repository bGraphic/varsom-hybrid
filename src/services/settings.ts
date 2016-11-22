import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Geolocation } from 'ionic-native';

@Injectable()
export class SettingsService {

  selectedForecastTypeObs:BehaviorSubject<string> = new BehaviorSubject('highest');
  currentPosition = new BehaviorSubject(null);

  constructor () {
    Geolocation.getCurrentPosition().then((resp) => {
      this.currentPosition.next(L.latLng(resp.coords.latitude, resp.coords.longitude));
      console.log('Settings: Updating user location', resp);
    }, (error) => {
      console.log('Settings: Error getting location', error);
    });
  }
}
