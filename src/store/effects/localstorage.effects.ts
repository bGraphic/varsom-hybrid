import { Storage } from "@ionic/storage";
import { Action, Store } from "@ngrx/store";
import { Actions, toPayload, Effect } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

import * as fromRoot from "./../../store/reducers";
import * as LocalStorageActions from "./../actions/localstorage.actions";
import * as FavoritesActions from "./../actions/favorites.actions";
import * as UISectionsActions from "./../actions/ui-sections.actions";
import { LocalStorage, defaultLocalStorage } from "../models/LocalStorage";
import { SectionType } from "../models/Section";

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
    .do(val => console.log("GET", val))
    .map(val => {
      return val ? val : defaultLocalStorage;
    })
    .mergeMap((val: LocalStorage) => {
      return Observable.from([
        new UISectionsActions.SelectSection({
          section: migrateSectionType(val.rootSection)
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
    .do(() => console.log("Dispatch set action"))
    .mapTo(new LocalStorageActions.SetAction());
}

const migrateSectionType = (section: string): SectionType => {
  switch (section) {
    case "AVALANCHE":
      return "Avalanche";
    case "FLOOD_LANDSLIDE":
      return "FloodLandslide";
    case "Avalanche" || "FloodLandslide":
      return <SectionType>section;
    default:
      return <SectionType>defaultLocalStorage.rootSection;
  }
};
