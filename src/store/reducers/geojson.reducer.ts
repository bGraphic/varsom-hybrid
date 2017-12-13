import * as GeojsonActions from "../actions/geojson.actions";
import { SectionType } from "../models/Section";

export interface State {
  features: { [k in SectionType]?: any[] };
  error: { [k in SectionType]?: any | null };
}

const initialState: State = {
  features: {
    Avalanche: [],
    FloodLandslide: []
  },
  error: {
    Avalanche: null,
    FloodLandslide: null
  }
};

export function reducer(
  state = initialState,
  action: GeojsonActions.All
): State {
  switch (action.type) {
    case GeojsonActions.FETCH_COMPLETE:
      return {
        ...state,
        features: {
          ...state.features,
          [action.payload.sectionType]: action.payload.features
        },
        error: {
          ...state.error,
          [action.payload.sectionType]: null
        }
      };

    case GeojsonActions.FETCH_ERROR:
      return {
        ...state,
        error: {
          ...state.error,
          [action.payload.sectionType]: action.payload.error
        }
      };

    default:
      return state;
  }
}

export const getAll = (state: State) => state.features;
