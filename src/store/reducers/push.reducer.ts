import * as PushActions from "../actions/push.actions";
import { PushToken } from "@ionic/cloud-angular";

export interface State {
  pushToken: PushToken;
}

const initialState: State = {
  pushToken: null
};

export function reducer(state = initialState, action: PushActions.All): State {
  switch (action.type) {
    case PushActions.REGISTER_SUCESS:
      return {
        ...state,
        pushToken: action.payload
      };

    default:
      return state;
  }
}

export const getPushToken = (state: State) => state.pushToken;
