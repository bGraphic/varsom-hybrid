import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { TranslateService } from 'ng2-translate';

@Injectable()
export class SettingService {

  private _currentForecastType = new BehaviorSubject<string>('highest');
  private _currentPosition$ = new BehaviorSubject({ latLng: L.latLng(64.871, 16.949), zoom: 4 });
  private _sections: {titleKey: string, icon: string, active:boolean, component: any }[];

  constructor (
    public platform: Platform,
    private _translateService: TranslateService
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

  }

  get currentForecastTypeObs():Observable<string> {
    return this._currentForecastType.asObservable();
  }

  set currentForecastType(forecastType: string) {
    this._currentForecastType.next(forecastType);
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

}
