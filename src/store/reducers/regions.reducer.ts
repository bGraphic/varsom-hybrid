import * as RegionsActions from "../actions/regions.actions";
import { RegionType, Region } from "../models/Region";
import { createSelector } from "reselect";

export interface State {
  regions: {
    AvalancheRegion: Region[];
    County: Region[];
  };
  selectedKey: RegionType | string; // string = regionId
  error: { [k in RegionType]?: any | null };
}

const initialState: State = {
  regions: {
    AvalancheRegion: [],
    County: []
  },
  selectedKey: "County",
  error: {
    AvalancheRegion: null,
    County: null
  }
};

export function reducer(
  state = initialState,
  action: RegionsActions.All
): State {
  switch (action.type) {
    case RegionsActions.FETCH_COMPLETE:
      return {
        ...state,
        regions: {
          ...state.regions,
          [action.payload.regionType]: action.payload.regions
        },
        error: {
          ...state.error,
          [action.payload.regionType]: null
        }
      };
    case RegionsActions.FETCH_ERROR:
      return {
        ...state,
        error: {
          ...state.error,
          [action.payload.regionType]: action.payload.error
        }
      };
    default:
      return state;
  }
}

export const getAll = (state: State) => state.regions;
export const getSelected = (state: State) => {
  if (state.regions.hasOwnProperty(state.selectedKey)) {
    return state.regions[state.selectedKey];
  } else {
    const region = state.regions.County.find(
      region => region.id === state.selectedKey
    );
    return region ? region.children : [];
  }
};
