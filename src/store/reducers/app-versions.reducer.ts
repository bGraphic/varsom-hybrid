import * as AppVersionsActions from "../actions/app-versions.actions";
import { LatestAppVersion, AppVersionType } from "../models/AppVersion";

export interface State {
  appVersions: { [k in AppVersionType]?: string | LatestAppVersion };
}

const initialState: State = {
  appVersions: {
    ThisAppVersion: "0.0.0",
    NotifiedAppVersion: "0.0.0",
    LatestAppVersion: <LatestAppVersion>{
      version: null,
      forced: true
    }
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
    case AppVersionsActions.NOTIFIED_USER:
      return {
        ...state,
        appVersions: {
          ...state.appVersions,
          NotifiedAppVersion:
            (<LatestAppVersion>state.appVersions.LatestAppVersion).version ||
            initialState.appVersions.NotifiedAppVersion
        }
      };
    case AppVersionsActions.FETCH_ERROR:
      console.warn("[App Versions] Fetch Error", action.payload.error);
    default:
      return state;
  }
}

export const getAll = (state: State) => state.appVersions;
export const getNotified = (state: State) =>
  <string>state.appVersions.NotifiedAppVersion;
export const getLatest = (state: State): LatestAppVersion =>
  <LatestAppVersion>state.appVersions.LatestAppVersion;
