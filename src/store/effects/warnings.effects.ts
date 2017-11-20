import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { Effect, Actions, toPayload } from "@ngrx/effects";
import { Action } from "@ngrx/store";

import * as warningsActions from "./../actions/warnings.actions";
import { DataService } from "../services/data.service";

@Injectable()
export class WarningsEffects {
  constructor(private _actions$: Actions, private _dataService: DataService) {}

  @Effect()
  fetchWarnings$: Observable<Action> = this._actions$
    .ofType(warningsActions.FETCH)
    .map(toPayload)
    // Group by so that switch map only happens on the same warningType
    .groupBy(payload => payload.warningType)
    .map(group$ => {
      return group$
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
