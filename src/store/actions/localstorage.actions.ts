import { Action } from "@ngrx/store";
import { LocalStorage } from "../models/LocalStorage";

export const GET = "[Local Storage] Get";
export const LISTEN = "[Local Storage] Listen";
export const SET = "[Local Storage] Set";

export class GetAction implements Action {
  readonly type = GET;
  constructor() {}
}

export class ListenAction implements Action {
  readonly type = LISTEN;
  constructor() {}
}

export class SetAction implements Action {
  readonly type = SET;
  constructor(public payload: LocalStorage) {}
}

export type All = GetAction | SetAction;
