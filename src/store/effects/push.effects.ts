import { Injectable } from "@angular/core";
import { Action, Store } from "@ngrx/store";
import { Actions, toPayload, Effect } from "@ngrx/effects";
import { Observable } from "rxjs/Observable";
import { DataService } from "../services/data.service";

import * as fromRoot from "./../../store/reducers";
import * as PushActions from "./../actions/push.actions";
import * as FavoritesActions from "./../actions/favorites.actions";
import { Push, PushToken } from "@ionic/cloud-angular";
import { Platform } from "ionic-angular";

@Injectable()
export class PushEffects {
  constructor(
    private _actions$: Actions,
    private _push: Push,
    private _store: Store<fromRoot.State>,
    private _dataService: DataService,
    private _platform: Platform
  ) {
    this._platform.ready().then(() => {
      this._push
        .register()
        .then((t: PushToken) => {
          return this._push.saveToken(t);
        })
        .then((t: PushToken) => {
          this._store.dispatch(new PushActions.RegistrationSuceededAction(t));
        })
        .catch(error => {
          this._store.dispatch(new PushActions.ErrorAction(error));
        });
    });
  }

  @Effect({ dispatch: false })
  registerSucess$: Observable<Action> = this._actions$
    .ofType(PushActions.REGISTER_SUCESS)
    .map(toPayload)
    .do(token => console.log("[Push] Registration sucess", token))
    .mapTo(null);

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

  @Effect()
  favoriteChanges$: Observable<Action> = this._actions$
    .ofType(FavoritesActions.ADD, FavoritesActions.REMOVE)
    .concatMap(action => {
      const regionIds = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      const actions = regionIds.map(regionId => {
        if (action.type === FavoritesActions.ADD) {
          return new PushActions.UpdateSubscriptions({
            regionId: regionId,
            isAdd: true
          });
        } else if (action.type === FavoritesActions.REMOVE) {
          return new PushActions.UpdateSubscriptions({
            regionId: regionId,
            isAdd: false
          });
        }
      });

      return Observable.from(actions);
    });

  @Effect({ dispatch: false })
  updateSubscriptions$: Observable<Action> = this._actions$
    .ofType(PushActions.UPDATE_SUBSCRIPTION)
    .map(toPayload)
    .groupBy(payload => payload.regionId)
    .map(group$ => {
      return group$.switchMap(payload => {
        return (
          this._store
            .select(fromRoot.getPushToken)
            // Wait until there is a push token
            .filter(pushToken => !!pushToken)
            .map(pushToken => {
              // No backup if it does not work,
              // but will be removed soon as push will stop working January 31st 2018.
              if (payload.isAdd) {
                this._dataService.addPushTokenForRegion(
                  pushToken.token,
                  payload.regionId
                );
              } else {
                this._dataService.removePushTokenForArea(
                  pushToken.token,
                  payload.regionId
                );
              }
            })
            .mapTo(null)
        );
      });
    })
    .mergeAll();

  @Effect({ dispatch: false })
  error$: Observable<Action> = this._actions$
    .ofType(PushActions.ERROR)
    .map(toPayload)
    .do(error => console.log("[Push] Error", error))
    .mapTo(null);
}
