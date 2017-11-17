import { Action } from "@ngrx/store";
import { ForecastType, Warning } from "../models/Warning";

export const FETCH = "[Warnings] Fetch";
export const FETCH_COMPLETE = "[Warnings] Fetch Complete";
export const FETCH_ERROR = "[Warnings] Fetch Error";

export interface FetchPayload {
  warningType: ForecastType;
}

export interface FetchCompletePayload {
  warningType: ForecastType;
  warnings: Warning[];
}

export interface FetchErrorPayload {
  warningType: ForecastType;
  error: any;
}

export class FetchAction implements Action {
  readonly type = FETCH;
  constructor(payload: FetchPayload) {}
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
