import { Action } from "@ngrx/store";
import { RegionType, Region } from "../models/Region";

export const FETCH = "[Regions] Fetch";
export const FETCH_COMPLETE = "[Regions] Fetch Complete";
export const FETCH_ERROR = "[Regions] Fetch Error";

export class FetchAction implements Action {
  readonly type = FETCH;
  constructor(
    public payload: {
      regionType: RegionType;
    }
  ) {}
}

export class FetchCompleteAction implements Action {
  readonly type = FETCH_COMPLETE;
  constructor(
    public payload: {
      regionType: RegionType;
      regions: Region[];
    }
  ) {}
}

export class FetchErrorAction implements Action {
  readonly type = FETCH_ERROR;
  constructor(
    public payload: {
      regionType: RegionType;
      error: any;
    }
  ) {}
}

export type All = FetchAction | FetchCompleteAction | FetchErrorAction;
