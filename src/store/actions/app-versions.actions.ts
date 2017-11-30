import { Action } from "@ngrx/store";
import { AppVersionType, LatestAppVersion } from "../models/AppVersion";

export const FETCH = "[App Versions] Fetch";
export const FETCH_COMPLETE = "[App Versions] Fetch complete";
export const FETCH_ERROR = "[App Versions] Fetch Error";
export const NOTIFIED_USER = "[App Versions] Notifed user";

export class FetchAction implements Action {
  readonly type = FETCH;
  constructor(
    public payload: {
      appVersionType: AppVersionType;
    }
  ) {}
}

export class FetchCompleteAction implements Action {
  readonly type = FETCH_COMPLETE;
  constructor(
    public payload: {
      appVersionType: AppVersionType;
      appVersion: string | LatestAppVersion;
    }
  ) {}
}

export class FetchErrorAction implements Action {
  readonly type = FETCH_ERROR;
  constructor(
    public payload: {
      appVersionType: AppVersionType;
      error: any;
    }
  ) {}
}

export class NotfiedUserAction implements Action {
  readonly type = NOTIFIED_USER;
  constructor() {}
}

export type All =
  | FetchAction
  | FetchCompleteAction
  | FetchErrorAction
  | NotfiedUserAction;
