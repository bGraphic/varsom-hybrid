import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SettingsService {

  selectedForecastTypeObs:BehaviorSubject<string> = new BehaviorSubject('flood');

  constructor () {}
}
