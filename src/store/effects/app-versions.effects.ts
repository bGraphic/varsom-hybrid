import { Action } from "@ngrx/store";
import { Actions, Effect, toPayload } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { AppVersion } from "@ionic-native/app-version";

import * as fromRoot from "./../../store/reducers";
import * as AppVersionsActions from "./../actions/app-versions.actions";
import { AppVersionType, LatestAppVersion } from "../models/AppVersion";
import { DataService } from "../services/data.service";

@Injectable()
export class AppVersionsEffects {
  constructor(
    private _dataService: DataService,
    private _appVersion: AppVersion,
    private _actions$: Actions
  ) {}

  @Effect()
  init$: Observable<Action> = this._actions$
    .ofType("@ngrx/store/init")
    .mergeMapTo(
      Observable.of(
        new AppVersionsActions.FetchAction({
          appVersionType: "ThisAppVersion"
        }),
        new AppVersionsActions.FetchAction({
          appVersionType: "LatestAppVersion"
        })
      )
    );

  @Effect()
  fetchPlatformAppVersions$: Observable<Action> = this._actions$
    .ofType(AppVersionsActions.FETCH)
    .map(toPayload)
    .map(payload => <AppVersionType>payload.appVersionType)
    .filter(
      appVersionType =>
        appVersionType === "ThisAppVersion" ||
        appVersionType == "LatestAppVersion"
    )
    .switchMap(appVersionType => {
      let version$: Observable<string | LatestAppVersion>;

      switch (appVersionType) {
        case "ThisAppVersion":
          version$ = Observable.from(this._appVersion.getVersionNumber());
        case "LatestAppVersion":
          version$ = this._dataService.fetchLatestAppVersion();
      }

      return Observable.combineLatest(Observable.of(appVersionType), version$);
    })
    .map(([appVersionType, appVersion]) => {
      return new AppVersionsActions.FetchCompleteAction({
        appVersionType: appVersionType,
        appVersion: appVersion
      });
    })
    .catch(error => {
      return Observable.of(
        new AppVersionsActions.FetchErrorAction({
          error: error
        })
      );
    });
}
