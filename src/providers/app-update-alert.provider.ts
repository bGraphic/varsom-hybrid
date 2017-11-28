import { Injectable } from "@angular/core";
import { AlertController, Platform, Alert } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Store } from "@ngrx/store";

import * as fromRoot from "./../store/reducers";
import * as AppVersionsActions from "./../store/actions/app-versions.actions";

@Injectable()
export class AppUpdateAlertProvider {
  private _updateAlert: Alert;
  private _forcedUpdateAlert: Alert;

  constructor(
    private _alertCtrl: AlertController,
    private _translateService: TranslateService,
    private _iab: InAppBrowser,
    private _platform: Platform,
    private _store: Store<fromRoot.State>
  ) {}
}
