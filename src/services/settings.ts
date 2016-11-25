import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Geolocation } from 'ionic-native';

@Injectable()
export class SettingsService {

  selectedForecastTypeObs = new BehaviorSubject('highest');
  currentPosition = new BehaviorSubject({ latLng: L.latLng(64.871, 16.949), zoom: 4 });

  constructor () {
    Geolocation.getCurrentPosition().then((resp) => {
      this.currentPosition.next({ latLng: L.latLng(resp.coords.latitude, resp.coords.longitude), zoom: 6 });
      console.log('Settings: Updating user location', resp);
    }, (error) => {
      console.log('Settings: Error getting location', error);
    });
  }
}
