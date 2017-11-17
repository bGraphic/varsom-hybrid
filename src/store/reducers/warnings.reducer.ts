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
    Combined: []
  },
  selectedType: "Combined",
  fetching: {
    Avalanche: false,
    Flood: false,
    Landslide: false
  },
  timestamp: {
    Avalanche: null,
    Flood: null,
    Landslide: null
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
    case WarningsActions.FETCH:
      return {
        ...state,
        fetching: {
          ...state.fetching,
          [action.payload.warningType]: true
        }
      };

    case WarningsActions.FETCH_COMPLETE:
      const warningType = action.payload.warningType;
      let forecasts = { ...state.forecasts };
      forecasts[warningType] = transformToForecasts(action.payload.warnings);
      forecasts.Combined = [
        ...forecasts.Avalanche,
        ...combineForecasts(forecasts.Flood, forecasts.Landslide)
      ];

      return {
        ...state,
        forecasts: forecasts,
        fetching: {
          ...state.fetching,
          [action.payload.warningType]: false
        },
        timestamp: {
          ...state.timestamp,
          [action.payload.warningType]: new Date()
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
export const getAll = (state: State) => state.forecasts;
export const getSelected = (state: State) =>
  state.forecasts[state.selectedType];

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
