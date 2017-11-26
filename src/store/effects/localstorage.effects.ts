import { Storage } from "@ionic/storage";
import { Action } from "@ngrx/store";
import { Actions, toPayload, Effect } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

import * as LocalStorageActions from "./../actions/localstorage.actions";
import * as FavoritesActions from "./../actions/favorites.actions";
import * as UISectionsActions from "./../actions/ui-sections.actions";
import { LocalStorage, defaultLocalStorage } from "../models/LocalStorage";
import { SectionType } from "../models/Section";

const STORE_KEY = "varsom-store";

@Injectable()
export class LocalStorageEffects {
  private _stored = null;

  constructor(private _storage: Storage, private _actions$: Actions) {}

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
        new FavoritesActions.AddAction(val.favoritesAreaIds)
      ]);
    });
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
      return "FloodLandslide";
  }
};
