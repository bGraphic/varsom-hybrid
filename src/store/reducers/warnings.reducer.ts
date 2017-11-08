import * as WarningsActions from "../actions/warnings.actions";
import { Forecast, ForecastType } from "../models/Forecast";

export interface State {
  forecasts: { [k in ForecastType]?: Forecast[] };
  error: { [k in ForecastType]?: any | null };
}

const initialState: State = {
  forecasts: {
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
        forecasts: {
          ...state.forecasts,
          [action.payload.forecastType]: action.payload.forecasts
        },
        error: {
          ...state.error,
          [action.payload.forecastType]: null
        }
      };
    case WarningsActions.FETCH_ERROR:
      return {
        ...state,
        error: {
          ...state.error,
          [action.payload.forecastType]: action.payload.error
        }
      };
    default:
      return state;
  }
}
