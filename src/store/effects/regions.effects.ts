import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { Effect, Actions, toPayload } from "@ngrx/effects";
import { Action } from "@ngrx/store";

import * as regionsActions from "./../actions/regions.actions";
import { DataService } from "../services/data.service";
import { SectionType } from "../models/Section";

@Injectable()
export class RegionsEffects {
  constructor(private _actions$: Actions, private _dataService: DataService) {}

  @Effect()
  fetchRegions$: Observable<Action> = this._actions$
    .ofType(regionsActions.FETCH)
    .map(toPayload)
    // Group by so that switch map only happens on the same warningType
    .groupBy(payload => payload.sectionType)
    .map(group$ => {
      return group$
        .switchMap(payload =>
          this._dataService.fetchRegions(<SectionType>group$.key)
        )
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
        });
    })
    .mergeAll();
}
