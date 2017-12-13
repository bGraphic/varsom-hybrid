import { Action, Store } from "@ngrx/store";
import { Actions, Effect, toPayload } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { ToastController, Toast } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";

import * as moment from "moment";
import * as fromRoot from "./../../store/reducers";
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
    private _store: Store<fromRoot.State>
  ) {}

  @Effect({ dispatch: false })
  warningsError$: Observable<Action> = this._actions$
    .ofType(WarningsActions.FETCH_ERROR)
    .map(toPayload)
    .switchMap(payload => {
      return this._store
        .select(fromRoot.getWarningsTimeStamp(payload.warningType))
        .first()
        .do(timestamp =>
          this._createAndPresentAlert(
            "WARNINGS",
            payload.warningType,
            timestamp
          )
        );
    })
    .mapTo(null);

  @Effect({ dispatch: false })
  regionsError$: Observable<Action> = this._actions$
    .ofType(RegionsActions.FETCH_ERROR)
    .map(toPayload)
    .map(payload =>
      this._createAndPresentAlert("REGIONS", payload.sectionType, null)
    )
    .mapTo(null);

  private _createAndPresentAlert(
    warningsOrRegions: "REGIONS" | "WARNINGS",
    type: WarningType | RegionType,
    timestamp: Date
  ) {
    if (this._toasts[warningsOrRegions][type]) {
      this._toasts[warningsOrRegions][type].dismiss();
    }

    let message = this._translateService.instant(
      `ERROR_ALERT.${warningsOrRegions}.${type.toUpperCase()}`
    );

    if (timestamp) {
      message += this._translateService.instant("ERROR_ALERT.TIMEAGO", {
        timeago: moment(timestamp).fromNow()
      });
    }

    this._toasts[warningsOrRegions][type] = this._toastCtrl.create({
      message: message,
      position: "bottom",
      showCloseButton: true,
      closeButtonText: this._translateService.instant("OK")
    });

    this._toasts[warningsOrRegions][type].present();
  }
}
