import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import * as locationActions from './../actions/location.actions';

import { Geolocation } from '@ionic-native/geolocation';

@Injectable()
export class LocationEffects {

  constructor(
    private _actions$: Actions,
    private _geolocation: Geolocation
  ) {

  }

  @Effect()
  loadAppVersion$: Observable<Action> = this._actions$
    .ofType(locationActions.FETCH_POSITION)
    .startWith(new locationActions.FetchPosition())
    .switchMapTo(this._geolocation.getCurrentPosition())
    .do(res => console.log(res))
    .map((res) => new locationActions.PositionSucess({
      latitude: res.coords.latitude,
      longitude: res.coords.longitude,
      timestamp: new Date(res.timestamp)
    }))
    .catch(error => of(new locationActions.PositionError(error)));
}