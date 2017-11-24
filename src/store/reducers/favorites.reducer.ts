import * as FavoritesActions from "../actions/favorites.actions";
import { SectionType } from "../models/Section";

export interface State {
  regionIds: string[];
}

const initialState: State = {
  regionIds: []
};

export function reducer(
  state = initialState,
  action: FavoritesActions.All
): State {
  const regionIds = Array.isArray(action.payload)
    ? action.payload
    : [action.payload];
  switch (action.type) {
    case FavoritesActions.ADD:
      return {
        ...state,
        regionIds: [...state.regionIds, ...regionIds]
      };
    case FavoritesActions.REMOVE:
      return {
        ...state,
        regionIds: state.regionIds.filter(
          regionId => regionIds.indexOf(regionId) === -1
        )
      };

    default:
      return state;
  }
}

export const getAll = (state: State) => state.regionIds;
