import { Action } from '@ngrx/store';

import { Position } from './../models/Location';

export const TOOGLE_FULLSCREEN = '[UI Map] Toogle Fullscreen';
export const RECENTER = '[UI Map] Recenter';
export const MOVED = '[UI Map] Moved';
export const ZOOM_UPDATED = '[UI Map] Zoom Updated';

export class ToogleFullscreen implements Action {
  readonly type = TOOGLE_FULLSCREEN;
  constructor(public payload: { mapKey: string }) { }
}

export class Recenter implements Action {
  readonly type = RECENTER;
  constructor(public payload: { mapKey: string }) { }
}

export class Moved implements Action {
  readonly type = MOVED;
  constructor(public payload: { mapKey: string }) { }
}

export class ZoomUpdated implements Action {
  readonly type = ZOOM_UPDATED;
  constructor(public payload: { mapKey: string, zoom: number }) { }
}

export type All
  = ToogleFullscreen
  | Recenter
  | Moved
  | ZoomUpdated;