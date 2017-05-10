import * as favorites from './../actions/favorite.actions';
import * as localStorage from './../actions/local-storage.actions';

export interface State {
  areaIds: string[];
};

const initialState: State = {
  areaIds: [],
}

export function reducer(state = initialState, action: favorites.Actions | localStorage.Actions): State {

  switch (action.type) {
    case favorites.ADD:
      if (state.areaIds.indexOf(action.payload) > -1) {
        return state;
      }
      return Object.assign({}, state, <State> {
        areaIds: [...state.areaIds, action.payload]
      });
    case favorites.REMOVE:
      return Object.assign({}, state, <State> {
        areaIds: state.areaIds.filter(id => id !== action.payload)
      });
    case localStorage.LOAD_SUCESS:
      return Object.assign({}, state, <State> {
        // Will override areaIds on load sucess
        areaIds: [...action.payload.favoritesAreaIds],
      });
    default:
      return state;
  };
}

export const getAreaIds = (state: State) => state.areaIds;