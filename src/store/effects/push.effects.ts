import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";
import { Actions, toPayload, Effect } from "@ngrx/effects";
import { Observable } from "rxjs/Observable";
import { Push, PushToken, IPushMessage } from "@ionic/cloud-angular";
import * as PushActions from "./../actions/push.actions";
import { Platform } from "ionic-angular";

@Injectable()
export class PushEffects {
  constructor(
    private _actions$: Actions,
    private _push: Push,
    private _platform: Platform
  ) {}

  @Effect()
  register$: Observable<Action> = this._actions$
    .ofType(PushActions.REGISTER)
    .startWith(new PushActions.RegisterAction())
    .switchMapTo(
      Observable.from(this._push.register())
        .map((token: PushToken) => {
          return new PushActions.RegistrationSuceededAction(token);
        })
        .catch(error => {
          return Observable.of(new PushActions.ErrorAction(error));
        })
    );

  @Effect()
  subscribe$: Observable<Action> = this._actions$
    .ofType(PushActions.SUBSCRIBE)
    .startWith(new PushActions.SubscribeAction())
    .switchMapTo(
      this._push.rx
        .notification()
        .map(message => {
          return new PushActions.NewMessage(message);
        })
        .catch(error => {
          return Observable.of(new PushActions.ErrorAction(error));
        })
    );

  @Effect({ dispatch: false })
  error$: Observable<Action> = this._actions$
    .ofType(PushActions.ERROR)
    .map(toPayload)
    .map(error => {
      console.log("[Push] Error", error);
      return null;
    });
}
