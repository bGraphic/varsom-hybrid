import * as RegionsActions from "../actions/regions.actions";
import { RegionType, Region } from "../models/Region";
import { createSelector } from "reselect";

export interface State {
  regions: { [k in RegionType]?: Region[] };
  selected: string;
  error: { [k in RegionType]?: any | null };
}

const initialState: State = {
  regions: {
    AvalancheRegion: [],
    County: [],
    Municipality: []
  },
  selected: "AvalancheRegion",
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
    case RegionsActions.SELECT:
      return {
        ...state,
        selected: action.payload.key
      };
    default:
      return state;
  }
}

export const getAll = (state: State) => state.regions;
export const getSelectedKey = (state: State) => state.selected;

export const getSelected = createSelector(
  getAll,
  getSelectedKey,
  (regions, selectedKey): Region[] | Region => {
    if (Object.keys(regions).indexOf(selectedKey) > -1) {
      return regions[selectedKey];
    } else {
      const selected = Object.keys(regions).reduce((acc, regionType) => {
        const selected = regions[regionType].filter(
          (region: Region) => region.id === selectedKey
        );
        return acc.concat(selected);
      }, []);

      return selected.length > 0 ? selected[0] : null;
    }
  }
);
