import * as WarningsActions from "../actions/warnings.actions";
import { WarningType, Warning, Warnings, Forecasts } from "../models/Warning";
import { createSelector } from "reselect";

export interface State {
  warnings: {
    Avalanche: Warning[];
    Flood: Warning[];
    Landslide: Warning[];
  };
  error: {
    Avalanche: null;
    Flood: null;
    Landslide: null;
  };
}

const initialState: State = {
  warnings: {
    Avalanche: [],
    Flood: [],
    Landslide: []
  },
  error: {
    Avalanche: null,
    Flood: null,
    Landslide: null
  }
};

export function reducer(
  state = initialState,
  action: WarningsActions.All
): State {
  switch (action.type) {
    case WarningsActions.FETCH_COMPLETE:
      return {
        ...state,
        warnings: {
          ...state.warnings,
          [action.payload.warningType]: action.payload.warnings
        },
        error: {
          ...state.error,
          [action.payload.warningType]: null
        }
      };
    case WarningsActions.FETCH_ERROR:
      return {
        ...state,
        error: {
          ...state.error,
          [action.payload.warningType]: action.payload.error
        }
      };
    default:
      return state;
  }
}

export const getAll = (state: State): Warnings => {
  return Object.keys(state.warnings).reduce(
    (acc, warningType) => {
      const warningsByRegion = mapWarningsToRegion(state.warnings[warningType]);
      Object.keys(warningsByRegion).forEach(regionId => {
        acc[regionId] = acc[regionId] || {};
        acc[regionId][warningType] = warningsByRegion[regionId];
      });
      return acc;
    },
    <Warnings>{}
  );
};

export const getForecasts = createSelector(
  getAll,
  (warnings: Warnings): Forecasts => {
    let originalForecasts = transformWarningsToForecasts(warnings);
    let countyForecasts = createCountyForecasts(originalForecasts);
    let allForecasts = { ...originalForecasts, ...countyForecasts };
    return Object.keys(allForecasts).reduce(
      (acc, regionId) => {
        acc[regionId] = allForecasts[regionId];
        acc[regionId].Combined = combineForecasts(allForecasts[regionId]);
        return acc;
      },
      <Forecasts>{}
    );
  }
);

const mapWarningsToRegion = (warnings: Warning[]) => {
  return warnings.reduce(
    (acc, warning) => {
      acc[warning.regionId] = [
        ...(acc[warning.regionId] || <Warning[]>[]),
        warning
      ];
      return acc;
    },
    <{ [regionId: string]: Warning[] }>{}
  );
};

const transformWarningsToForecasts = (warnings: Warnings) => {
  return Object.keys(warnings).reduce(
    (acc, regionId) => {
      acc[regionId] = acc[regionId] || {};
      acc[regionId] = Object.keys(warnings[regionId]).reduce(
        (acc, warningType: WarningType) => {
          acc[warningType] = transformRegionWarningsToForecast(
            warnings[regionId][warningType]
          );
          return acc;
        },
        <{ [k in WarningType]?: number[] }>{}
      );
      return acc;
    },
    <Forecasts>{}
  );
};

const transformRegionWarningsToForecast = (warnings: Warning[]): number[] => {
  return warnings.map(warning => warning.rating);
};

const createCountyForecasts = (forecasts: Forecasts): Forecasts => {
  const parentMap = Object.keys(forecasts).reduce(
    (acc, regionId) => {
      const parentId = regionId.substring(0, 2);
      acc[parentId] = [
        ...(acc[parentId] || <{ [k in WarningType]?: number[] }[]>[]),
        forecasts[regionId]
      ];
      return acc;
    },
    <{ [regionId: string]: { [k in WarningType]?: number[] }[] }>{}
  );

  return Object.keys(parentMap)
    .filter(parentId => parseInt(parentId) < 30)
    .reduce(
      (acc, parentId) => {
        acc[parentId] = flattenForecasts(parentMap[parentId]);
        return acc;
      },
      <Forecasts>{}
    );
};

const combineForecasts = (forecasts: { [k in WarningType]?: number[] }) => {
  return Object.keys(forecasts)
    .filter((warningType: WarningType) => {
      return forecasts[warningType].length === 3;
    })
    .reduce(
      (acc, warningType: WarningType) => {
        return forecasts[warningType].map(
          (rating, index) => (rating > acc[index] ? rating : acc[index])
        );
      },
      [-1, -1, -1]
    );
};

const flattenForecasts = (forecasts: { [k in WarningType]?: number[] }[]) => {
  return forecasts.reduce(
    (acc, forecasts) => {
      Object.keys(forecasts).forEach((warningType: WarningType) => {
        const currentHighest = acc[warningType] || forecasts[warningType];
        acc[warningType] = forecasts[warningType].map(
          (rating, index) =>
            rating > currentHighest[index] ? rating : currentHighest[index]
        );
      });
      return acc;
    },
    <{ [k in WarningType]?: number[] }>{}
  );
};
