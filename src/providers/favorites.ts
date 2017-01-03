import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, BehaviorSubject, ReplaySubject } from "rxjs";
import { DataService } from "./data";

@Injectable()
export class FavoriteService {

  private readonly FAVORITES_KEY = 'favorites';
  private readonly TOKEN_KEY = 'token';
  private _pushToken:string;
  private _favoriteAreaIds$ = new BehaviorSubject<string[]>([]);
  private _changeEvents$ = new ReplaySubject<{type:string, data:string[]}>();

  constructor(private _storage: Storage, private _dataService: DataService) {

    this._fetchInitialFavorites$()
      .concat(this._fetchSavedPushToken$())
      .concat(this._changeEvents$.publishReplay().refCount())
      .subscribe(event => {
        console.log("FavoriteService: Event", event.type, event.data);

        switch(event.type) {
          case 'token':
            this._updateToken(event.data[0]);
            break;
          case 'initial':
            this._favoriteAreaIds$.next(event.data);
            break;
          case 'add':
            this._addFavoriteAreas(event.data);
            break;
          case 'remove':
            this._removeFavoriteAreas(event.data);
            break;
        }

      });
  }

  get favoriteAreaIds$():Observable<string[]> {
    return this._favoriteAreaIds$.asObservable();
  }

  setPushToken(newToken:string) {
    this._changeEvents$.next({type: 'token', data:[newToken]});
  }

  isFavoriteArea$(areaId):Observable<boolean> {
    return this._favoriteAreaIds$
      .map(favorites => {
        return favorites.indexOf(areaId) > -1;
      })
  }

  removeFavoriteArea(areaId: string) {
    this._changeEvents$.next({type:'remove', data: [areaId]});
  }

  addFavoriteArea(areaId: string) {
    this._changeEvents$.next({type:'add', data: [areaId]});
  }

  private _addFavoriteAreas(areaIds: string[]) {
    let favorites = this._favoriteAreaIds$.getValue();
    let changed = false;
    for (let areaId of areaIds){
      let index = favorites.indexOf(areaId);
      if( index === -1) {
        favorites.push(areaId);
        this._dataService.addPushTokenForArea(this._pushToken, areaId);
        changed = true;
      }
    }

    if(changed) {
      this._favoriteAreaIds$.next(favorites);
      this._saveFavorites(favorites);
    }
  }

  private _removeFavoriteAreas(areaIds: string[]) {
    let favorites = this._favoriteAreaIds$.getValue();
    let changed = false;
    for (let areaId of areaIds){
      let index = favorites.indexOf(areaId);
      if( index > -1) {
        favorites = favorites.slice(0, index).concat(favorites.slice(index+1, favorites.length));
        this._dataService.removePushTokenForArea(this._pushToken, areaId);
        changed = true;
      }
    }

    if(changed) {
      this._favoriteAreaIds$.next(favorites);
      this._saveFavorites(favorites);
    }
  }

  private _fetchInitialFavorites$():Observable<{type:string, data:string[]}> {
    return Observable
      .fromPromise(this._storage.get(this.FAVORITES_KEY))
      .filter(favorites => {
        return !!favorites;
      })
      .map(favorites => {
        return { type: 'initial', data: favorites}
      });
  }

  private _saveFavorites(favorites: string[]) {
    this._storage.set(this.FAVORITES_KEY, favorites)
      .then(
        () => {
          console.log("FavoriteService: Saved favorites", favorites);
        },
        error => {
          console.error('FavoriteService: Error storing favorites', error);
        }
      );
  }

  private _updateToken(newToken: string) {
    if(this._pushToken === newToken) {
      return;
    }

    this._updatePushSubscriptions(newToken, this._pushToken);
    this._pushToken = newToken;
    this._saveToken(newToken);
  }

  private _updatePushSubscriptions(newToken: string, oldToken:string) {
    for(let areaId of this._favoriteAreaIds$.getValue()) {
      this._dataService.removePushTokenForArea(this._pushToken, areaId);
      this._dataService.addPushTokenForArea(newToken, areaId);
    }
  }

  private _fetchSavedPushToken$():Observable<{ type: string, data:string[] }> {
    return Observable
      .fromPromise(this._storage.get(this.TOKEN_KEY))
      .map(pushToken => {
        return { type: 'token', data: [pushToken] }
      });
  }

  private _saveToken(token: string) {
    this._storage.set(this.TOKEN_KEY, token)
      .then(
        () => {
          console.log("FavoriteService: Saved token", token);
        },
        error => {
          console.error('FavoriteService: Error storing token', token);
        }
      );
  }
}
