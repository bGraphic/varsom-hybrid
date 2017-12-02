import { Action } from "@ngrx/store";
import { Actions, Effect, toPayload } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { ToastController, Toast, Platform } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";

import * as WarningsActions from "./../actions/warnings.actions";
import * as RegionsActions from "./../actions/regions.actions";
import { WarningType } from "../models/Warning";
import { RegionType } from "../models/Region";

type RegionsOrWarnings = "REGIONS" | "WARNINGS";

@Injectable()
export class UIErrorAlertsEffects {
  private _toasts: {
    [k in RegionsOrWarnings]?: { [k in WarningType]?: Toast }
  } = {
    REGIONS: {},
    WARNINGS: {}
  };

  constructor(
    private _actions$: Actions,
    private _toastCtrl: ToastController,
    private _translateService: TranslateService,
    private _platform: Platform
  ) {}

  @Effect({ dispatch: false })
  warningsError$: Observable<Action> = this._actions$
    .ofType(WarningsActions.FETCH_ERROR)
    .map(toPayload)
    .map(payload =>
      this._createAndPresentAlert(payload.warningType, "WARNINGS")
    )
    .mapTo(null);

  @Effect({ dispatch: false })
  regionsError$: Observable<Action> = this._actions$
    .ofType(RegionsActions.FETCH_ERROR)
    .map(toPayload)
    .map(payload => this._createAndPresentAlert(payload.sectionType, "REGIONS"))
    .mapTo(null);

  private _createAndPresentAlert(
    type: WarningType | RegionType,
    warningsOrRegions: "REGIONS" | "WARNINGS"
  ) {
    if (this._toasts[warningsOrRegions][type]) {
      this._toasts[warningsOrRegions][type].dismiss();
    }
    this._toasts[warningsOrRegions][type] = this._toastCtrl.create({
      message: this._translateService.instant(
        `ERROR_ALERT.${warningsOrRegions}.${type.toUpperCase()}`
      ),
      position: "bottom",
      showCloseButton: true,
      closeButtonText: this._translateService.instant("OK")
    });

    this._toasts[warningsOrRegions][type].onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    this._toasts[warningsOrRegions][type].present();
  }
}
