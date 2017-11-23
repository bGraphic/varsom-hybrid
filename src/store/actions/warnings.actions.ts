import { Action } from "@ngrx/store";
import { WarningType, Warning } from "../models/Warning";

export const FETCH = "[Warnings] Fetch";
export const FETCH_COMPLETE = "[Warnings] Fetch Complete";
export const FETCH_ERROR = "[Warnings] Fetch Error";

export interface FetchPayload {
  warningType: WarningType;
}

export interface FetchCompletePayload {
  warningType: WarningType;
  warnings: Warning[];
}

export interface FetchErrorPayload {
  warningType: WarningType;
  error: any;
}

export class FetchAction implements Action {
  readonly type = FETCH;
  constructor(public payload: FetchPayload) {}
}

export class FetchCompleteAction implements Action {
  readonly type = FETCH_COMPLETE;
  constructor(public payload: FetchCompletePayload) {}
}

export class FetchErrorAction implements Action {
  readonly type = FETCH_ERROR;
  constructor(public payload: FetchErrorPayload) {}
}

export type All = FetchAction | FetchCompleteAction | FetchErrorAction;
