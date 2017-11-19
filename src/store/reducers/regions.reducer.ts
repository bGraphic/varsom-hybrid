import * as RegionsActions from "../actions/regions.actions";
import { RegionType, Region } from "../models/Region";
import { createSelector } from "reselect";

export interface State {
  regions: { [k in RegionType]?: Region[] };
  selectedKey: RegionType | string; // string = regionId
  fetching: { [k in RegionType]?: Boolean };
  timestamp: { [k in RegionType]?: Date | null };
  error: { [k in RegionType]?: any | null };
}

const initialState: State = {
  regions: {
    AvalancheRegion: [],
    County: []
  },
  selectedKey: "County",
  fetching: {
    AvalancheRegion: false,
    County: false
  },
  timestamp: {
    AvalancheRegion: null,
    County: null
  },
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
    case RegionsActions.FETCH:
      return {
        ...state,
        regions: {
          ...state.regions
        },
        fetching: {
          ...state.fetching,
          [action.payload.regionType]: true
        }
      };

    case RegionsActions.FETCH_COMPLETE:
      return {
        ...state,
        regions: {
          ...state.regions,
          [action.payload.regionType]: action.payload.regions
        },
        fetching: {
          ...state.fetching,
          [action.payload.regionType]: false
        },
        timestamp: {
          ...state.timestamp,
          [action.payload.regionType]: new Date()
        },
        error: {
          ...state.error,
          [action.payload.regionType]: null
        }
      };

    case RegionsActions.FETCH_ERROR:
      return {
        ...state,
        fetching: {
          ...state.fetching,
          [action.payload.regionType]: false
        },
        error: {
          ...state.error,
          [action.payload.regionType]: action.payload.error
        }
      };

    default:
      return state;
  }
}

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
export const getSelectedTimestamp = (state: State) => {
  if (state.regions.hasOwnProperty(state.selectedKey)) {
    return state.timestamp[state.selectedKey];
  } else {
    // Is a specific County
    return state.timestamp.County;
  }
};

export const isFetchingSelected = (state: State) => {
  if (state.regions.hasOwnProperty(state.selectedKey)) {
    return state.fetching[state.selectedKey];
  } else {
    // Is a specific County
    return state.fetching.County;
  }
};
