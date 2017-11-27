import { Storage } from "@ionic/storage";
import { Action, Store } from "@ngrx/store";
import { Actions, Effect } from "@ngrx/effects";
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

const STORE_KEY = "varsom-store";

@Injectable()
export class LocalStorageEffects {
  constructor(
    private _storage: Storage,
    private _actions$: Actions,
    private _store: Store<fromRoot.State>
  ) {}

  @Effect()
  getLocalStorage$: Observable<Action> = this._actions$
    .ofType(LocalStorageActions.GET)
    .startWith(new LocalStorageActions.GetAction())
    .switchMapTo(this._storage.get(STORE_KEY))
    .map(val => {
      return val ? val : defaultLocalStorage;
    })
    .mergeMap((val: LocalStorage) => {
      return Observable.from([
        new UISectionsActions.SelectSection({
          section: migrateSectionType(val.rootSection)
        }),
        new AppVersionsActions.FetchCompleteAction({
          appVersionType: "NotifiedAppVersion",
          appVersion: val.lastNotifiedAppVersion
        }),
        new FavoritesActions.AddAction(val.favoritesAreaIds)
      ]);
    });

  @Effect()
  setLocalStorage$: Observable<Action> = this._actions$
    .ofType(LocalStorageActions.SET)
    .withLatestFrom(
      this._store.select(fromRoot.getSelectedSection),
      this._store.select(fromRoot.getFavorites)
    )
    .map(([action, section, favorites]) => {
      return {
        ...defaultLocalStorage,
        rootSection: section,
        favoritesAreaIds: favorites
      };
    })
    .switchMap(val => this._storage.set(STORE_KEY, val));

  @Effect()
  changesToLocalStorage$: Observable<Action> = this._actions$
    .ofType(
      FavoritesActions.ADD ||
        FavoritesActions.REMOVE ||
        UISectionsActions.SELECT_SECTION
    )
    .mapTo(new LocalStorageActions.SetAction());
}
