import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Effect, Actions } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Platform } from 'ionic-angular';
import { Push, PushToken, IPushMessage } from '@ionic/cloud-angular';
import { Injectable } from '@angular/core';

import * as fromRoot from './../reducers';
import * as push from './../actions/push.actions';

@Injectable()
export class PushEffects {

  constructor(
    private _actions$: Actions,
    private _store: Store<fromRoot.State>,
    private _push: Push,
    private _platform: Platform
  ) {

  }

@Effect()
register$: Observable<Action> = this._actions$
  .ofType(push.REGISTER)
  .startWith(push.REGISTER)
  .switchMapTo(this._push.register())
  .map((pushToken: PushToken) => new push.RegisterSucessAction(pushToken))
  .catch(error => of(new push.RegisterFailAction(error)));

@Effect()
subscribe: Observable<Action> = this._actions$
  .ofType(push.SUBSCRIBE)
  .startWith(push.SUBSCRIBE)
  .switchMapTo(this._platform.ready())
  .switchMapTo(this._push.rx.notification())
  .map((message: IPushMessage) => new push.NewMessageAction(message))
  .catch(error => of(new push.SubscribeFailAction(error)));
}