import * as WarningsActions from "../actions/warnings.actions";
import { Warning, WarningType, RegionWarnings } from "../models/Warning";

export interface State {
  warnings: { [k in WarningType]?: RegionWarnings[] };
  fetching: { [k in WarningType]?: Boolean };
  timestamp: { [k in WarningType]?: Date | null };
  error: { [k in WarningType]?: any | null };
}

const initialState: State = {
  warnings: {
    Avalanche: [],
    Flood: [],
    Landslide: [],
    FloodLandslide: []
  },
  fetching: {
    Avalanche: false,
    Flood: false,
    Landslide: false,
    FloodLandslide: false
  },
  timestamp: {
    Avalanche: null,
    Flood: null,
    Landslide: null,
    FloodLandslide: null
  },
  error: {
    Avalanche: null,
    Flood: null,
    Landslide: null,
    FloodLandslide: null
  }
};

export function reducer(
  state = initialState,
  action: WarningsActions.All
): State {
  if (!action.payload || !action.payload.warningType) {
    return state;
  }

  const warningType = action.payload.warningType;
  const isAvalanche = warningType === "Avalanche";

  let fetching = { ...state.fetching };
  let timestamp = { ...state.timestamp };
  let error = { ...state.error };

  switch (action.type) {
    case WarningsActions.FETCH:
      fetching[warningType] = true;

      if (!isAvalanche) {
        fetching.FloodLandslide = true;
      }

      return {
        ...state,
        fetching: fetching
      };

    case WarningsActions.FETCH_COMPLETE:
      let warnings = { ...state.warnings };
      warnings[warningType] = transformToRegionWarnings(
        action.payload.warnings
      );
      fetching[warningType] = false;
      timestamp[warningType] = new Date();
      error[warningType] = null;

      if (!isAvalanche) {
        warnings.FloodLandslide = [
          ...combineWarnings(warnings.Flood, warnings.Landslide)
        ];
        fetching.FloodLandslide = fetching.Flood || fetching.Landslide;
        timestamp.FloodLandslide = fetching.FloodLandslide
          ? timestamp.FloodLandslide
          : timestamp[warningType];
        error.FloodLandslide = fetching.FloodLandslide
          ? error.FloodLandslide
          : error[warningType];
      }

      return {
        ...state,
        warnings: warnings,
        fetching: fetching,
        timestamp: timestamp,
        error: error
      };

    case WarningsActions.FETCH_ERROR:
      error[warningType] = action.payload.error;
      if (!isAvalanche) {
        error.FloodLandslide = error[warningType];
      }
      return {
        ...state,
        error: error
      };

    default:
      return state;
  }
}

export const getAll = (state: State) => state.warnings;

const transformToRegionWarnings = (warnings: Warning[]): RegionWarnings[] => {
  const warningPerRegion = warnings.reduce(
    (acc, warning) => {
      acc[warning.regionId] = [...(acc[warning.regionId] || []), warning];
      return acc;
    },
    <{ [regionId: string]: Warning[] }>{}
  );

  return Object.keys(warningPerRegion).map(regionId => {
    return <RegionWarnings>{
      regionId: regionId,
      warnings: warningPerRegion[regionId]
    };
  });
};

const combineWarnings = (
  warningsA: RegionWarnings[],
  warningsB: RegionWarnings[]
): RegionWarnings[] => {
  if (warningsA.length === 0) {
    return warningsB;
  } else if (warningsB.length === 0) {
    return warningsA;
  } else {
    return warningsA.map(regionsWarningsA => {
      const regionWarningsB =
        warningsB.find(
          regionWarnings =>
            regionWarnings.regionId === regionsWarningsA.regionId
        ) || regionsWarningsA;
      return <RegionWarnings>{
        regionId: regionsWarningsA.regionId,
        warnings: regionsWarningsA.warnings.map((warningA, index) => {
          const warningB = regionWarningsB.warnings[index];
          return warningA.rating > warningB.rating ? warningA : warningB;
        })
      };
    });
  }
};

export const highestWarnings = (warnings: RegionWarnings[]): Warning[] => {
  return warnings.reduce((acc, regionWarnings) => {
    acc = acc.length === 0 ? regionWarnings.warnings : acc;
    return acc.map((warning, index) => {
      return warning.rating > regionWarnings.warnings[index].rating
        ? warning
        : regionWarnings.warnings[index];
    });
  }, []);
};
