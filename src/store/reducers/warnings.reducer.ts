import * as WarningsActions from "../actions/warnings.actions";
import { WarningType, Warning } from "../models/Warning";
import { createSelector } from "reselect";

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

export const getAll = (state: State) => {
  const sortedWarnings: { [k in WarningType]?: Warning[] } = Object.keys(
    state.warnings
  ).reduce((acc, warningType) => {
    acc[warningType] = acc[warningType].sort(
      (a: Warning, b: Warning) => a.date > b.date
    );
    return acc;
  }, {});
  return sortedWarnings;
};

// export const getRegionWarnings = (regionId: string) =>
//   createSelector(getAll, warnings => {
//     const regionWarnings: { [k in WarningType]?: Warning[] } = Object.keys(
//       warnings
//     ).reduce((acc, warningType) => {
//       acc[warningType] = warnings[warningType].filter((warning: Warning) => {
//         return warning.regionId === regionId;
//       });
//       return acc;
//     }, {});

//     return regionWarnings;
//   });

// export const getForecast = (state: State, regionId: string): number[] => {
//   const forecast = Object.keys(regionWarnings)
//     .filter(warningType => {
//       return !!regionWarnings[warningType];
//     })
//     .reduce(
//       (acc, warningType) => {
//         const warningTypeForecast = regionWarnings[warningType].map(
//           (warning: Warning) => warning.rating
//         );
//         return warningTypeForecast.map(
//           (rating, index) => (rating > acc[index] ? rating : acc[index])
//         );
//       },
//       [-1, -1, -1]
//     );

//   return forecast;
// };
