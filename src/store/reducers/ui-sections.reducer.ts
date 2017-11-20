import * as SectionsActions from "../actions/ui-sections.actions";

import { SectionType } from "../models/Section";
import { WarningType } from "../models/Warning";

export interface State {
  warningTypes: { [k in SectionType]?: WarningType[] };
  selectedSection: SectionType;
  selectedWarningType: { [k in SectionType]?: WarningType };
}

const initialState: State = {
  warningTypes: {
    Avalanche: ["Avalanche"],
    FloodLandslide: ["FloodLandslide", "Flood", "Landslide"]
  },
  selectedSection: "FloodLandslide",
  selectedWarningType: {
    Avalanche: "Avalanche",
    FloodLandslide: "FloodLandslide"
  }
};

export function reducer(state = initialState, action: SectionsActions.All) {
  switch (action.type) {
    case SectionsActions.SELECTED_SECTION:
      return {
        ...state,
        selectedSection: action.payload.section,
        selectedWarningType: initialState.selectedWarningType
      };
    case SectionsActions.SELECT_WARNING_TYPE:
      const warningType = action.payload.warningType;
      const section: SectionType =
        state.warningTypes.Avalanche.indexOf(warningType) > -1
          ? "Avalanche"
          : "FloodLandslide";
      return {
        ...state,
        selectedWarningType: {
          ...state.selectedWarningType,
          [section]: warningType
        }
      };
    default:
      return state;
  }
}

export const getSelectedWarningType = (state: State) =>
  state.selectedWarningType;

export const getWarningTypes = (state: State) => state.warningTypes;
