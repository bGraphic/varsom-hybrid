import { Action } from '@ngrx/store';

export const TOOGLE_FULLSCREEN = '[UI Map] Toogle Fullscreen';

export class ToogleFullscreen implements Action {
  readonly type = TOOGLE_FULLSCREEN;
  constructor(public payload: string) { }
}

export type All
  = ToogleFullscreen;