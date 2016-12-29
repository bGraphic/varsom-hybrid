import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { Observable, BehaviorSubject } from "rxjs";

@Injectable()
export class Favorites {
  private readonly FAVORITES_KEY = 'favorites';
  private _favorites$ = new BehaviorSubject<string[]>([]);

  constructor(private _storage: Storage) {
    this._fetchFavorites();
  }

  get favorites$():Observable<string[]> {
    return this._favorites$.asObservable();
  }

  addFavoriteArea(areaId: string) {
    let favorites = this._favorites$.getValue();
    let areaAlreadyFavorite = favorites.filter(favorite => favorite === areaId).length > 0;
    if(!areaAlreadyFavorite) {
      favorites.push(areaId);
      this._favorites$.next(favorites);
    };
  }

  addFavoriteAreas(areaIds: string[]) {
    for(let areaId of areaIds) {
      this.addFavoriteArea(areaId);
    }
  }

  private _fetchFavorites() {
    this._storage.get(this.FAVORITES_KEY)
      .then(
        favorites => {
          console.log("Favorites: Fetched favorites", favorites);
          if(favorites) {
            this.addFavoriteAreas(favorites);
          }
          this._favorites$
            .distinctUntilChanged()
            .subscribe(
              favorites => {
                this._saveFavorites(favorites);
              }
            );
        },
        error => {
          console.error("Favorites: error fetching favorites", error)
        }
      );
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
