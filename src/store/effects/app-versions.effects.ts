import { Action } from "@ngrx/store";
import { Actions, Effect, toPayload } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { AppVersion } from "@ionic-native/app-version";

import * as fromRoot from "./../../store/reducers";
import * as AppVersionsActions from "./../actions/app-versions.actions";
import { AppVersionType } from "../models/AppVersion";

@Injectable()
export class AppVersionsEffects {
  constructor(private _appVersion: AppVersion, private _actions$: Actions) {}

  @Effect()
  fetchPlatformAppVersions$: Observable<Action> = this._actions$
    .ofType(AppVersionsActions.FETCH)
    .startWith(
      new AppVersionsActions.FetchAction({ appVersionType: "ThisAppVersion" })
    )
    .map(toPayload)
    .filter(
      payload => <AppVersionType>payload.appVersionType === "ThisAppVersion"
    )
    .switchMapTo(this._appVersion.getVersionNumber())
    .map(appVersion => {
      console.log("ThisAppVersion", appVersion);
      return new AppVersionsActions.FetchCompleteAction({
        appVersionType: "ThisAppVersion",
        appVersion: appVersion
      });
    })
    .catch(error => {
      return Observable.of(
        new AppVersionsActions.FetchErrorAction({
          appVersionType: "ThisAppVersion",
          error: error
        })
      );
    });
}
