import * as UIAlertsActions from "../actions/ui-alerts.actions";
import { AppUpdateAlertType } from "../models/Alert";

export interface State {
  update: AppUpdateAlertType;
}

const initialState: State = {
  update: "NoUpdate"
};

export function reducer(
  state = initialState,
  action: UIAlertsActions.All
): State {
  switch (action.type) {
    case UIAlertsActions.UPDATE_ALERT:
      return {
        ...state,
        update: action.payload.appUpdateAlertType
      };
    default:
      return state;
  }
}

export const getAppUpdateAlertType = (state: State) => state.update;
