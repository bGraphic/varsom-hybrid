import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/rx';
import { of } from 'rxjs/observable/of';

import * as fromRoot from './../reducers';
import * as localStorage from './../actions/local-storage.actions';

const STORAGE_KEY = 'varsom-store';

const defaultLocalData: localStorage.LocalData = {
  rootSection: '',
  favoritesAreaIds: [],
  pushToken: '',
  lastNotifiedAppVersion: '0.0.0'
}

@Injectable()
export class LocalStorageEffects {

  constructor(
    private _actions$: Actions,
    private _store: Store<fromRoot.State>,
    private _localStorage: Storage,
  ) { 

    Observable.combineLatest(
      this._store.select(fromRoot.getFavoriteAreaIds),
      this._store.select(fromRoot.getFavoritePushToken),
      this._store.select(fromRoot.getActiveSection),
      this._store.select(fromRoot.getLastNotifiedAppVersion),
      (favoritesAreaIds, pushToken, rootSection, lastNotifiedAppVersion) => (<localStorage.LocalData>{ favoritesAreaIds, pushToken, rootSection, lastNotifiedAppVersion })
    )
    .skipUntil(this._store.select(fromRoot.getLocalStorageLoaded).filter(loaded => loaded))
    .subscribe((data) => {
      this._store.dispatch(new localStorage.SaveAction(data));
    });
  }

  @Effect() 
  loadLocalData$: Observable<Action> = this._actions$
    .ofType(localStorage.LOAD)
    .startWith(localStorage.LOAD)
    .switchMap(() => {
      return Observable.fromPromise(
        this._localStorage.ready()
      )
    })
    .switchMap(() => {
      return Observable.fromPromise(
        this._localStorage.get(STORAGE_KEY)
      )
    })
    .map((data: localStorage.LocalData) => {
      return new localStorage.LoadSucessAction(Object.assign({}, defaultLocalData, data));
    })
    .catch(error => of(new localStorage.LoadFailAction(error)));
  
  @Effect() 
  saveLocalData$: Observable<Action> = this._actions$
    .ofType(localStorage.SAVE)
    .map(toPayload)
    .switchMap((data: localStorage.LocalData) => {
      return Observable.fromPromise( 
        this._localStorage.set(STORAGE_KEY, data)
      )
    })
    .map((data: localStorage.LocalData) => {
      return new localStorage.SaveSucessAction(data);
    })
    .catch(error => of(new localStorage.SaveFailAction(error)));
}