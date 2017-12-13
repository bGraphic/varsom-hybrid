import { Action } from "@ngrx/store";
import { WarningType, Warning } from "../models/Warning";
import { SectionType } from "../models/Section";

export const FETCH_SECTION = "[Warnings] Fetch All";
export const FETCH_WARNING_TYPE = "[Warnings] Fetch Warning Type";
export const FETCH_COMPLETE = "[Warnings] Fetch Complete";
export const FETCH_ERROR = "[Warnings] Fetch Error";

export class FetchSectionAction implements Action {
  readonly type = FETCH_SECTION;
  constructor(
    public payload: {
      section: SectionType;
    }
  ) {}
}

export class FetchWarningTypeAction implements Action {
  readonly type = FETCH_WARNING_TYPE;
  constructor(
    public payload: {
      warningType: WarningType;
    }
  ) {}
}

export class FetchCompleteAction implements Action {
  readonly type = FETCH_COMPLETE;
  constructor(
    public payload: {
      warningType: WarningType;
      warnings: Warning[];
    }
  ) {}
}

export class FetchErrorAction implements Action {
  readonly type = FETCH_ERROR;
  constructor(
    public payload: {
      warningType: WarningType;
      error: any;
    }
  ) {}
}

export type All =
  | FetchSectionAction
  | FetchWarningTypeAction
  | FetchCompleteAction
  | FetchErrorAction;
