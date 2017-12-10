import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { Effect, Actions, toPayload } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { Platform } from "ionic-angular";

import * as WarningsActions from "./../actions/warnings.actions";
import * as UISectionsActions from "./../actions/ui-sections.actions";

import { DataService } from "../services/data.service";
import { SectionType } from "../models/Section";

const REFRESH = 30000; // 30 seconds

@Injectable()
export class WarningsEffects {
  constructor(private _actions$: Actions, private _dataService: DataService) {}

  @Effect()
  refreshSection$: Observable<Action> = this._actions$
    .ofType(UISectionsActions.REFRESH_SECTION, UISectionsActions.SELECT_SECTION)
    .map(toPayload)
    .do(payload =>
      console.log(
        "[Warnings] Refresh Section",
        payload.section,
        " \n",
        new Date()
      )
    )
    .switchMap(payload =>
      Observable.timer(0, REFRESH).mapTo(
        new WarningsActions.FetchSectionAction(payload)
      )
    );

  @Effect()
  fetchSectionWarnings$: Observable<Action> = this._actions$
    .ofType(WarningsActions.FETCH_SECTION)
    .map(toPayload)
    .do(payload =>
      console.log(
        "[Warnings] Fetch Section",
        payload.section,
        " \n",
        new Date()
      )
    )
    .mergeMap(payload => {
      if (<SectionType>payload.section === "FloodLandslide") {
        return Observable.from([
          new WarningsActions.FetchWarningTypeAction({
            warningType: "Flood"
          }),
          new WarningsActions.FetchWarningTypeAction({
            warningType: "Landslide"
          })
        ]);
      } else if (<SectionType>payload.section === "Avalanche") {
        return Observable.from([
          new WarningsActions.FetchWarningTypeAction({
            warningType: "Avalanche"
          })
        ]);
      }
    });

  @Effect()
  fetchWarnings$: Observable<Action> = this._actions$
    .ofType(WarningsActions.FETCH_WARNING_TYPE)
    .map(toPayload)
    .do(payload =>
      console.log("[Warnings] Fetch", payload.warningType, " \n", new Date())
    )
    // Group by so that switch map only happens on the same warningType
    .groupBy(payload => payload.warningType)
    .map(group$ => {
      return group$.switchMapTo(
        this._dataService
          .fetchWarnings(group$.key)
          .map(warnings => {
            return new WarningsActions.FetchCompleteAction({
              warningType: group$.key,
              warnings
            });
          })
          .catch(error => {
            return of(
              new WarningsActions.FetchErrorAction({
                warningType: group$.key,
                error: error
              })
            );
          })
      );
    })
    .mergeAll();

  @Effect({ dispatch: false })
  sucess$: Observable<Action> = this._actions$
    .ofType(WarningsActions.FETCH_COMPLETE)
    .map(toPayload)
    .do(payload =>
      console.log(
        "[Warnings] Fetch Succeeded",
        payload.warningType,
        "\n",
        new Date()
      )
    )
    .mapTo(null);

  @Effect({ dispatch: false })
  error$: Observable<Action> = this._actions$
    .ofType(WarningsActions.FETCH_ERROR)
    .map(toPayload)
    .do(error => console.warn("[Warnings] Fetch Error", error))
    .mapTo(null);
}
