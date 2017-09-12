import { Action } from '@ngrx/store';
import { Position, PositionError } from '../models/Location'

export const WATCH_POSITION = '[Location] Watch Position';
export const POSITION_SUCCESS = '[Location] Position Sucess';
export const POSITION_ERROR = '[Location] Position Error';

export class WatchPosition implements Action {
  readonly type = WATCH_POSITION;
  constructor() { }
}

export class PositionSucceeded implements Action {
  readonly type = POSITION_SUCCESS;
  constructor(public payload: Position) { }
}

export class PositionFailed implements Action {
  readonly type = POSITION_ERROR;
  constructor(public payload: PositionError) { }
}

export type All
  = WatchPosition
  | PositionSucceeded
  | PositionFailed;