import * as SectionsActions from "../actions/ui-sections.actions";

import { SectionType } from "../models/Section";
import { WarningType } from "../models/Warning";

export interface State {
  sections: SectionType[];
  selectedSection: SectionType;
  segments: { [k in SectionType]?: WarningType[] };
  selectedSegments: { [k in SectionType]?: WarningType };
}

const initialState: State = {
  sections: ["FloodLandslide", "Avalanche"],
  selectedSection: null,
  segments: {
    Avalanche: ["Avalanche"],
    FloodLandslide: ["FloodLandslide", "Flood", "Landslide"]
  },
  selectedSegments: {
    Avalanche: "Avalanche",
    FloodLandslide: "FloodLandslide"
  }
};

export function reducer(state = initialState, action: SectionsActions.All) {
  switch (action.type) {
    case SectionsActions.SELECT_SECTION:
      return <State>{
        ...state,
        selectedSection: action.payload.section,
        selectedSegments: initialState.selectedSegments
      };
    case SectionsActions.SELECT_SEGMENT:
      const segment = action.payload.segment;
      const section: SectionType =
        state.segments.Avalanche.indexOf(segment) > -1
          ? "Avalanche"
          : "FloodLandslide";
      return {
        ...state,
        selectedSegments: {
          ...state.selectedSegments,
          [section]: segment
        }
      };
    default:
      return state;
  }
}
export const getSections = (state: State) => state.sections;

export const getSelectedSection = (state: State) => state.selectedSection;

export const getSelectedSegment = (state: State) =>
  state.selectedSegments[state.selectedSection];

export const getSegments = (state: State) =>
  state.segments[state.selectedSection];
