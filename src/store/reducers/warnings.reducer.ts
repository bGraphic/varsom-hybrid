import * as WarningsActions from "../actions/warnings.actions";
import { Warning, Forecast, ForecastType } from "../models/Warning";
import { createSelector } from "reselect";

export interface State {
  forecasts: { [k in ForecastType]?: Forecast[] };
  selectedType: ForecastType;
  fetching: { [k in ForecastType]?: Boolean };
  timestamp: { [k in ForecastType]?: Date | null };
  error: { [k in ForecastType]?: any | null };
}

const initialState: State = {
  forecasts: {
    Avalanche: [],
    Flood: [],
    Landslide: [],
    FloodLandslide: []
  },
  selectedType: "FloodLandslide",
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
      let forecasts = { ...state.forecasts };
      forecasts[warningType] = transformToForecasts(action.payload.warnings);
      forecasts.FloodLandslide = [
        ...combineForecasts(forecasts.Flood, forecasts.Landslide)
      ];

      fetching[warningType] = false;
      timestamp[warningType] = new Date();
      error[warningType] = null;

      if (!isAvalanche) {
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
        forecasts: forecasts,
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

    case WarningsActions.SELECT:
      return {
        ...state,
        selectedType: action.payload.warningType
      };

    default:
      return state;
  }
}

export const getSelected = (state: State) =>
  state.forecasts[state.selectedType];
export const getSelectedTimestamp = (state: State) =>
  state.timestamp[state.selectedType];
export const isFetchingSelected = (state: State) =>
  state.fetching[state.selectedType];

const transformToForecasts = (warnings: Warning[]): Forecast[] => {
  const warningPerRegion = warnings.reduce(
    (acc, warning) => {
      acc[warning.regionId] = [...(acc[warning.regionId] || []), warning];
      return acc;
    },
    <{ [regionId: string]: Warning[] }>{}
  );

  return Object.keys(warningPerRegion).map(regionId => {
    return <Forecast>{
      regionId: regionId,
      warnings: warningPerRegion[regionId]
    };
  });
};

const combineForecasts = (
  forecastsA: Forecast[],
  forecastsB: Forecast[]
): Forecast[] => {
  if (forecastsA.length === 0) {
    return forecastsB;
  } else if (forecastsB.length === 0) {
    return forecastsA;
  } else {
    return forecastsA.map(forecastA => {
      const forecastB =
        forecastsB.find(forecast => forecast.regionId === forecastA.regionId) ||
        forecastA;
      return <Forecast>{
        regionId: forecastA.regionId,
        warnings: forecastA.warnings.map((warningA, index) => {
          const warningB = forecastB.warnings[index];
          return warningA.rating > warningB.rating ? warningA : warningB;
        })
      };
    });
  }
};

export const highestWarnings = (forecasts: Forecast[]): Warning[] => {
  return forecasts.reduce((acc, forecast) => {
    acc = acc.length === 0 ? forecast.warnings : acc;
    return acc.map((warning, index) => {
      return warning.rating > forecast.warnings[index].rating
        ? warning
        : forecast.warnings[index];
    });
  }, []);
};
