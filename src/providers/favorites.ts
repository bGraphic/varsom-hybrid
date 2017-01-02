import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import {Observable, BehaviorSubject, ReplaySubject} from "rxjs";

@Injectable()
export class Favorites {

  private readonly FAVORITES_KEY = 'favorites';
  private _favoriteAreaIds$ = new BehaviorSubject<string[]>([]);
  private _changeEvents$ = new ReplaySubject<{type:string, areaIds:string[]}>();

  constructor(private _storage: Storage) {

    this.favoriteAreaIds$.subscribe(favorites => {
      console.log("Favorites: Changed", favorites);
    });

    this._fetchInitialFavorites$()
      .concat(this._changeEvents$.publishReplay().refCount())
      .subscribe(event => {
        console.log("Favoriets: Event", event.type, event.areaIds);

        switch(event.type) {
          case 'initial':
            this._favoriteAreaIds$.next(event.areaIds);
            break;
          case 'add':
            this._addFavoriteArea(event.areaIds);
            break;
          case 'remove':
            this._removeFavoriteArea(event.areaIds);
            break;
        }

      });
  }

  get favoriteAreaIds$():BehaviorSubject<string[]> {
    return this._favoriteAreaIds$;
  }

  removeFavoriteArea(areaId: string) {
    this._changeEvents$.next({type:'remove', areaIds: [areaId]});
  }

  addFavoriteArea(areaId: string) {
    this._changeEvents$.next({type:'add', areaIds: [areaId]});
  }

  private _addFavoriteArea(areaIds: string[]) {
    let favorites = this._favoriteAreaIds$.getValue();
    let changed = false;
    for (let areaId of areaIds){
      let index = favorites.indexOf(areaId);
      if( index === -1) {
        favorites.push(areaId);
        changed = true;
      }
    }

    if(changed) {
      this._favoriteAreaIds$.next(favorites);
      this._saveFavorites(favorites);
    }
  }

  private _removeFavoriteArea(areaIds: string[]) {
    let favorites = this._favoriteAreaIds$.getValue();
    let changed = false;
    for (let areaId of areaIds){
      let index = favorites.indexOf(areaId);
      if( index > -1) {
        favorites = favorites.slice(0, index).concat(favorites.slice(index+1, favorites.length));
        changed = true;
      }
    }

    if(changed) {
      this._favoriteAreaIds$.next(favorites);
      this._saveFavorites(favorites);
    }
  }

  private _fetchInitialFavorites$():Observable<{type:string, areaIds:string[]}> {
    return Observable
      .fromPromise(this._storage.get(this.FAVORITES_KEY))
      .filter(favorites => {
        return !!favorites;
      })
      .map(favorites => {
        return { type: 'initial', areaIds: favorites}
      });
  }

  private _saveFavorites(favorites: string[]) {
    this._storage.set(this.FAVORITES_KEY, favorites)
      .then(
        () => {
          console.log("Favorites: Saved favorites", favorites);
        },
        error => {
          console.error('Favorites: Error storing favorites', error);
        }
      );
  }

}
