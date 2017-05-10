import * as favorites from './../actions/favorite.actions';
import * as localStorage from './../actions/local-storage.actions';

export interface State {
  areaIds: string[];
};

const initialState: State = {
  areaIds: [],
}

function add(areaIds:string[], areaId:string) {
  if (areaIds.indexOf(areaId) > -1) {
    return areaIds;
  } else {
    return [...areaIds, areaId];
  }
}

function remove(areaIds:string[], areaId:string) {
  return areaIds.filter(id => id !== areaId);
}

function toogle(areaIds:string[], areaId:string) {
  if (areaIds.indexOf(areaId) > -1) {
    return remove(areaIds, areaId);
  } else {
    return add(areaIds, areaId);
  }
}

export function reducer(state = initialState, action: favorites.Actions | localStorage.Actions): State {

  switch (action.type) {
    case favorites.ADD:
      return Object.assign({}, state, <State> {
        areaIds: add(state.areaIds, action.payload)
      });
    case favorites.REMOVE:
      return Object.assign({}, state, <State> {
        areaIds: remove(state.areaIds, action.payload)
      });
    case favorites.TOOGLE:
      return Object.assign({}, state, <State> {
        areaIds: toogle(state.areaIds, action.payload)
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