import { Action } from "@ngrx/store";
import { Actions, Effect, toPayload } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { AlertController, Platform } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";

import * as FavoritesAction from "./../actions/favorites.actions";
import { InAppBrowser } from "@ionic-native/in-app-browser";

@Injectable()
export class UISubscriptionAlertsEffects {
  constructor(
    private _actions$: Actions,
    private _alertCtrl: AlertController,
    private _translateService: TranslateService,
    private _platform: Platform,
    private _iab: InAppBrowser
  ) {}

  @Effect({ dispatch: false })
  register$: Observable<Action> = this._actions$
    .ofType(FavoritesAction.ADD)
    .map(toPayload)
    .do(payload => console.log("SUB 1", payload))
    .filter(payload => !Array.isArray(payload))
    .do(payload => console.log("SUB 2", payload))
    .map(() => this._createAndPresentAlert())
    .mapTo(null);

  private _createAndPresentAlert() {
    const alert = this._alertCtrl.create({
      subTitle: this._translateService.instant("SUBSCRIPTION_ALERT.MESSAGE"),
      buttons: [
        {
          text: this._translateService.instant("SUBSCRIPTION_ALERT.CANCEL"),
          role: "cancel"
        },
        {
          text: this._translateService.instant("SUBSCRIPTION_ALERT.CONFIRM"),
          handler: () => {
            this._iab.create(
              this._translateService.instant("SUBSCRIPTION_ALERT.URL"),
              "_system"
            );
          }
        }
      ]
    });
    this._platform.ready().then(() => {
      alert.present();
    });
  }
}
