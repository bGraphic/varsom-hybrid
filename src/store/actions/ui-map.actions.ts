import { Action } from "@ngrx/store";

import { Position } from "./../models/Location";

export const TOOGLE_FULLSCREEN = "[UI Map] Toogle Fullscreen";
export const REQUEST_RECENTER = "[UI Map] Request Recenter";
export const IS_CENTERED_UPDATE = "[UI Map] Is Centered Update";

export class ToogleFullscreen implements Action {
  readonly type = TOOGLE_FULLSCREEN;
  constructor(public payload: { mapKey: string }) {}
}

export class RequestRecenter implements Action {
  readonly type = REQUEST_RECENTER;
  constructor(public payload: { mapKey: string }) {}
}

export class IsCenteredUpdate implements Action {
  readonly type = IS_CENTERED_UPDATE;
  constructor(public payload: { mapKey: string; isCentered: boolean }) {}
}

export type All = ToogleFullscreen | RequestRecenter | IsCenteredUpdate;
