import { Action } from '@ngrx/store';

export const OPEN_SECTION = '[Layout] Open Section';
export const FILTER_SECTION = '[Layout] Filter Section';


export class OpenSectionAction implements Action {
  readonly type = OPEN_SECTION;

  constructor(public payload: string) { }
}

export class FilterSectionAction implements Action {
  readonly type = FILTER_SECTION;

  constructor(public payload: {
    sectionId: string,
    filter: string
  }) { }
}

export type Actions
  = OpenSectionAction
  | FilterSectionAction;
