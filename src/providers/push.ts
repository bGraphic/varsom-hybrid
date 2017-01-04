import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Push, PushToken, IPushMessage } from '@ionic/cloud-angular';
import { TranslateService } from 'ng2-translate';

import { FavoriteService } from "./favorites";

@Injectable()
export class PushService {

  constructor(
    private _push: Push,
    private _favoriteService: FavoriteService,
    private _alertCtrl: AlertController,
    private _translateService: TranslateService
  ) {

  }

  register() {

    console.log('PushService: Register for push');

    this._push.register().then((t: PushToken) => {
      this._favoriteService.setPushToken(t.token);
      return this._push.saveToken(t);
    }).then((t: PushToken) => {
      console.log('PushService: Token saved:', t.token);
    }).catch(error => {
      console.log('PushService: Error saving token:', error);
    });

    this._push.rx.notification()
      .subscribe((message) => {
        this._onPush(message);
      });
  }

  private _onPush(message:IPushMessage) {

    if(message.payload && message.payload['areaId']) {
      this._areaPushAlert(message);
    } else {
      this._defaultPushAlert(message);
    }
  }

  private _areaPushAlert(message:IPushMessage) {

    let confirm = this._alertCtrl.create({
      title: message.title,
      subTitle: message.text,
      buttons: [
        {
          text: this._translateService.instant('CANCEL'),
        },
        {
          text: this._translateService.instant('VIEW_AREA'),
          handler: () => {
            this._navigateToArea(message.payload['areaId']);
          }
        }
      ]
    });
    confirm.present();

  }

  private _defaultPushAlert(message:IPushMessage) {

    let alert = this._alertCtrl.create({
      title: message.title,
      subTitle: message.text,
      buttons: [this._translateService.instant('OK')]
    });
    alert.present();
  }

  private _navigateToArea(areaId: string) {
    console.log('PushService: Navigate to area', areaId);
  }
}
