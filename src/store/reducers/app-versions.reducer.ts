import * as AppVersionsActions from "../actions/app-versions.actions";
import { LatestAppVersion, AppVersionType } from "../models/AppVersion";

export interface State {
  appVersions: { [k in AppVersionType]?: string | LatestAppVersion };
}

const initialState: State = {
  appVersions: {
    ThisAppVersion: null,
    NotifiedAppVersion: null,
    LatestAppVersion: null
  }
};

export function reducer(
  state = initialState,
  action: AppVersionsActions.All
): State {
  switch (action.type) {
    case AppVersionsActions.FETCH_COMPLETE:
      return {
        ...state,
        appVersions: {
          ...state.appVersions,
          [action.payload.appVersionType]: action.payload.appVersion
        }
      };
    case AppVersionsActions.FETCH_ERROR:
      console.warn("[App Versions] Fetch Error", action.payload.error);
    default:
      return state;
  }
}

export const getAll = (state: State) => state.appVersions;
