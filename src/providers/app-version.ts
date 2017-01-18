import { Injectable } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { AppVersion, InAppBrowser } from 'ionic-native';
import { TranslateService } from 'ng2-translate';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { DataService } from "./data";

@Injectable()
export class AppVersionService {

  private readonly VERSION_NOTIFIED_KEY = 'VERSION_NOTIFIED_KEY';
  private _activeAlert = false;

  constructor (
    private _platform: Platform,
    private _storage: Storage,
    private _alertCtrl: AlertController,
    private _translateService: TranslateService,
    private _dataService: DataService
  ) {

    this._platform.ready().then(() => {
      this.checkAppVersion();
    });

    this._platform.resume.subscribe(e => {
      this.checkAppVersion();
    });
  }

  private checkAppVersion() {

    let lastNotifiedAppVersionNumber$ = this._fetchFromStorage(this.VERSION_NOTIFIED_KEY);
    let thisVersionNumber$ = Observable.fromPromise(AppVersion.getVersionNumber());
    let latestAppRelease = this._dataService.getAppVersion().first();

    Observable
      .combineLatest(
        lastNotifiedAppVersionNumber$,
        thisVersionNumber$,
        latestAppRelease
      ).subscribe(latestValues => {
        const [ lastNotifiedAppVersionNumber, thisAppVersionNumber, latestAppRelease ] = latestValues;
        const latestAppReleaseVersionNumber = latestAppRelease.versionNumber;
        const latestAppReleaseHardRelease = latestAppRelease.hard;

        console.log("AppVersionService: thisAppVersionNumber", thisAppVersionNumber);
        console.log("AppVersionService: lastNotifiedAppVersionNumber", lastNotifiedAppVersionNumber);
        console.log("AppVersionService: latestAppReleaseVersionNumber", latestAppReleaseVersionNumber);
        console.log("AppVersionService: latestAppReleaseHardRelease", latestAppReleaseHardRelease);

        if(latestAppReleaseVersionNumber > thisAppVersionNumber && latestAppReleaseHardRelease) {
          this._showAlert(true);
        } else if(latestAppReleaseVersionNumber > thisAppVersionNumber && lastNotifiedAppVersionNumber !== latestAppReleaseVersionNumber) {
          this._showAlert(false);
        }

        if(lastNotifiedAppVersionNumber !== latestAppReleaseVersionNumber) {
          this._saveToStorage(this.VERSION_NOTIFIED_KEY, latestAppReleaseVersionNumber);
        }
      }, error => {
        console.log("AppVersionService: Subscription error", error);
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
        console.log("Go to App Store");
        new InAppBrowser("itms-apps://itunes.apple.com/us/app/pages/id623785979", "_system");
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

  private _fetchFromStorage(key:string) {
    return Observable
      .fromPromise(this._storage.get(key))
      .map(value => {
        console.log("AppVersionService: Fetched", key, value);
        return value;
      });
  }

  private _saveToStorage(key:string, value:any) {
    this._storage.set(key, value)
      .then(
        () => {
          console.log("AppVersionService: Saved", key, value);
        },
        error => {
          console.error("AppVersionService: Error storing", key, value);
        }
      );
  }

}
