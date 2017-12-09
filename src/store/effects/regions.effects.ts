import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Platform } from "ionic-angular";
import { of } from "rxjs/observable/of";
import { Effect, Actions, toPayload } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";

import * as fromRoot from "./../../store/reducers";
import * as regionsActions from "./../actions/regions.actions";
import * as UISectionsActions from "./../actions/ui-sections.actions";

import { DataService } from "../services/data.service";
import { SectionType } from "../models/Section";

@Injectable()
export class RegionsEffects {
  constructor(
    private _actions$: Actions,
    private _dataService: DataService,
    private _platform: Platform,
    private _store: Store<fromRoot.State>
  ) {}

  @Effect()
  refreshSection$: Observable<Action> = this._actions$
    .ofType(UISectionsActions.REFRESH_SECTION, UISectionsActions.SELECT_SECTION)
    .map(toPayload)
    .do(payload =>
      console.log(
        "[Regions] Refresh Section",
        payload.section,
        " \n",
        new Date()
      )
    )
    .map(payload => {
      return new regionsActions.FetchAction({
        sectionType: payload.section
      });
    });

  @Effect()
  fetchAllRegions$: Observable<Action> = this._actions$
    .ofType(regionsActions.FETCH_ALL)
    .do(payload => console.log("[Regions] Fetch All \n", new Date()))
    .mergeMap(() => {
      return Observable.from([
        new regionsActions.FetchAction({
          sectionType: "FloodLandslide"
        }),
        new regionsActions.FetchAction({
          sectionType: "Avalanche"
        })
      ]);
    });

  @Effect()
  fetchRegions$: Observable<Action> = this._actions$
    .ofType(regionsActions.FETCH)
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
            return new regionsActions.FetchCompleteAction({
              sectionType: group$.key,
              regions
            });
          })
          .catch(error => {
            return of(
              new regionsActions.FetchErrorAction({
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
    .ofType(regionsActions.FETCH_COMPLETE)
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
    .ofType(regionsActions.FETCH_ERROR)
    .map(toPayload)
    .do(error => console.warn("[Regions] Fetch Error", error))
    .mapTo(null);
}
