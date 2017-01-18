import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { StorageService } from "./storage";

@Injectable()
export class SettingService {

  private _activeSection$ = new Subject<string>();
  private _activeFloodLandslideSegment$ = new BehaviorSubject<string>('highest');

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

  constructor (
    private storageService: StorageService
  ) {

    storageService.rootSection$
      .subscribe(section => {
        this._activeSection$.next(section);
      });

    this.activeSection$
      .subscribe(activeSection => {
        storageService.rootSection = activeSection;
      });

  }

}
