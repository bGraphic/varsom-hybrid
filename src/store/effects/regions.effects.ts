import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { Effect, Actions, toPayload } from "@ngrx/effects";
import { Action } from "@ngrx/store";

import * as RegionsActions from "./../actions/regions.actions";

import { DataService } from "../services/data.service";

@Injectable()
export class RegionsEffects {
  constructor(private _actions$: Actions, private _dataService: DataService) {}

  @Effect()
  fetchAllRegions$: Observable<Action> = this._actions$
    .ofType(RegionsActions.FETCH_ALL)
    .do(payload => console.log("[Regions] Fetch All \n", new Date()))
    .mergeMap(() => {
      return Observable.from([
        new RegionsActions.FetchAction({
          sectionType: "FloodLandslide"
        }),
        new RegionsActions.FetchAction({
          sectionType: "Avalanche"
        })
      ]);
    });

  @Effect()
  fetchRegions$: Observable<Action> = this._actions$
    .ofType(RegionsActions.FETCH)
    .map(toPayload)
    .do(payload =>
      console.log("[Regions] Fetch \n", payload.sectionType, new Date())
    )
    // Group by so that switch map only happens on the same warningType
    .groupBy(payload => payload.sectionType)
    .map(group$ => {
      return group$.switchMap(payload =>
        this._dataService
          .fetchRegions(group$.key)
          .map(regions => {
            return new RegionsActions.FetchCompleteAction({
              sectionType: group$.key,
              regions
            });
          })
          .catch(error => {
            return of(
              new RegionsActions.FetchErrorAction({
                sectionType: group$.key,
                error: error
              })
            );
          })
      );
    })
    .mergeAll();

  @Effect({ dispatch: false })
  sucess$: Observable<Action> = this._actions$
    .ofType(RegionsActions.FETCH_COMPLETE)
    .map(toPayload)
    .do(payload =>
      console.log(
        "[Regions] Fetch Succeeded",
        payload.sectionType,
        "\n",
        new Date()
      )
    )
    .mapTo(null);

  @Effect({ dispatch: false })
  error$: Observable<Action> = this._actions$
    .ofType(RegionsActions.FETCH_ERROR)
    .map(toPayload)
    .do(error => console.warn("[Regions] Fetch Error", error))
    .mapTo(null);
}
