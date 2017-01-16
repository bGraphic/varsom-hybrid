import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import {Observable, BehaviorSubject, Subject} from "rxjs";
import { DataService } from "./data";

@Injectable()
export class FavoriteService {

  private readonly FAVORITES_KEY = 'FAVORITES';
  private readonly TOKEN_KEY = 'TOKEN';
  private readonly IMPORTED_KEY = 'FAVORITES_IMPORTED';
  private _pushToken$ = new BehaviorSubject<string>( null );
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
      this._initParseImport();

    });

  }

  private _initFavorites() {

    this._favoriteChanges$
      .subscribe(change => {
        console.log("FavoriteService: Change in favorites: ", change.type, change.areaIds);

        let areas = this._favoriteAreasWithStatus$.getValue();
        let setToActive = 'REMOVE' !== change.type;
        let overrideExistingStatus = 'ADD' === change.type || 'REMOVE' == change.type; // Do not override when change type is PARSE or SAVED

        areas = this._changeStatusOfAreas(areas, change.areaIds, setToActive, overrideExistingStatus);

        this._favoriteAreasWithStatus$.next(areas);
      });

    this._fetchFromStorage(this.FAVORITES_KEY)
      .map(favorites => {
        return favorites ? favorites : [];
      })
      .concatMap(favorites => {
        this._favoriteChanges$.next({ type: "SAVED", areaIds: favorites });
        return this.favoriteAreaIds$;
      })
      .subscribe(areaIds => {
        this._saveToStorage(this.FAVORITES_KEY, areaIds);
      });
  }

  private _initSubscription() {

    this._pushToken$
      .filter( token => { return !!token })
      .distinctUntilChanged()
      .subscribe(token => {
        console.log("FavoriteService: Push token changed", token);
        this._updateSubscriptions(this._favoriteAreasWithStatus$.getValue(), token);
      });

    this._favoriteAreasWithStatus$
      .subscribe(areasWithStatus => {
        if(this._pushToken$.getValue()) {
          this._updateSubscriptions(areasWithStatus, this._pushToken$.getValue());
        }
      });

    this._fetchFromStorage(this.TOKEN_KEY)
      .concatMap(token => {
        if(!this._pushToken$.getValue()) {
          console.log("FavoriteService: Push token set to saved", token);
          this._pushToken$.next(token);
        }
        return this._pushToken$.filter( token => { return !!token }).distinctUntilChanged()
      })
      .subscribe(token => {
        this._saveToStorage(this.TOKEN_KEY, token);
      })

  }

  private _initParseImport() {

    this._fetchFromStorage(this.IMPORTED_KEY)
      .filter(imported => {
        return !imported;
      })
      .concatMap(imported => {
        this._saveToStorage(this.IMPORTED_KEY, true);
        return this._pushToken$.filter( token => { return !!token });
      })
      .concatMap(token => {
        return this._dataService.getParseFavorites(token).first()
      })
      .subscribe(parseFavorites => {
        this._favoriteChanges$.next( { type: 'PARSE', areaIds: parseFavorites });
      });

  }

  get favoriteAreaIds$():Observable<string[]> {
    return this._favoriteAreasWithStatus$.asObservable()
      .map(items => this._transformsItemsToActiveAreaIds(items));
  }

  setPushToken(token:string) {
    console.log("FavoriteService: Push token set to", token);
    this._pushToken$.next(token)
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

  private _updateSubscriptions(areasWithStatus: { areaId: string, active: boolean }[], token: string ) {
    console.log("FavoriteService: Update subscriptions", token, areasWithStatus);

    for(let area of areasWithStatus) {
      if(area.active) {
        this._dataService.addPushTokenForArea(token, area.areaId);
      } else {
        this._dataService.removePushTokenForArea(token, area.areaId);
      }
    }
  }

  private _changeStatusOfAreas(areas:{ areaId: string, active: boolean }[], areaIds: string[], active: boolean, overrideExisting = true ):{ areaId: string, active: boolean }[] {
    console.log("FavoriteService: Change status of areas", areaIds, active, overrideExisting);

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
