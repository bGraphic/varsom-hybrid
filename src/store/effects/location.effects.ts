import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { Effect, Actions, toPayload } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { Geolocation } from "@ionic-native/geolocation";
import { Platform } from "ionic-angular";

import * as fromRoot from "./../../store/reducers";
import * as locationActions from "./../actions/location.actions";

@Injectable()
export class LocationEffects {
  constructor(
    private _actions$: Actions,
    private _store: Store<fromRoot.State>,
    private _geolocation: Geolocation,
    private _platform: Platform
  ) {
    this._platform.ready().then(() => {
      this._store.dispatch(new locationActions.WatchPosition());
    });
  }

  @Effect()
  watchPosition$: Observable<Action> = this._actions$
    .ofType(locationActions.WATCH_POSITION)
    .switchMapTo(this._geolocation.watchPosition())
    .map(res => {
      return {
        latitude: res.coords.latitude,
        longitude: res.coords.longitude
      };
    })
    .map(res => new locationActions.PositionUpdated(res))
    .catch(error => {
      return of(
        new locationActions.PositionFailed({
          code: error.code,
          message: error.message
        })
      );
    });

  @Effect({ dispatch: false })
  sucess$: Observable<Action> = this._actions$
    .ofType(locationActions.POSITION_UPDATED)
    .do(payload => console.log("[Location] Position Updated"))
    .mapTo(null);

  @Effect({ dispatch: false })
  error$: Observable<Action> = this._actions$
    .ofType(locationActions.POSITION_ERROR)
    .map(toPayload)
    .do(error => console.warn("[Location] Position failed", error))
    .mapTo(null);
}
