import { Action } from '@ngrx/store';

export const ADD = '[Favorite] Add';
export const REMOVE = '[Favorite] Remove';
export const TOOGLE = '[Favorite] Toogle';

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class AddAction implements Action {
  readonly type = ADD;

  constructor(public payload: string) { }
}

export class RemoveAction implements Action {
  readonly type = REMOVE;

  constructor(public payload: string) { }
}

export class ToggleAction implements Action {
  readonly type = TOOGLE;

  constructor(public payload: string) { }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = AddAction
  | RemoveAction
  | ToggleAction;