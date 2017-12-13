import { Action } from "@ngrx/store";
import { SectionType } from "../models/Section";

export const FETCH_ALL = "[Geojson] Fetch All";
export const FETCH = "[Geojson] Fetch";
export const FETCH_COMPLETE = "[Geojson] Fetch Complete";
export const FETCH_ERROR = "[Geojson] Fetch Error";

export class FetchAllAction implements Action {
  readonly type = FETCH_ALL;
  constructor() {}
}

export class FetchAction implements Action {
  readonly type = FETCH;
  constructor(
    public payload: {
      sectionType: SectionType;
    }
  ) {}
}

export class FetchCompleteAction implements Action {
  readonly type = FETCH_COMPLETE;
  constructor(
    public payload: {
      sectionType: SectionType;
      features: any[];
    }
  ) {}
}

export class FetchErrorAction implements Action {
  readonly type = FETCH_ERROR;
  constructor(
    public payload: {
      sectionType: SectionType;
      error: any;
    }
  ) {}
}

export type All =
  | FetchAllAction
  | FetchAction
  | FetchCompleteAction
  | FetchErrorAction;
