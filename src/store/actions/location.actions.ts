import { Action } from '@ngrx/store';

export const FETCH_POSITION = '[Location] Fetch Position';
export const POSITION_SUCCESS = '[Location] Position Sucess';
export const POSITION_ERROR = '[Location] Position Error';

export class FetchPosition implements Action {
  readonly type = FETCH_POSITION;
  constructor() { }
}

export class PositionSucess implements Action {
  readonly type = POSITION_SUCCESS;
  constructor(public payload: { latitude: number, longitude: number, timestamp: Date }) { }
}

export class PositionError implements Action {
  readonly type = POSITION_ERROR;
  constructor(public payload: Error) { }
}

export type All
  = FetchPosition
  | PositionSucess
  | PositionError;