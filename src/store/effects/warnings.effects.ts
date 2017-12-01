import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { Effect, Actions, toPayload } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { Platform } from "ionic-angular";

import * as fromRoot from "./../../store/reducers";
import * as warningsActions from "./../actions/warnings.actions";

import { DataService } from "../services/data.service";

const REFRESH = 300000; // 5 minutes
const THROTTLE = 6000; // 1 second

@Injectable()
export class WarningsEffects {
  constructor(
    private _actions$: Actions,
    private _dataService: DataService,
    private _platform: Platform,
    private _store: Store<fromRoot.State>
  ) {
    const platformReady$ = Observable.from(this._platform.ready());
    const platformResume$ = Observable.from(this._platform.resume);
    const platformPause$ = Observable.from(this._platform.pause);
    const refreshTimer$ = Observable.timer(0, REFRESH);

    platformReady$
      .merge(platformResume$.do(() => console.log("Resume", new Date())))
      .switchMapTo(refreshTimer$)
      .takeUntil(platformPause$.do(() => console.log("Pause", new Date())))
      .subscribe(() => {
        this._store.dispatch(new warningsActions.FetchAllAction());
      });
  }

  @Effect()
  fetchAllRegions$: Observable<Action> = this._actions$
    .ofType(warningsActions.FETCH_ALL)
    .mergeMap(() => {
      return Observable.from([
        new warningsActions.FetchAction({
          warningType: "Flood"
        }),
        new warningsActions.FetchAction({
          warningType: "Landslide"
        }),
        new warningsActions.FetchAction({
          warningType: "Avalanche"
        })
      ]);
    });

  @Effect()
  fetchWarnings$: Observable<Action> = this._actions$
    .ofType(warningsActions.FETCH)
    .map(toPayload)
    .do(payload =>
      console.log("[Warnings] Fetch \n", payload.warningType, new Date())
    )
    // Group by so that switch map only happens on the same warningType
    .groupBy(payload => payload.warningType)
    .map(group$ => {
      return group$
        .throttleTime(THROTTLE)
        .switchMapTo(this._dataService.fetchWarnings(group$.key))
        .map(warnings => {
          return new warningsActions.FetchCompleteAction({
            warningType: group$.key,
            warnings
          });
        })
        .catch(error => {
          return of(
            new warningsActions.FetchErrorAction({
              warningType: group$.key,
              error: error
            })
          );
        });
    })
    .mergeAll();
}
