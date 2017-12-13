import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";
import { Actions, toPayload, Effect } from "@ngrx/effects";
import { Observable } from "rxjs/Observable";
import { GeojsonService } from "../services/geojson.service";
import { of } from "rxjs/observable/of";

import * as GeojsonActions from "./../actions/geojson.actions";

@Injectable()
export class GeojsonEffects {
  constructor(
    private _actions$: Actions,
    private _geojsonService: GeojsonService
  ) {}

  @Effect()
  fetchRegions$: Observable<Action> = this._actions$
    .ofType(GeojsonActions.FETCH_ALL)
    .do(payload => console.log("[Geojson] Fetch All \n", new Date()))
    .mergeMap(() => {
      return Observable.from([
        new GeojsonActions.FetchAction({
          sectionType: "FloodLandslide"
        }),
        new GeojsonActions.FetchAction({
          sectionType: "Avalanche"
        })
      ]);
    });

  @Effect()
  fetchGeojsonObjects$: Observable<Action> = this._actions$
    .ofType(GeojsonActions.FETCH)
    .map(toPayload)
    .do(payload =>
      console.log("[Geosjon] Fetch \n", payload.sectionType, new Date())
    )
    // Group by so that switch map only happens on the same sectionType
    .groupBy(payload => payload.sectionType)
    .map(group$ => {
      return group$
        .switchMap(payload => this._geojsonService.fetchGeojson(group$.key))
        .map(features => {
          return new GeojsonActions.FetchCompleteAction({
            sectionType: group$.key,
            features
          });
        })
        .catch(error => {
          return of(
            new GeojsonActions.FetchErrorAction({
              sectionType: group$.key,
              error: error
            })
          );
        });
    })
    .mergeAll();
}
