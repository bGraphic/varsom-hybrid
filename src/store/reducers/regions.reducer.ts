import * as RegionsActions from "../actions/regions.actions";
import { RegionType, Region } from "../models/Region";

export interface State {
  regions: { [k in RegionType]?: Region[] };
  error: { [k in RegionType]?: any | null };
}

const initialState: State = {
  regions: {
    AvalancheRegion: [],
    County: [],
    Municipality: []
  },
  error: {
    AvalancheRegion: null,
    County: null,
    Municipality: null
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
