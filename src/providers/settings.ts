import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import { Platform } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { TranslateService } from 'ng2-translate';

@Injectable()
export class SettingService {

  private readonly ACTIVE_FLOOD_LANDSLIDE_SEGMENT_KEY = 'ACTIVE_FLOOD_LANDSLIDE_SEGMENT_KEY';

  private _activeFloodLandslideSegment$ = new BehaviorSubject<string>(null);
  private _currentPosition$ = new BehaviorSubject({ latLng: L.latLng(64.871, 16.949), zoom: 4 });
  private _sections: {titleKey: string, icon: string, active:boolean, component: any }[];

  constructor (
    public platform: Platform,
    private _translateService: TranslateService,
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

    this._activeFloodLandslideSegment$
      .skip(1)
      .subscribe(value => {
        this._saveSetting(this.ACTIVE_FLOOD_LANDSLIDE_SEGMENT_KEY, value);
      });

    this._fetchSavedValue(this.ACTIVE_FLOOD_LANDSLIDE_SEGMENT_KEY)
      .subscribe(value => {
        this._activeFloodLandslideSegment$.next(value)
      });

  }

  get activeFloodLandslideSegment$():Observable<string> {
    return this._activeFloodLandslideSegment$.asObservable();
  }

  set activeFloodLandslideSegment(forecastType: string) {
    this._activeFloodLandslideSegment$.next(forecastType);
  }

  get currentPosition$():Observable<{ latLng: L.LatLng, zoom: number }> {
    return this._currentPosition$.asObservable();
  }

  set sections(sections: { titleKey: string, icon: string, active:boolean, component: any }[]) {
    this._sections = sections;
  }

  get sections():{ titleKey: string, icon: string, active:boolean, component: any }[] {
    return this._sections;
  }

  setActiveSection(sectionKey: string) {
    for(let section of this._sections ) {
      if(section.titleKey === sectionKey) {
        section.active = true;
      } else {
        section.active = false;
      }
    }
  }

  private _fetchSavedValue(key):Observable<string> {
    return Observable
      .fromPromise(this._storage.get(key))
      .map(value => {
        if(!value) {
          if(this.ACTIVE_FLOOD_LANDSLIDE_SEGMENT_KEY === key) {
            return 'highest';
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
