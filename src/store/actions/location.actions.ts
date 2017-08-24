import { Action } from '@ngrx/store';
import { Coords } from '../models/location';

export const COORDS_UPDATED = '[Location] Coords updated';

export class CoordsUpdated implements Action {
  readonly type = COORDS_UPDATED;
  constructor(public payload: Coords) { }
}

export type All
  = CoordsUpdated;