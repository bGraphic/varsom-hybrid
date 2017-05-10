import { IPushMessage } from '@ionic/cloud-angular';
import * as push from './../actions/push.actions';

export interface State {
  token: string | null;
  messages: IPushMessage[];
}

const initialState: State = {
  token: null,
  messages: []
};

export function reducer(state = initialState, action: push.Actions): State {
  switch (action.type) {
    case push.REGISTER_SUCESS:
      return Object.assign({}, state, {
        pushToken: action.payload.token
      });
    case push.NEW_MESSAGE:
      return Object.assign({}, state, {
        messages: [...state.messages, action.payload]
      });
    default:
      return state;
  }
}

export const getToken = (state: State) => state.token;
export const getMessages = (state: State) => state.messages;