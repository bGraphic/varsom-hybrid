import { Action } from '@ngrx/store';

import { Position } from './../models/Location';

export const TOOGLE_FULLSCREEN = '[UI Map] Toogle Fullscreen';
export const CENTER_ON_MARKER = '[UI Map] Center On Marker';
export const CENTER_UPDATED = '[UI Map] Center Updated';
export const ZOOM_UPDATED = '[UI Map] Zoom Updated';

export class ToogleFullscreen implements Action {
  readonly type = TOOGLE_FULLSCREEN;
  constructor(public payload: { mapKey: string }) { }
}

export class CenterOnMarker implements Action {
  readonly type = CENTER_ON_MARKER;
  constructor(public payload: { mapKey: string }) { }
}

export class CenterUpdated implements Action {
  readonly type = CENTER_UPDATED;
  constructor(public payload: { mapKey: string, position: Position }) { }
}

export class ZoomUpdated implements Action {
  readonly type = ZOOM_UPDATED;
  constructor(public payload: { mapKey: string, zoom: number }) { }
}

export type All
  = ToogleFullscreen
  | CenterOnMarker
  | CenterUpdated
  | ZoomUpdated;