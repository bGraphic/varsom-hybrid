import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import {Observable, BehaviorSubject, Subject} from "rxjs";
import { DataService } from "./data";

@Injectable()
export class FavoriteService {

  private readonly FAVORITES_KEY = 'FAVORITES';
  private readonly TOKEN_KEY = 'TOKEN';
  private _pushTokens$ = new BehaviorSubject<{ oldTokens: string[], activeToken: string }>( { oldTokens: [], activeToken: null } );
  private _pushTokensChanges$ = new Subject<{ type:string, token: string }>();
  private _favoriteAreasWithStatus$ = new BehaviorSubject<{ areaId: string, active: boolean }[]>([]);
  private _favoriteChanges$ = new Subject<{ type:string, areaIds: string[] }>();

  constructor(
    private _platform: Platform,
    private _storage: Storage,
    private _dataService: DataService)
  {

    this._platform.ready().then(() => {

      this._initFavorites();
      this._initSubscription();

    });

  }

  private _initFavorites() {

    this._fetchFromStorage(this.FAVORITES_KEY)
      .map(favorites => {
        if(!favorites) {
          favorites = [];
        }
        return { type: "SAVED", areaIds: favorites }
      })
      .merge(this._favoriteChanges$)
      .subscribe(change => {

        console.log("FavoriteService: Change in favorites: ", change.type, change.areaIds);
        let areas = this._favoriteAreasWithStatus$.getValue();

        if('ADD' === change.type) {
          areas = this._changeStatusOfAreas(areas, change.areaIds, true);
        } else if('REMOVE' === change.type) {
          areas = this._changeStatusOfAreas(areas, change.areaIds, false);
        } else if('SAVED' == change.type) {
          areas = this._changeStatusOfAreas(areas, change.areaIds, true, false);
          this.favoriteAreaIds$
            .subscribe(areaIds => {
              this._saveToStorage(this.FAVORITES_KEY, areaIds)
            });
        }

        this._favoriteAreasWithStatus$.next(areas);
      });
  }

  private _initSubscription() {

    this._fetchFromStorage(this.TOKEN_KEY)
      .map(token => {
        return { type: "SAVED", token: token }
      })
      .merge(this._pushTokensChanges$)
      .subscribe(change => {

        console.log("FavoriteService: Change in token: ", change.type, change.token);
        let pushTokens = this._pushTokens$.getValue();

        if('NEW' === change.type) {

          if(pushTokens.activeToken !== change.token) {
            if(pushTokens.activeToken) {
              pushTokens.oldTokens.push(pushTokens.activeToken);
            }
            pushTokens.activeToken = change.token;
          }

        } else if('SAVED' == change.type) {

          if(!pushTokens.activeToken) {
            pushTokens.activeToken = change.token;
          } else if (pushTokens.activeToken !== change.token) {
            pushTokens.oldTokens.push(change.token);
          }

          this._pushTokens$
            .map(tokens => {
              return tokens.activeToken;
            })
            .subscribe(activeToken => {
              this._saveToStorage(this.TOKEN_KEY, activeToken)
            });
        }

        this._updateSubscriptions(this._favoriteAreasWithStatus$.getValue(), pushTokens);
        this._pushTokens$.next(pushTokens);
      });

    this._favoriteAreasWithStatus$
      .filter(areasWithStatus => {
        return areasWithStatus.length > 0;
      })
      .subscribe(areasWithStatus => {
        this._updateSubscriptions(areasWithStatus, this._pushTokens$.getValue());
      })
  }

  get favoriteAreaIds$():Observable<string[]> {
    return this._favoriteAreasWithStatus$.asObservable()
      .map(items => this._transformsItemsToActiveAreaIds(items));
  }

  setPushToken(token:string) {
   this._pushTokensChanges$.next({ type: 'NEW', token: token});
  }

  isFavoriteArea$(areaId):Observable<boolean> {
    return this.favoriteAreaIds$
      .map(favorites => {
        return favorites.indexOf(areaId) > -1;
      })
  }

  addFavoriteArea(areaId: string) {
    this._favoriteChanges$.next({ type: 'ADD', areaIds: [ areaId ] });
  }

  removeFavoriteArea(areaId: string) {
    this._favoriteChanges$.next({ type: 'REMOVE', areaIds: [ areaId ] });
  }

  private _transformsItemsToActiveAreaIds(items: {areaId: string, active: boolean}[]) {
    let activeItems = items.filter(item => { return item.active });
    let transformedItems = activeItems.map(item => { return item.areaId });
    return transformedItems;
  }

  private _updateSubscriptions(areasWithStatus: { areaId: string, active: boolean }[], tokens: { oldTokens: string[], activeToken: string }) {
    console.log("FavoriteService: Update subscriptions", tokens, areasWithStatus);

    for(let area of areasWithStatus) {
      for(let oldToken of tokens.oldTokens) {
        this._dataService.removePushTokenForArea(oldToken, area.areaId);
      }

      if(area.active) {
        this._dataService.addPushTokenForArea(tokens.activeToken, area.areaId);
      } else {
        this._dataService.removePushTokenForArea(tokens.activeToken, area.areaId);
      }
    }
  }

  private _changeStatusOfAreas(areas:{ areaId: string, active: boolean }[], areaIds: string[], active: boolean, overrideExisting = true ):{ areaId: string, active: boolean }[] {
    for(let areaId of areaIds) {
      let area = areas.find(item => { return item.areaId === areaId});
      if(area && overrideExisting) {
        area.active = active;
      } else if(!area) {
        area = { areaId: areaId, active: active};
        areas.push(area);
      }
    }
    return areas;
  }

  private _fetchFromStorage(key:string) {
    return Observable
      .fromPromise(this._storage.get(key))
      .map(value => {
        console.log("FavoriteService: Fetched", key, value);
        return value;
      });
  }

  private _saveToStorage(key:string, value:any) {
    this._storage.set(key, value)
      .then(
        () => {
          console.log("FavoriteService: Saved", key, value);
        },
        error => {
          console.error("FavoriteService: Error storing", key, value);
        }
      );
  }
}
