import { Storage } from "@ionic/storage";
import { Action, Store } from "@ngrx/store";
import { Actions, Effect, toPayload } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

import * as fromRoot from "./../../store/reducers";
import * as AppVersionsActions from "./../actions/app-versions.actions";
import * as LocalStorageActions from "./../actions/localstorage.actions";
import * as FavoritesActions from "./../actions/favorites.actions";
import * as UISectionsActions from "./../actions/ui-sections.actions";
import {
  LocalStorage,
  defaultLocalStorage,
  migrateSectionType
} from "../models/LocalStorage";
import { Platform } from "ionic-angular";

const STORE_KEY = "varsom-store";

@Injectable()
export class LocalStorageEffects {
  private relevantValues$: Observable<LocalStorage>;

  constructor(
    private _storage: Storage,
    private _actions$: Actions,
    private _store: Store<fromRoot.State>,
    private _platform: Platform
  ) {
    this.relevantValues$ = Observable.combineLatest(
      this._store.select(fromRoot.getSelectedSection),
      this._store.select(fromRoot.getNotifiedAppVersion),
      this._store.select(fromRoot.getFavorites)
    ).map(([rootSection, notifedAppVersion, favoriteIds]) => {
      return <LocalStorage>{
        rootSection: rootSection
          ? rootSection
          : defaultLocalStorage.rootSection,
        lastNotifiedAppVersion: notifedAppVersion
          ? notifedAppVersion
          : defaultLocalStorage.lastNotifiedAppVersion,
        favoritesAreaIds: favoriteIds
          ? favoriteIds
          : defaultLocalStorage.favoritesAreaIds,
        pushToken: defaultLocalStorage.pushToken
      };
    });
  }

  @Effect()
  getLocalStorage$: Observable<Action> = this._actions$
    .ofType(LocalStorageActions.GET)
    .startWith(new LocalStorageActions.GetAction())
    .switchMapTo(this._storage.get(STORE_KEY))
    .map(val => {
      return val ? val : defaultLocalStorage;
    })
    .do(val => console.log("GET", val))
    .mergeMap((val: LocalStorage) => {
      return Observable.from([
        new UISectionsActions.SelectSection({
          section: migrateSectionType(val.rootSection)
        }),
        new AppVersionsActions.FetchCompleteAction({
          appVersionType: "NotifiedAppVersion",
          appVersion: val.lastNotifiedAppVersion
        }),
        new FavoritesActions.AddAction(val.favoritesAreaIds),
        new LocalStorageActions.ListenAction()
      ]);
    });

  @Effect()
  startListningForRelevantChanges$: Observable<Action> = this._actions$
    .ofType(LocalStorageActions.LISTEN)
    .do(val => console.log("Listen", val))
    .map(toPayload)
    .switchMap(() => {
      return this.relevantValues$.map(val => {
        return new LocalStorageActions.SetAction(val);
      });
    });

  @Effect({ dispatch: false })
  setLocalStorage$: Observable<Action> = this._actions$
    .ofType(LocalStorageActions.SET)
    .map(toPayload)
    .do(val => console.log("Save", val))
    .switchMap(val => this._storage.set(STORE_KEY, val))
    .do(() => console.log("Saved"));
}
