import * as RegionsActions from "../actions/regions.actions";
import { Region } from "../models/Region";
import { SectionType } from "../models/Section";

export interface State {
  regions: { [k in SectionType]?: Region[] };
  fetching: { [k in SectionType]?: Boolean };
  timestamp: { [k in SectionType]?: Date | null };
  error: { [k in SectionType]?: any | null };
}

const initialState: State = {
  regions: {
    Avalanche: [],
    FloodLandslide: []
  },
  fetching: {
    Avalanche: false,
    FloodLandslide: false
  },
  timestamp: {
    Avalanche: null,
    FloodLandslide: null
  },
  error: {
    Avalanche: null,
    FloodLandslide: null
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
        fetching: {
          ...state.fetching,
          [action.payload.sectionType]: true
        }
      };

    case RegionsActions.FETCH_COMPLETE:
      return {
        ...state,
        regions: {
          ...state.regions,
          [action.payload.sectionType]: action.payload.regions
        },
        fetching: {
          ...state.fetching,
          [action.payload.sectionType]: false
        },
        timestamp: {
          ...state.timestamp,
          [action.payload.sectionType]: new Date()
        },
        error: {
          ...state.error,
          [action.payload.sectionType]: null
        }
      };

    case RegionsActions.FETCH_ERROR:
      return {
        ...state,
        fetching: {
          ...state.fetching,
          [action.payload.sectionType]: false
        },
        error: {
          ...state.error,
          [action.payload.sectionType]: action.payload.error
        }
      };

    default:
      return state;
  }
}

export const getAll = (state: State) => state.regions;
export const getFetching = (state: State) => state.fetching;
export const getTimestamp = (state: State) => state.timestamp;
