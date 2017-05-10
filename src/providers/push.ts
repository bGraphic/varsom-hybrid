import { Injectable } from '@angular/core';
import { App, AlertController, Platform } from 'ionic-angular';

import { Push, IPushMessage } from '@ionic/cloud-angular';
import {TranslateService} from '@ngx-translate/core';

import { AreaUtils } from "../utils/area-utils";
import { AvalancheListPage } from "../pages/list/avalanche-list";
import { FloodLandslideListPage } from "../pages/list/flood-landslide-list";
import { AreaDetailsPage } from '../pages/area-details/area-details';

@Injectable()
export class PushService {

  constructor(
    private _push: Push,
    private _appCtrl: App,
    private _platform: Platform,
    private _alertCtrl: AlertController,
    private _translateService: TranslateService,

  ) {

    this._platform.ready().then(() => {

      console.log('PushService: Subscribe to push');
      this._push.rx.notification()
        .subscribe((message) => {
          this._onPush(message);
        });

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
            console.log('PushService: Navigate to area', message.payload['areaId']);
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

    let rootNav= this._appCtrl.getRootNav();

    if(AreaUtils.isRegion(areaId)) {
      rootNav.setRoot(AvalancheListPage);
      rootNav.push(AreaDetailsPage, {area: { id: areaId }});
    } else if(AreaUtils.isCounty(areaId)) {
      rootNav.setRoot(FloodLandslideListPage);
      rootNav.push(FloodLandslideListPage, {area: { id: areaId }});
    } else if(AreaUtils.isMunicipality(areaId)) {
      rootNav.setRoot(FloodLandslideListPage);
      rootNav.push(FloodLandslideListPage, {area: { id: AreaUtils.getParentId(areaId) }});
      rootNav.push(AreaDetailsPage, {area: { id: areaId }});
    }
  }
}
