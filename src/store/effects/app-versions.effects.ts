import { Action } from "@ngrx/store";
import { Actions, Effect, toPayload } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { AppVersion } from "@ionic-native/app-version";

import * as AppVersionsActions from "./../actions/app-versions.actions";
import { AppVersionType } from "../models/AppVersion";
import { DataService } from "../services/data.service";

@Injectable()
export class AppVersionsEffects {
  constructor(
    private _dataService: DataService,
    private _appVersion: AppVersion,
    private _actions$: Actions
  ) {}

  @Effect()
  fetchThisAppVersion$: Observable<Action> = this._actions$
    .ofType(AppVersionsActions.FETCH)
    .startWith(
      new AppVersionsActions.FetchAction({
        appVersionType: "ThisAppVersion"
      })
    )
    .map(toPayload)
    .map(payload => <AppVersionType>payload.appVersionType)
    .filter(appVersionType => appVersionType === "ThisAppVersion")
    .switchMap(appVersionType =>
      Observable.from(this._appVersion.getVersionNumber())
        .map(appVersion => {
          return new AppVersionsActions.FetchCompleteAction({
            appVersionType: appVersionType,
            appVersion: appVersion
          });
        })
        .catch(error => {
          return Observable.of(
            new AppVersionsActions.FetchErrorAction({
              appVersionType: appVersionType,
              error: error
            })
          );
        })
    );

  @Effect()
  fetchLatestAppVersion$: Observable<Action> = this._actions$
    .ofType(AppVersionsActions.FETCH)
    .startWith(
      new AppVersionsActions.FetchAction({
        appVersionType: "LatestAppVersion"
      })
    )
    .map(toPayload)
    .map(payload => <AppVersionType>payload.appVersionType)
    .filter(appVersionType => appVersionType === "LatestAppVersion")
    .switchMap(appVersionType =>
      this._dataService
        .fetchLatestAppVersion()
        .map(appVersion => {
          return new AppVersionsActions.FetchCompleteAction({
            appVersionType: appVersionType,
            appVersion: appVersion
          });
        })
        .catch(error => {
          return Observable.of(
            new AppVersionsActions.FetchErrorAction({
              appVersionType: appVersionType,
              error: error
            })
          );
        })
    );
}
