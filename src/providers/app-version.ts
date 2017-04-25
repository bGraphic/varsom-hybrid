import { Injectable } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { AppVersion, InAppBrowser } from 'ionic-native';
import {TranslateService} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { DataService } from "./data";
import { StorageService } from "./storage";

@Injectable()
export class AppVersionService {

  private readonly APP_STORE_URL = "itms-apps://itunes.apple.com/us/app/pages/id623785979";
  private _activeAlert = false;
  private _lastNotifiedVersionNumber:string;

  constructor (
    private _platform: Platform,
    private _alertCtrl: AlertController,
    private _translateService: TranslateService,
    private _dataService: DataService,
    private _storageService: StorageService
  ) {

    this.checkAppVersion();

  }

  private checkAppVersion() {

    let thisVersionNumber$ = Observable.fromPromise(AppVersion.getVersionNumber());
    let latestAppRelease$ = this._dataService.getAppVersion();
    let appActivated$ = this._platform.resume.merge(Observable.fromPromise(this._platform.ready()));

    this._storageService.lastNotifiedAppVersion$
      .concatMap(versionNumber => {
        this._lastNotifiedVersionNumber = versionNumber;
        return Observable.combineLatest(thisVersionNumber$, latestAppRelease$, appActivated$);
      }).subscribe(latestValues => {
        const [ thisAppVersionNumber, latestAppRelease ] = latestValues;
        const latestAppReleaseVersionNumber = latestAppRelease.versionNumber;
        const latestAppReleaseHardRelease = latestAppRelease.hard;

        console.log("AppVersionService: thisAppVersionNumber", thisAppVersionNumber);
        console.log("AppVersionService: lastNotifiedAppVersionNumber", this._lastNotifiedVersionNumber);
        console.log("AppVersionService: latestAppReleaseVersionNumber", latestAppReleaseVersionNumber);
        console.log("AppVersionService: latestAppReleaseHardRelease", latestAppReleaseHardRelease);

        if(latestAppReleaseVersionNumber > thisAppVersionNumber && latestAppReleaseHardRelease) {
          this._showAlert(true);
        } else if(latestAppReleaseVersionNumber > thisAppVersionNumber && this._lastNotifiedVersionNumber !== latestAppReleaseVersionNumber) {
          this._showAlert(false);
        }

        this._storageService.lastNotifiedAppVersion = latestAppReleaseVersionNumber;
        this._lastNotifiedVersionNumber = latestAppReleaseVersionNumber;
    }, error => {
        console.log("AppVersion: ", error);
    });
  }

  private _showAlert(forceUpdate: boolean) {

    if(this._activeAlert) {
      return;
    }

    let skipButton = {
      text: this._translateService.instant('UPDATE.BUTTON.SKIP'),
      handler: () => {
        this._activeAlert = false;
      }
    };

    let updateButton = {
      text: this._translateService.instant('UPDATE.BUTTON.UPDATE'),
      handler: () => {
        this._activeAlert = false;
        console.log("AppVersionService: Go to App Store");
        new InAppBrowser(this.APP_STORE_URL, "_system");
      }
    };

    let confirm = this._alertCtrl.create({
      title: this._translateService.instant('UPDATE.TITLE'),
      subTitle: this._translateService.instant('UPDATE.MESSAGE.REGULAR'),
      buttons: [ skipButton, updateButton ]
    });

    if(forceUpdate) {
      confirm = this._alertCtrl.create({
        title: this._translateService.instant('UPDATE.TITLE'),
        subTitle: this._translateService.instant('UPDATE.MESSAGE.FORCE'),
        buttons: [ updateButton ]
      });
    }

    confirm.present();
    this._activeAlert = true;
  }
}
