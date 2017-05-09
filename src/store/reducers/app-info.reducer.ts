import * as appInfo from './../actions/app-info.actions';
import * as localStorage from './../actions/local-storage.actions';

export interface State {
  lastNotifiedAppVersion: string | null;
  thisAppVersion: string | null;
  currentlyReleasedAppVersion: string | null;
}

const initialState: State = {
  lastNotifiedAppVersion: null,
  thisAppVersion: null,
  currentlyReleasedAppVersion: null
};

export function reducer(state = initialState, action: appInfo.Actions | localStorage.Actions): State {
  switch (action.type) {
    case appInfo.NOTIFIED_USER:
      return Object.assign({}, state, {
        lastNotifiedAppVersion: action.payload
      });
    case localStorage.LOAD_SUCESS:
      return Object.assign({}, state, {
        lastNotifiedAppVersion: action.payload.lastNotifiedAppVersion
      });
    default:
      return state;
  }
}

export const getLastNotifiedAppVersion= (state: State) => state.lastNotifiedAppVersion;
