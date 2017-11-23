import { Action } from "@ngrx/store";
import { Region } from "../models/Region";
import { SectionType } from "../models/Section";

export const FETCH = "[Regions] Fetch";
export const FETCH_COMPLETE = "[Regions] Fetch Complete";
export const FETCH_ERROR = "[Regions] Fetch Error";
export const SELECT = "[Regions] Select region type or region";

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
      regions: Region[];
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

export type All = FetchAction | FetchCompleteAction | FetchErrorAction;
