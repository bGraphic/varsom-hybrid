import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { StorageService } from "./storage";
import { DataService } from "./data";

@Injectable()
export class FavoriteService {

  private _pushToken$ = new BehaviorSubject<string>(null);
  private _favoriteAreasWithStatus$ = new BehaviorSubject<{ areaId: string, active: boolean }[]>([]);
  private _favoriteChanges$ = new Subject<{ type:string, areaIds: string[] }>();

  get favoriteAreaIds$():Observable<string[]> {
    return this._favoriteAreasWithStatus$
      .map(items => this._transformsItemsToActiveAreaIds(items));
  }

  get pushToken$() {
    return this._pushToken$
      .filter(token => {
        return !!token
      })
      .distinctUntilChanged();
  }

  set pushToken(token:string) {
    console.log("FavoriteService: Push token set to", token);
    this._pushToken$.next(token)
  }

  constructor(

    private _storageService: StorageService,
    private _dataService: DataService

  ) {

    this._watchChangesToFavoriteAreaIds();
    this._watchInitialStoredFavoriteValuesAndSaveChanges();
    this._importParseFavorited();

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

  private _watchChangesToFavoriteAreaIds() {

    this._favoriteChanges$
      .subscribe(change => {
        console.log("FavoriteService: Change in favorites: ", change.type, JSON.stringify(change.areaIds));

        let areas = this._favoriteAreasWithStatus$.getValue();
        let setToActive = 'REMOVE' !== change.type;
        let overrideExistingStatus = 'ADD' === change.type || 'REMOVE' == change.type; // Do not override when change type is PARSE or SAVED

        areas = this._changeStatusOfAreas(areas, change.areaIds, setToActive, overrideExistingStatus);

        this._favoriteAreasWithStatus$.next(areas);
      });
  }

  private _watchInitialStoredFavoriteValuesAndSaveChanges() {

    this._storageService.favorites$
      .subscribe(favorites => {
        if (!this._pushToken$.getValue()) {
          this._pushToken$.next(favorites.pushToken);
        }

        this._favoriteChanges$.next({ type: 'SAVED', areaIds: favorites.areaIds});
      });

    this.favoriteAreaIds$
      .merge(this.pushToken$)
      .subscribe(value => {

        this._storageService.favorites = {
          pushToken: this._pushToken$.getValue(),
          areaIds: this._transformsItemsToActiveAreaIds(this._favoriteAreasWithStatus$.getValue())
        };

        this._updateSubscriptions(this._favoriteAreasWithStatus$.getValue(), this._pushToken$.getValue());

      });
  }

  private _transformsItemsToActiveAreaIds(items: {areaId: string, active: boolean}[]) {
    let activeItems = items.filter(item => { return item.active });
    let transformedItems = activeItems.map(item => { return item.areaId });
    return transformedItems;
  }

  private _updateSubscriptions(areasWithStatus: { areaId: string, active: boolean }[], token: string ) {
    console.log("FavoriteService: Update subscriptions", token, JSON.stringify(areasWithStatus));

    for(let area of areasWithStatus) {
      if(area.active) {
        this._dataService.addPushTokenForArea(token, area.areaId);
      } else {
        this._dataService.removePushTokenForArea(token, area.areaId);
      }
    }
  }

  private _changeStatusOfAreas(areas:{ areaId: string, active: boolean }[], areaIds: string[], active: boolean, overrideExisting = true ):{ areaId: string, active: boolean }[] {
    console.log("FavoriteService: Change active state of areas to", active, JSON.stringify(areaIds), overrideExisting);

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

  private _importParseFavorited() {

    this._storageService.parseImportDone$
      .filter(isImported => {
        return !isImported;
      })
      .concatMap(isImported => {
        console.log("FavoritesService: Import parse favorites");
        this._storageService.parseImportDone = true;
        return this.pushToken$.filter( token => { return !!token });
      })
      .concatMap(token => {
        return this._dataService.getParseFavorites(token).first()
      })
      .subscribe(parseFavorites => {
        this._favoriteChanges$.next( { type: 'PARSE', areaIds: parseFavorites });
      });

  }
}
