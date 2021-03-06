import { createSelector } from "reselect";
import { ActionReducer } from "@ngrx/store";

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

import * as fromAppVersions from "./app-versions.reducer";
import * as fromFavorites from "./favorites.reducer";
import * as fromGeojson from "./geojson.reducer";
import * as fromLocation from "./location.reducer";
import * as fromRegions from "./regions.reducer";
import * as fromMapUIState from "./ui-map.reducer";
import * as fromSectionsUIState from "./ui-sections.reducer";
import * as fromWarnings from "./warnings.reducer";
import { ThemeUtils } from "../../utils/theme-utils";
import {
  RegionImportance,
  TRONDELAG,
  SOUTH_TRONDELAG,
  NORTH_TRONDELAG
} from "../models/Region";
import { WarningType, RegionWarnings } from "../models/Warning";
import { Forecast } from "../models/Forecast";
/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  appVersions: fromAppVersions.State;
  favorites: fromFavorites.State;
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
  appVersions: fromAppVersions.reducer,
  favorites: fromFavorites.reducer,
  geojson: fromGeojson.reducer,
  regions: fromRegions.reducer,
  location: fromLocation.reducer,
  mapUI: fromMapUIState.reducer,
  sectionsUI: fromSectionsUIState.reducer,
  warnings: fromWarnings.reducer
};

const productionReducer: ActionReducer<State> = combineReducers(reducers);

export function reducer(state: any, action: any) {
  return productionReducer(state, action);
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

const getMapUIState = (state: State) => state.mapUI;

export const getMapSettings = createSelector(
  getMapUIState,
  fromMapUIState.getSettings
);

export const getMapRecenterRequests = createSelector(
  getMapUIState,
  fromMapUIState.getRecenterRequests
);

// App Versions

const getAppVersionsState = (state: State) => state.appVersions;

export const getAllAppVersions = createSelector(
  getAppVersionsState,
  fromAppVersions.getAll
);

export const getLatestAppVersions = createSelector(
  getAppVersionsState,
  fromAppVersions.getLatest
);

export const getNotifiedAppVersion = createSelector(
  getAppVersionsState,
  fromAppVersions.getNotified
);

// Favorites

const getFavoritesState = (state: State) => state.favorites;

export const getFavorites = createSelector(
  getFavoritesState,
  fromFavorites.getAll
);

export const isFavorite = (regionId: string) =>
  createSelector(getFavorites, favorites => {
    return favorites.indexOf(regionId) > -1;
  });

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
    regionId = regionId === SOUTH_TRONDELAG ? TRONDELAG : regionId;
    regionId = regionId === NORTH_TRONDELAG ? TRONDELAG : regionId;
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

const getAllFetching = createSelector(
  getWarningState,
  fromWarnings.getAllFetching
);
const getSegmentFetching = createSelector(
  getAllFetching,
  getSelectedSegment,
  (fetching, segment) => {
    return fetching[segment];
  }
);

const getAllTimestamp = createSelector(
  getWarningState,
  fromWarnings.getAllTimestamp
);
const getSegmentTimestamp = createSelector(
  getAllTimestamp,
  getSelectedSegment,
  (timestamp, segment) => {
    return timestamp[segment];
  }
);

export const getWarningsTimeStamp = (warningType: WarningType) =>
  createSelector(getAllTimestamp, timestamp => timestamp[warningType]);

export const getRegionWarnings = (regionId: string) =>
  createSelector(getAllWarnings, allWarnings => {
    const warningTypes = Object.keys(allWarnings).filter(
      (warningType: WarningType) => warningType !== "FloodLandslide"
    );
    return warningTypes.reduce(
      (acc, warningType: WarningType) => {
        const regionWarnings = allWarnings[warningType].find(
          regionWarnings => regionWarnings.regionId === regionId
        );
        if (regionWarnings) {
          acc[warningType] = regionWarnings;
        }

        return acc;
      },
      <{ [k in WarningType]?: RegionWarnings }>{}
    );
  });

// Forecasts

export const getSectionFetching = getSegmentFetching;
export const getSectionTimestamp = getSegmentTimestamp;

export const getOverviewMapForecasts = () =>
  createSelector(
    getSectionForecasts,
    getSectionGeojson,
    (forecasts, geojson) => {
      return geojson.map(feature => {
        const forecast = forecasts.find(forecast => {
          let featureRegionId = feature.properties.regionId;
          featureRegionId =
            featureRegionId === SOUTH_TRONDELAG ? TRONDELAG : featureRegionId;
          featureRegionId =
            featureRegionId === NORTH_TRONDELAG ? TRONDELAG : featureRegionId;
          return featureRegionId === forecast.regionId;
        });
        const isRegionA = forecast
          ? forecast.regionImportance === RegionImportance.A
          : feature.properties.regionImportance === RegionImportance.A;
        const properties = {
          ...feature.properties,
          display: isRegionA || (forecast && forecast.highestRating > 0),
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

export const getFavoritesListForecasts = (regionId: string) =>
  createSelector(getSectionForecasts, getFavorites, (forecasts, favorites) => {
    return forecasts
      .filter(forecast => favorites.indexOf(forecast.regionId) > -1)
      .filter(forecast => {
        if (regionId) {
          return (
            forecast.regionType === "Municipality" &&
            forecast.regionId.startsWith(regionId)
          );
        } else {
          return forecast;
        }
      })
      .sort((forecastA, forecastB) => {
        return forecastA.regionName > forecastB.regionName ? 1 : -1;
      });
  });

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
            // Sort index is region id
            // Region "3001": "Svalbard øst" north
            // Region "3046": "Østfold" south
            return forecastA.sortIndex > forecastB.sortIndex ? 1 : -1;
          } else if (regionId) {
            // Alphabetical sorting for municipalities
            return forecastA.regionName > forecastB.regionName ? 1 : -1;
          } else {
            // North to south sorting for counties
            // Sort index is region id, except for Trondelag where
            // 50 is excanged for 16 when forecast is created
            // County "20": "Finnmark", north
            // County "01": "Østfold", south
            return forecastA.sortIndex > forecastB.sortIndex ? -1 : 1;
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
        warnings: highestWarnings,
        // Trondelag is now id 50, but location 16
        sortIndex: region.id === TRONDELAG ? SOUTH_TRONDELAG : region.id
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
