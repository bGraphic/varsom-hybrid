import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Coords } from '../models/location';

@Injectable()
export class LocationActions {

  static COORDS_UPDATED = '[ LocationActions ] Coords updated';
  newCoords(coords: Coords): Action {
    return {
      type: LocationActions.COORDS_UPDATED,
      payload: coords
    }
  }
}