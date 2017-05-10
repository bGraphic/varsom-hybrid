import * as localStorage from './../actions/local-storage.actions';

export interface State {
  loading: boolean;
  loaded: boolean;
  saving: boolean;
  lastSaved: Date;
};

const initialState: State = {
  loading: false,
  loaded: false,
  saving: false,
  lastSaved: null
};

export function reducer(state = initialState, action: localStorage.Actions): State {

  switch (action.type) {
    case localStorage.LOAD:
      return Object.assign({}, state, <State> {
        loading: true
      });
    case localStorage.LOAD_SUCESS:
      return Object.assign({}, state, <State> {
        loaded: true,
        loading: false,
      });
    case localStorage.SAVE:
      return Object.assign({}, state, <State> {
        saving: true
      });
    case localStorage.SAVE_SUCESS:
      return Object.assign({}, state, <State> {
        saving: false,
        lastSaved: new Date()
      });
    default:
      return state;
  };
}

export const getLoaded = (state: State) => state.loaded;