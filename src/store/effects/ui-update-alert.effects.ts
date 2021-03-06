import { Store } from "@ngrx/store";
import { Injectable } from "@angular/core";
import { AlertController, Platform, Alert } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
import { InAppBrowser } from "@ionic-native/in-app-browser";

import * as fromRoot from "./../../store/reducers";
import * as AppVersionsActions from "./../actions/app-versions.actions";
import {
  AppUpdateAlertType,
  transfromAppVersionsToAlertType
} from "../models/Alert";

const APP_STORE_URL = "itms-apps://itunes.apple.com/us/app/pages/id623785979";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=no.nve.varsom2";

@Injectable()
export class UIUpdateAlertEffects {
  private _alert: Alert;

  constructor(
    private _store: Store<fromRoot.State>,
    private _alertCtrl: AlertController,
    private _translateService: TranslateService,
    private _iab: InAppBrowser,
    private _platform: Platform
  ) {
    this._store
      .select(fromRoot.getAllAppVersions)
      .map(appVersions => transfromAppVersionsToAlertType(appVersions))
      .subscribe(updateAlertType => {
        this._platform.ready().then(() => {
          if (this._alert) {
            this._alert.dismiss();
          }
          this._alert = this._createAlert(updateAlertType);
          if (this._alert) {
            this._alert.present();
          }
        });
      });
  }

  _createAlert(appUpdateAlertType: AppUpdateAlertType) {
    const skipButton = {
      text: this._translateService.instant("UPDATE.BUTTON.SKIP"),
      role: "cancel",
      handler: () => {
        this._store.dispatch(new AppVersionsActions.NotfiedUserAction());
        return false;
      }
    };

    const updateButton = {
      text: this._translateService.instant("UPDATE.BUTTON.UPDATE"),
      handler: () => {
        this._store.dispatch(new AppVersionsActions.NotfiedUserAction());
        if (this._platform.is("ios")) {
          this._iab.create(APP_STORE_URL, "_system");
        } else if (this._platform.is("android")) {
          this._iab.create(GOOGLE_PLAY_URL, "_system");
        }
        return false;
      }
    };

    if (appUpdateAlertType === "RegularUpdate") {
      return this._alertCtrl.create({
        title: this._translateService.instant("UPDATE.TITLE"),
        subTitle: this._translateService.instant("UPDATE.MESSAGE.REGULAR"),
        buttons: [skipButton, updateButton],
        enableBackdropDismiss: false
      });
    } else if (appUpdateAlertType === "ForcedUpdate") {
      return this._alertCtrl.create({
        title: this._translateService.instant("UPDATE.TITLE"),
        subTitle: this._translateService.instant("UPDATE.MESSAGE.FORCE"),
        buttons: [updateButton],
        enableBackdropDismiss: false
      });
    }
  }
}
