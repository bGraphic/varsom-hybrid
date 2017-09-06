import { Action } from '@ngrx/store';

import { Position } from './../models/Location';

export const TOOGLE_FULLSCREEN = '[UI Map] Toogle Fullscreen';
export const CENTER_ON_MARKER = '[UI Map] Center On Marker';
export const MAP_MOVED = '[UI Map] Map Moved';
export const ZOOM_UPDATED = '[UI Map] Zoom Updated';

export class ToogleFullscreen implements Action {
  readonly type = TOOGLE_FULLSCREEN;
  constructor(public payload: { mapKey: string }) { }
}

export class CenterOnMarker implements Action {
  readonly type = CENTER_ON_MARKER;
  constructor(public payload: { mapKey: string }) { }
}

export class MapMoved implements Action {
  readonly type = MAP_MOVED;
  constructor(public payload: { mapKey: string }) { }
}

export class ZoomUpdated implements Action {
  readonly type = ZOOM_UPDATED;
  constructor(public payload: { mapKey: string, zoom: number }) { }
}

export type All
  = ToogleFullscreen
  | CenterOnMarker
  | MapMoved
  | ZoomUpdated;