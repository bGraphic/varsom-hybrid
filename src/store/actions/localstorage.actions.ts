import { Action } from "@ngrx/store";

export const GET = "[Local Storage] Get";
export const SET = "[Local Storage] Set";

export class GetAction implements Action {
  readonly type = GET;
  constructor() {}
}

export class SetAction implements Action {
  readonly type = SET;
  constructor(public payload: {}) {}
}

export type All = GetAction | SetAction;
