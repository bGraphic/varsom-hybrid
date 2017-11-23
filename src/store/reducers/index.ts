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

import * as fromGeojson from "./geojson.reducer";
import * as fromLocation from "./location.reducer";
import * as fromRegions from "./regions.reducer";
import * as fromMapUIState from "./ui-map.reducer";
import * as fromSectionsUIState from "./ui-sections.reducer";
import * as fromWarnings from "./warnings.reducer";
import { SectionType } from "../models/Section";
import { WarningType } from "../models/Warning";
import { RegionImportance } from "../models/Region";
import { Forecast } from "../models/Forecast";
import { ThemeUtils } from "../../utils/theme-utils";

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  geojson: fromGeojson.State;
  regions: fromRegions.State;
  location: fromLocation.State;
  mapUI: fromMapUIState.State;
  sectionsUI: fromSectionsUIState.State;
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
  geojson: fromGeojson.reducer,
  regions: fromRegions.reducer,
  location: fromLocation.reducer,
  mapUI: fromMapUIState.reducer,
  sectionsUI: fromSectionsUIState.reducer,
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

// UI Sections

const getSectionsUIState = (state: State) => state.sectionsUI;

export const getSections = createSelector(
  getSectionsUIState,
  fromSectionsUIState.getSections
);

export const getSelectedSection = createSelector(
  getSectionsUIState,
  fromSectionsUIState.getSelectedSection
);

export const getSegments = createSelector(
  getSectionsUIState,
  fromSectionsUIState.getSegments
);

export const getSelectedSegment = createSelector(
  getSectionsUIState,
  fromSectionsUIState.getSelectedSegment
);

// UI Map

export const getMapUIState = (state: State) => state.mapUI;

export const getMapSettings = createSelector(
  getMapUIState,
  fromMapUIState.getSettings
);

export const getMapRecenterRequests = createSelector(
  getMapUIState,
  fromMapUIState.getRecenterRequests
);

// Geojson

const getGeojsonState = (state: State) => state.geojson;
const getAllGeojsonObjects = createSelector(
  getGeojsonState,
  fromGeojson.getAll
);
const getSectionGeojson = createSelector(
  getAllGeojsonObjects,
  getSelectedSection,
  (geojson, section) => {
    return geojson[section];
  }
);

// Regions

const getRegionsState = (state: State) => state.regions;
const getAllRegions = createSelector(getRegionsState, fromRegions.getAll);
const getSectionRegions = createSelector(
  getAllRegions,
  getSelectedSection,
  (regions, section) => {
    return regions[section];
  }
);

export const getRegion = (regionId: string) =>
  createSelector(getSectionRegions, regions => {
    return regions.find(region => region.id === regionId);
  });

// Warnings

const getWarningState = (state: State) => state.warnings;
const getAllWarnings = createSelector(getWarningState, fromWarnings.getAll);
const getSegmentWarnings = createSelector(
  getAllWarnings,
  getSelectedSegment,
  (warnings, segment) => {
    return warnings[segment];
  }
);

// Forecasts

export const getOverviewMapForecasts = () =>
  createSelector(
    getSectionForecasts,
    getSectionGeojson,
    (forecasts, geojson) => {
      return geojson.map(feature => {
        const forecast = forecasts.find(
          forecast => forecast.regionId === feature.properties.regionId
        );
        const isRegionB = forecast
          ? forecast.regionImportance === RegionImportance.B
          : feature.properties.type === "B";
        const properties = {
          ...feature.properties,
          display: !isRegionB || forecast.highestRating > 1,
          color: forecast
            ? ThemeUtils.colorForRating(forecast.highestRating)
            : ThemeUtils.colorForRating(0)
        };
        return {
          type: feature.type,
          properties: properties,
          geometry: feature.geometry
        };
      });
    }
  );

export const getOverviewListForecasts = (regionId: string) =>
  createSelector(
    getSectionForecasts,
    getSelectedSection,
    (forecasts, section) => {
      return forecasts
        .filter(forecast => {
          if (regionId) {
            return (
              forecast.regionType === "Municipality" &&
              forecast.regionId.startsWith(regionId)
            );
          } else {
            return forecast.regionType !== "Municipality";
          }
        })
        .sort((forecastA, forecastB) => {
          if (section === "Avalanche") {
            // North to south sorting for avalanche regions
            // Region "3001": "Svalbard øst" north
            // Region "3046": "Østfold" south
            return forecastA.regionId > forecastB.regionId ? 1 : -1;
          } else if (regionId) {
            // Alphabetical sorting for municipalities
            return forecastA.regionName > forecastB.regionName ? 1 : -1;
          } else {
            // North to south sorting for counties
            // County "20": "Finnmark", north
            // County "01": "Østfold", south
            return forecastA.regionId > forecastB.regionId ? -1 : 1;
          }
        });
    }
  );

const getSectionForecasts = createSelector(
  getSectionRegions,
  getSegmentWarnings,
  (regions, warnings) => {
    return regions.map(region => {
      // Need to do this as counties has no entries in warnings
      const highestWarnings = fromWarnings.highestWarnings(
        warnings.filter(regionWarnings => {
          return regionWarnings.regionId.startsWith(region.id);
        })
      );

      return <Forecast>{
        regionId: region.id,
        regionName: region.name,
        regionType: region.type,
        regionImportance: region.importance,
        highestRating: highestWarnings.reduce((acc, warning) => {
          return acc > warning.rating ? acc : warning.rating;
        }, -1),
        warnings: highestWarnings
      };
    });
  }
);

// Location

export const getLocationState = (state: State) => state.location;
export const getPosition = () =>
  createSelector(
    getLocationState,
    (state: fromLocation.State) => state.position
  );
