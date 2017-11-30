import { Action, Store } from "@ngrx/store";
import { Actions, Effect, toPayload } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { AppVersionType, LatestAppVersion } from "../models/AppVersion";
import { AlertController, Platform, Alert } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
import { InAppBrowser } from "@ionic-native/in-app-browser";

import * as PushActions from "./../actions/push.actions";

import { IPushMessage } from "@ionic/cloud-angular";

@Injectable()
export class UIPushAlertsEffects {
  private _alerts: Alert;

  constructor(
    private _actions$: Actions,
    private _alertCtrl: AlertController,
    private _translateService: TranslateService,
    private _iab: InAppBrowser,
    private _platform: Platform
  ) {}

  @Effect({ dispatch: false })
  register$: Observable<Action> = this._actions$
    .ofType(PushActions.NEW_MESSAGE)
    .map(toPayload)
    .map(message => this._createAndPresentAlert(message))
    .mapTo(null);

  private _createAndPresentAlert(message: IPushMessage) {
    const alert = this._alertCtrl.create({
      title: message.title,
      subTitle: message.text,
      buttons: [this._translateService.instant("OK")]
    });
    this._platform.ready().then(() => {
      alert.present();
    });
  }
}
