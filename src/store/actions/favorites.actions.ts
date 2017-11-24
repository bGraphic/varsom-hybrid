import { Action } from "@ngrx/store";
import { SectionType } from "../models/Section";

export const ADD = "[Favorites] Add";
export const REMOVE = "[Favorites] Remove";

export class AddAction implements Action {
  readonly type = ADD;
  constructor(public payload: string | string[]) {}
}

export class RemoveAction implements Action {
  readonly type = REMOVE;
  constructor(public payload: string | string[]) {}
}

export type All = AddAction | RemoveAction;
