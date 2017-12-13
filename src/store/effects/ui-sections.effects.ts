import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Effect, Actions, toPayload } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { Platform } from "ionic-angular/platform/platform";

import * as fromRoot from "./../../store/reducers";
import * as RegionsActions from "./../actions/regions.actions";
import * as WarningsActions from "./../actions/warnings.actions";
import * as GeojsonActions from "./../actions/geojson.actions";
import * as UISectionsActions from "./../actions/ui-sections.actions";

import { REFRESH } from "../../config/config";

@Injectable()
export class UISectionsEffects {
  constructor(
    private _actions$: Actions,
    private _platform: Platform,
    private _store: Store<fromRoot.State>
  ) {
    Observable.from(this._platform.resume)
      .withLatestFrom(this._store.select(fromRoot.getSelectedSection))
      .do(response => {
        console.log("[UISections] Platform Resume");
      })
      .subscribe(([resume, section]) => {
        this._store.dispatch(
          new UISectionsActions.RefreshSection({ section: section })
        );
      });
  }

  @Effect()
  refreshRegions$: Observable<Action> = this._actions$
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
      return new RegionsActions.FetchAction({
        sectionType: payload.section
      });
    });

  @Effect()
  refreshWarnings$: Observable<Action> = this._actions$
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
      Observable.timer(0, REFRESH)
        .takeUntil(Observable.from(this._platform.pause))
        .mapTo(new WarningsActions.FetchSectionAction(payload))
    );

  @Effect()
  refreshGeojson$: Observable<Action> = this._actions$
    .ofType(UISectionsActions.REFRESH_SECTION, UISectionsActions.SELECT_SECTION)
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
      return new GeojsonActions.FetchAction({
        sectionType: payload.section
      });
    });
}
