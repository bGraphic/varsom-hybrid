import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { Observable, Subject, BehaviorSubject } from "rxjs";

interface IStoredFavorites {
  pushToken: string;
  areaIds: string[];
}

interface IStoredValues {
  rootSection: string;
  pushToken: string;
  favoritesAreaIds: string[];
  parseImportDone: boolean;
  lastNotifiedAppVersion: string;
}

@Injectable()
export class StorageService {
  private readonly STORE_KEY = "varsom-store";
  private _newValues$ = new BehaviorSubject<any>({});
  private _storedValues$ = new Subject<IStoredValues>();
  private _defaultValues: IStoredValues = {
    rootSection: "FLOOD_LANDSLIDE",
    pushToken: null,
    favoritesAreaIds: [],
    parseImportDone: false,
    lastNotifiedAppVersion: "0.0.0"
  };

  get rootSection$(): Observable<string> {
    return this._storedValues$.map(values => {
      return values.rootSection;
    });
  }

  set rootSection(section: string) {
    this._newValues$.next(
      Object.assign(this._newValues$.getValue(), { rootSection: section })
    );
  }

  get favorites$(): Observable<IStoredFavorites> {
    return this._storedValues$.map(values => {
      return {
        areaIds: values.favoritesAreaIds,
        pushToken: values.pushToken
      };
    });
  }

  set favorites(favorites: IStoredFavorites) {
    this._newValues$.next(
      Object.assign(this._newValues$.getValue(), {
        pushToken: favorites.pushToken,
        favoritesAreaIds: favorites.areaIds
      })
    );
  }

  get parseImportDone$(): Observable<boolean> {
    return this._storedValues$.map(values => {
      return values.parseImportDone;
    });
  }

  set parseImportDone(isDone: boolean) {
    this._newValues$.next(
      Object.assign(this._newValues$.getValue(), { parseImportDone: isDone })
    );
  }

  get lastNotifiedAppVersion$(): Observable<string> {
    return this._storedValues$.map(values => {
      return values.lastNotifiedAppVersion;
    });
  }

  set lastNotifiedAppVersion(appVersion: string) {
    this._newValues$.next(
      Object.assign(this._newValues$.getValue(), {
        lastNotifiedAppVersion: appVersion
      })
    );
  }

  constructor(platform: Platform, storage: Storage) {
    platform.ready().then(() => {
      if (!platform.is("ios")) {
        this._saveContinously(storage);
      } else {
        this._saveOnPause(platform, storage);
      }

      this._loadValues(
        storage,
        this.STORE_KEY,
        this._storedValues$,
        this._defaultValues
      );
    });
  }

  private _saveOnPause(platform: Platform, storage: Storage) {
    Observable.combineLatest(
      this._storedValues$,
      this._newValues$,
      platform.pause
    ).subscribe(latest => {
      const [storedValues, newValues] = latest;
      this._saveValues(
        storage,
        this.STORE_KEY,
        Object.assign({}, storedValues, newValues)
      );
    });
  }

  private _saveContinously(storage: Storage) {
    Observable.combineLatest(this._storedValues$, this._newValues$).subscribe(
      latest => {
        const [storedValues, newValues] = latest;
        this._saveValues(
          storage,
          this.STORE_KEY,
          Object.assign({}, storedValues, newValues)
        );
      }
    );
  }

  private _loadValues(
    storage: Storage,
    key: string,
    storedValues$: Subject<IStoredValues>,
    defaultValues: IStoredValues
  ) {
    storage.get(key).then(
      values => {
        console.log("StorageService: Loaded", key, JSON.stringify(values));
        storedValues$.next(Object.assign({}, defaultValues, values));
      },
      error => {
        console.error("StorageService: Error loading", key);
      }
    );
  }

  private _saveValues(storage: Storage, key: string, values: IStoredValues) {
    storage.set(key, values).then(
      () => {
        console.log("StorageService: Saved", key, JSON.stringify(values));
      },
      error => {
        console.error("StorageService: Error storing", key, values);
      }
    );
  }
}
