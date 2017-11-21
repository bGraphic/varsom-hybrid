import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";
import { Actions, toPayload, Effect } from "@ngrx/effects";
import { Observable } from "rxjs/Observable";
import * as regionsActions from "./../actions/regions.actions";
import * as geojsonActions from "./../actions/geojson.actions";
import { GeojsonService } from "../services/geojson.service";
import { SectionType } from "../models/Section";
import { of } from "rxjs/observable/of";

@Injectable()
export class GeojsonEffects {
  constructor(
    private _actions$: Actions,
    private _geojsonService: GeojsonService
  ) {}

  @Effect()
  fetchRegions$: Observable<Action> = this._actions$
    .ofType(regionsActions.FETCH)
    .map(toPayload)
    .map(payload => {
      return new geojsonActions.FetchAction({
        sectionType: payload.sectionType
      });
    });

  @Effect()
  fetchGeojsonObjects$: Observable<Action> = this._actions$
    .ofType(geojsonActions.FETCH)
    .map(toPayload)
    // Group by so that switch map only happens on the same sectionType
    .groupBy(payload => payload.sectionType)
    .map(group$ => {
      return group$
        .switchMap(payload => this._geojsonService.fetchGeojson(group$.key))
        .map(geojsonObjects => {
          return new geojsonActions.FetchCompleteAction({
            sectionType: group$.key,
            geojsonObjects
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
