import { IPushMessage } from '@ionic/cloud-angular';

import * as push from './../actions/push.actions';
import * as localStorage from './../actions/local-storage.actions';

export interface State {
  token: string | null;
  savedToken: string | null;
  messages: IPushMessage[];
}

const initialState: State = {
  token: null,
  savedToken: null,
  messages: []
};

export function reducer(state = initialState, action: push.Actions | localStorage.Actions): State {
  switch (action.type) {
    case push.REGISTER_SUCESS:
      return Object.assign({}, state, <State> {
        token: action.payload.token
      });
    case push.NEW_MESSAGE:
      return Object.assign({}, state, <State> {
        messages: [...state.messages, action.payload]
      });
    case localStorage.LOAD_SUCESS:
      return Object.assign({}, state, <State> {
        // Will not override in case new push token has been set
        savedToken: action.payload.pushToken
      });
    default:
      return state;
  }
}

export const getToken = (state: State) => state.token;
export const getMessages = (state: State) => state.messages;