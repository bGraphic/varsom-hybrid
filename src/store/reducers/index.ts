import { createSelector } from "reselect";
import { ActionReducer } from "@ngrx/store";
import { store as config } from "./../../config/config";

/**
 * The compose function is one of our most handy tools. In basic terms, you give
 * it any number of functions and it returns a function. This new function
 * takes a value and chains it through every composed function, returning
 * the output.
 *
 * More: https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch5.html
 */
import { compose } from "@ngrx/core/compose";

/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
import { storeFreeze } from "ngrx-store-freeze";

/**
 * combineReducers is another useful metareducer that takes a map of reducer
 * functions and creates a new reducer that gathers the values
 * of each reducer and stores them using the reducer's key. Think of it
 * almost like a database, where every reducer is a table in the db.
 *
 * More: https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch
 */
import { combineReducers } from "@ngrx/store";

/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */

import * as fromLocation from "./location.reducer";
import * as fromRegions from "./regions.reducer";
import * as fromMapUIState from "./ui-map.reducer";
import * as fromWarnings from "./warnings.reducer";
import { RegionType, Region } from "../models/Region";
import { Forecast } from "../models/Warning";

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  regions: fromRegions.State;
  location: fromLocation.State;
  mapUI: fromMapUIState.State;
  warnings: fromWarnings.State;
}

/**
 * Because metareducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
const reducers = {
  regions: fromRegions.reducer,
  location: fromLocation.reducer,
  mapUI: fromMapUIState.reducer,
  warnings: fromWarnings.reducer
};

const developmentReducer: ActionReducer<State> = compose(
  storeFreeze,
  combineReducers
)(reducers);
const productionReducer: ActionReducer<State> = combineReducers(reducers);

export function reducer(state: any, action: any) {
  if (!config.storeFreeze) {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}

// Selectors

// Regions

export const getRegionsState = (state: State) => state.regions;
export const getSelectedRegions = createSelector(
  getRegionsState,
  fromRegions.getSelected
);
export const getSelectedRegionsTimestamp = createSelector(
  getRegionsState,
  fromRegions.getSelectedTimestamp
);
export const isFetchingSelectedRegions = createSelector(
  getRegionsState,
  fromRegions.isFetchingSelected
);

// Warnings

export const getWarningState = (state: State) => state.warnings;
export const getSelectedForecasts = createSelector(
  getWarningState,
  fromWarnings.getSelected
);
export const getSelectedForecastsTimestamp = createSelector(
  getWarningState,
  fromWarnings.getSelectedTimestamp
);
export const isFetchingSelectedForecasts = createSelector(
  getWarningState,
  fromWarnings.isFetchingSelected
);

// Forecasts

export const getForecasts = createSelector(
  getSelectedRegions,
  getSelectedForecasts,
  (regions: Region[], forecasts: Forecast[]) => {
    return regions.map(region => {
      const regionForecasts = forecasts.filter(forecast => {
        return forecast.regionId.startsWith(region.id);
      });
      const highestWarnings = fromWarnings.highestWarnings(regionForecasts);
      return <Forecast>{
        regionId: region.id,
        regionName: region.name,
        regionImportance: region.importance,
        warnings: highestWarnings
      };
    });
  }
);
export const getForecastTimestamp = getSelectedForecastsTimestamp;

export const isFetchingForecasts = createSelector(
  isFetchingSelectedRegions,
  isFetchingSelectedForecasts,
  (isFetchingRegions, isFetchingForecasts) => {
    return isFetchingRegions && isFetchingForecasts;
  }
);

// Location

export const getLocationState = (state: State) => state.location;
export const getPosition = () =>
  createSelector(
    getLocationState,
    (state: fromLocation.State) => state.position
  );

// UI MAP

export const getMapUIState = (state: State) => state.mapUI;
export const getMapCenter = (key: string) =>
  createSelector(
    getMapUIState,
    (state: fromMapUIState.State) => state[key].center
  );
export const getMapZoom = (key: string) =>
  createSelector(
    getMapUIState,
    (state: fromMapUIState.State) => state[key].zoom
  );
export const getMapIsCentered = (key: string) =>
  createSelector(
    getMapUIState,
    (state: fromMapUIState.State) => state[key].centered
  );
export const getRecenterMap = (key: string) =>
  createSelector(
    getMapUIState,
    (state: fromMapUIState.State) => state[key].recenter
  );
export const getMapFullscreen = (key: string) =>
  createSelector(
    getMapUIState,
    (state: fromMapUIState.State) => state[key].fullscreen
  );
