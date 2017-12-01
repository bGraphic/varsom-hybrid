import { Injectable } from "@angular/core";
import { Action, Store } from "@ngrx/store";
import { Actions, toPayload, Effect } from "@ngrx/effects";
import { Observable } from "rxjs/Observable";
import * as regionsActions from "./../actions/regions.actions";
import * as geojsonActions from "./../actions/geojson.actions";
import { GeojsonService } from "../services/geojson.service";
import { of } from "rxjs/observable/of";
import { Platform } from "ionic-angular";
import * as fromRoot from "./../../store/reducers";

@Injectable()
export class GeojsonEffects {
  constructor(
    private _actions$: Actions,
    private _geojsonService: GeojsonService,
    private _platform: Platform,
    private _store: Store<fromRoot.State>
  ) {
    this._platform.ready().then(() => {
      this._store.dispatch(new geojsonActions.FetchAllAction());
    });
  }

  @Effect()
  fetchRegions$: Observable<Action> = this._actions$
    .ofType(geojsonActions.FETCH_ALL)
    // .startWith(new geojsonActions.FetchAllAction())
    .mergeMap(() => {
      return Observable.from([
        new geojsonActions.FetchAction({
          sectionType: "FloodLandslide"
        }),
        new geojsonActions.FetchAction({
          sectionType: "Avalanche"
        })
      ]);
    })
    .do(test => console.log(test));

  @Effect()
  fetchGeojsonObjects$: Observable<Action> = this._actions$
    .ofType(geojsonActions.FETCH)
    .do(test => console.log(test))
    .map(toPayload)
    // Group by so that switch map only happens on the same sectionType
    .groupBy(payload => payload.sectionType)
    .map(group$ => {
      return group$
        .switchMap(payload => this._geojsonService.fetchGeojson(group$.key))
        .map(features => {
          return new geojsonActions.FetchCompleteAction({
            sectionType: group$.key,
            features
          });
        })
        .catch(error => {
          return of(
            new geojsonActions.FetchErrorAction({
              sectionType: group$.key,
              error: error
            })
          );
        });
    })
    .mergeAll();
}
