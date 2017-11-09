import * as WarningsActions from "../actions/warnings.actions";
import { WarningType, Warning } from "../models/Warning";

export interface State {
  warnings: { [k in WarningType]?: Warning[] };
  error: { [k in WarningType]?: any | null };
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
