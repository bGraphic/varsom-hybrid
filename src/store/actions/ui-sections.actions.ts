import { Action } from "@ngrx/store";
import { WarningType } from "../models/Warning";
import { SectionType } from "../models/Section";

export const SELECTED_SECTION = "[UI Sections] Selected Section";
export const SELECT_SEGMENT = "[UI Sections] Select Segment";

export class SelectSection implements Action {
  readonly type = SELECTED_SECTION;
  constructor(public payload: { section: SectionType }) {}
}

export class SelectSegment implements Action {
  readonly type = SELECT_SEGMENT;
  constructor(public payload: { segment: WarningType }) {}
}

export type All = SelectSection | SelectSegment;
