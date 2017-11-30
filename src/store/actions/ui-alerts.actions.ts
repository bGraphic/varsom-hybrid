import { Action } from "@ngrx/store";
import { AppUpdateAlertType } from "../models/Alert";

export const UPDATE_ALERT = "[UI Alerts] Update Alert";
export const CALC_UPDATE_ALERT = "[UI Alerts] Show Alert";

export class AppUpdateAlertAction implements Action {
  readonly type = UPDATE_ALERT;
  constructor(
    public payload: {
      appUpdateAlertType: AppUpdateAlertType;
    }
  ) {}
}

export type All = AppUpdateAlertAction;
