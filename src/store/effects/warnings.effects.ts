import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { Effect, Actions, toPayload } from "@ngrx/effects";
import { Action } from "@ngrx/store";

import * as warningsActions from "./../actions/warnings.actions";
import { WarningsService } from "../services/warnings";

@Injectable()
export class WarningsEffects {
  constructor(
    private _actions$: Actions,
    private _warningService: WarningsService
  ) {}

  @Effect()
  fetchForecasts$: Observable<Action> = this._actions$
    .ofType(warningsActions.FETCH)
    .startWith(new warningsActions.FetchAction({ forecastType: "Avalanche" }))
    .map(toPayload)
    .switchMap(payload =>
      this._warningService.fetchForecasts(payload.forecastType)
    )
    .map(res => new warningsActions.FetchCompleteAction(res))
    .catch(error => {
      return of(
        new warningsActions.FetchErrorAction({
          forecastType: "Avalanche",
          error: {
            code: error.code,
            message: error.message
          }
        })
      );
    });
}
