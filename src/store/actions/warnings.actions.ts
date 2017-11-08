import { Action } from "@ngrx/store";
import { ForecastType, Forecast } from "../models/Forecast";

export const FETCH = "[Forecasts] Fetch";
export const FETCH_COMPLETE = "[Forecasts] Fetch Complete";
export const FETCH_ERROR = "[Forecasts] Fetch Error";

export class FetchAction implements Action {
  readonly type = FETCH;
  constructor(
    public payload: {
      forecastType: ForecastType;
    }
  ) {}
}

export class FetchCompleteAction implements Action {
  readonly type = FETCH_COMPLETE;
  constructor(
    public payload: {
      forecastType: ForecastType;
      forecasts: Forecast[];
    }
  ) {}
}

export class FetchErrorAction implements Action {
  readonly type = FETCH_ERROR;
  constructor(
    public payload: {
      forecastType: ForecastType;
      error: any;
    }
  ) {}
}

export type All = FetchAction | FetchCompleteAction | FetchErrorAction;
