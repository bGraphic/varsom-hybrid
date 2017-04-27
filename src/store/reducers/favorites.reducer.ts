import * as favorites from './../actions/favorite.actions';
import * as localStorage from './../actions/local-storage.actions';

export interface State {
  areaIds: string[];
  pushToken: string;
};

const initialState: State = {
  areaIds: [],
  pushToken: null
}

export function reducer(state = initialState, action: favorites.Actions | localStorage.Actions): State {

  switch(action.type) {
    case favorites.ADD:
      if (state.areaIds.indexOf(action.payload) > -1) {
        return state;
      }
      return Object.assign({}, state, {
        areaIds: [ ...state.areaIds, action.payload ]
      });
    case favorites.REMOVE:
      return Object.assign({}, state, {
        areaIds: state.areaIds.filter(id => id !== action.payload)
      });
    case localStorage.LOAD_SUCESS:    
      return Object.assign( {}, state, {
        // Will override areaIds on load sucess
        areaIds: [...action.payload.favoritesAreaIds],
        // Will not override in case new push token is set
        pushToken: state.pushToken ? state.pushToken : action.payload.pushToken
      });
    default:
      return state;
  };
}

export const getAreaIds = (state: State) => state.areaIds;
export const getPushToken = (state: State) => state.pushToken;