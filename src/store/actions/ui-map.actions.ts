import { Action } from "@ngrx/store";

export const TOOGLE_FULLSCREEN = "[UI Map] Toogle Fullscreen";
export const REQUEST_RECENTER = "[UI Map] Request Recenter";
export const IS_CENTERED_UPDATE = "[UI Map] Is Centered Update";
export const OFFSET_UPDATE = "[UI Map] Offset Update";

export class ToogleFullscreen implements Action {
  readonly type = TOOGLE_FULLSCREEN;
  constructor() {}
}

export class RequestRecenter implements Action {
  readonly type = REQUEST_RECENTER;
  constructor() {}
}

export class IsCenteredUpdate implements Action {
  readonly type = IS_CENTERED_UPDATE;
  constructor(public payload: { isCentered: boolean }) {}
}

export type All = ToogleFullscreen | RequestRecenter | IsCenteredUpdate;
