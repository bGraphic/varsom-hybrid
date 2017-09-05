import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Geolocation } from '@ionic-native/geolocation';

import * as locationActions from './../actions/location.actions';

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
    .map((res) => {
      return {
        latitude: res.coords.latitude,
        longitude: res.coords.longitude,
        timestamp: new Date(res.timestamp)
      }
    })
    .map((res) => new locationActions.PositionSucceeded(res))
    .catch((error) => {
      return of(new locationActions.PositionFailed({
        code: error.code,
        message: error.message
      }));
    });
}