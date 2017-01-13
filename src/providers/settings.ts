import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { Storage } from '@ionic/storage';

@Injectable()
export class SettingService {

  private readonly ACTIVE_SECTION = 'SETTINGS.ACTIVE_SECTION';
  private readonly ACTIVE_FLOOD_LANDSLIDE_SEGMENT_KEY = 'SETTINGS.ACTIVE_FLOOD_LANDSLIDE_SEGMENT_KEY';

  private _activeSection$ = new BehaviorSubject<string>(null);
  private _activeFloodLandslideSegment$ = new BehaviorSubject<string>(null);
  private _currentPosition$ = new BehaviorSubject({ latLng: L.latLng(64.871, 16.949), zoom: 4 });

  constructor (
    public platform: Platform,
    private _storage: Storage
  ) {

    this.platform.ready().then(() => {
      let subscription = Geolocation.watchPosition()
        .filter((p:any) => {
          return p.code === undefined; //Filter Out Errors
        })
        .map((p:any) => {
          return { latLng: L.latLng(p.coords.latitude, p.coords.longitude), zoom: 6 }
        })
        .subscribe((p:{ latLng: L.LatLng, zoom: number }) => {
          this._currentPosition$.next(p);
          subscription.unsubscribe();
        });
    });

    let activeFloodLandslideSegmentSave$ = this._activeFloodLandslideSegment$
      .distinctUntilChanged()
      .skip(1)
      .map(segment => {
        return { key: this.ACTIVE_FLOOD_LANDSLIDE_SEGMENT_KEY, value: segment };
      });

    let activeSectionSave$ = this._activeSection$
      .distinctUntilChanged()
      .skip(1)
      .map(section => {
        return { key: this.ACTIVE_SECTION, value: section };
      });

    activeSectionSave$
      .merge(activeFloodLandslideSegmentSave$)
      .subscribe(item => {
        this._saveSetting(item.key, item.value);
      });

    this._fetchSavedValue(this.ACTIVE_SECTION)
      .subscribe(value => {
        if(!this._activeSection$.getValue()) {
          this._activeSection$.next(value);
        }
      });

    this._fetchSavedValue(this.ACTIVE_FLOOD_LANDSLIDE_SEGMENT_KEY)
      .subscribe(value => {
        this._activeFloodLandslideSegment$.next(value)
      });

  }

  get activeFloodLandslideSegment$():Observable<string> {
    return this._activeFloodLandslideSegment$.asObservable().distinctUntilChanged();
  }

  set activeFloodLandslideSegment(forecastType: string) {
    this._activeFloodLandslideSegment$.next(forecastType);
  }

  get activeSection$():Observable<string> {
    return this._activeSection$.asObservable().distinctUntilChanged();
  }

  set activeSection(forecastType: string) {
    this._activeSection$.next(forecastType);
  }

  get currentPosition$():Observable<{ latLng: L.LatLng, zoom: number }> {
    return this._currentPosition$.asObservable();
  }

  private _fetchSavedValue(key):Observable<string> {
    return Observable
      .fromPromise(this._storage.get(key))
      .map(value => {
        if(!value) {
          if(this.ACTIVE_FLOOD_LANDSLIDE_SEGMENT_KEY === key) {
            return 'highest';
          } else if(this.ACTIVE_SECTION === key) {
            return 'FLOOD_LANDSLIDE';
          }
        } else {
          return value;
        }
      })
  }

  private _saveSetting(key, value) {
    this._storage.set(key, value)
      .then(
        () => {
          console.log("SettingsService: Saved", key, value);
        },
        error => {
          console.error("SettingsService: Error storing", key, value);
        }
      );
  }

}
