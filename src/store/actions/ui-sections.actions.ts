import { Action } from "@ngrx/store";
import { WarningType } from "../models/Warning";
import { SectionType } from "../models/Section";

export const SELECTED_SECTION = "[UI Sections] Selected Section";
export const SELECT_WARNING_TYPE = "[UI Sections] Select Warning Type";

export class SelectSection implements Action {
  readonly type = SELECTED_SECTION;
  constructor(public payload: { section: SectionType }) {}
}

export class SelectWarningType implements Action {
  readonly type = SELECT_WARNING_TYPE;
  constructor(public payload: { warningType: WarningType }) {}
}

export type All = SelectSection | SelectWarningType;
