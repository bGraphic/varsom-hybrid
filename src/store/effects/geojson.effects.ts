import { Injectable } from "@angular/core";
import { Action, Store } from "@ngrx/store";
import { Actions, toPayload, Effect } from "@ngrx/effects";
import { Observable } from "rxjs/Observable";
import * as geojsonActions from "./../actions/geojson.actions";
import * as UISectionsActions from "./../actions/ui-sections.actions";
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
  refreshSection$: Observable<Action> = this._actions$
    .ofType(UISectionsActions.REFRESH_SECTION)
    .map(toPayload)
    .do(payload =>
      console.log(
        "[Geojson] Refresh Section",
        payload.section,
        " \n",
        new Date()
      )
    )
    .map(payload => {
      return new geojsonActions.FetchAction({
        sectionType: payload.section
      });
    });

  @Effect()
  fetchRegions$: Observable<Action> = this._actions$
    .ofType(geojsonActions.FETCH_ALL)
    .do(payload => console.log("[Geojson] Fetch All \n", new Date()))
    .mergeMap(() => {
      return Observable.from([
        new geojsonActions.FetchAction({
          sectionType: "FloodLandslide"
        }),
        new geojsonActions.FetchAction({
          sectionType: "Avalanche"
        })
      ]);
    });

  @Effect()
  fetchGeojsonObjects$: Observable<Action> = this._actions$
    .ofType(geojsonActions.FETCH)
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
