import { Action } from '@ngrx/store';

export const SAVE = '[LocalStorage] Save';
export const SAVE_SUCESS = '[LocalStorage] Save Sucess';
export const SAVE_FAIL = '[LocalStorage] Save Fail';
export const LOAD = '[LocalStorage] Load';
export const LOAD_SUCESS = '[LocalStorage] Load Sucess';
export const LOAD_FAIL = '[LocalStorage] Load Fail';

export interface LocalData {
  rootSection: string,
  favoritesAreaIds: string[],
  pushToken: string,
  lastNotifiedAppVersion: string
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class SaveAction implements Action {
  readonly type = SAVE;

  constructor(public payload: LocalData) { }
}

export class SaveSucessAction implements Action {
  readonly type = SAVE_SUCESS;

  constructor(public payload: LocalData) { }
}

export class SaveFailAction implements Action {
  readonly type = SAVE_FAIL;

  constructor(public payload: any) { }
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor() { }
}

export class LoadSucessAction implements Action {
  readonly type = LOAD_SUCESS;

  constructor(public payload: LocalData) { }
}

export class LoadFailAction implements Action {
  readonly type = LOAD_FAIL;

  constructor(public payload: any) { }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = SaveAction
  | SaveSucessAction
  | SaveFailAction
  | LoadAction
  | LoadSucessAction
  | LoadFailAction;