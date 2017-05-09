import { Action } from '@ngrx/store';

export const NOTIFIED_USER = '[AppInfo] Notified user';
export const FILTER_SECTION = '[Layout] Filter Section';


export class NotifiedUserAction implements Action {
  readonly type = NOTIFIED_USER;

  constructor(public payload: string) { }
}

export type Actions
  = NotifiedUserAction;
