import { SectionType } from "./Section";

export interface LocalStorage {
  rootSection: SectionType | string; // String added here for old section type indicators "AVALANCHE", "FLOOD_LANDSLIDE"
  pushToken: string;
  favoritesAreaIds: string[];
  lastNotifiedAppVersion: string;
}

export const defaultLocalStorage: LocalStorage = {
  rootSection: "FloodLandslide",
  pushToken: null,
  favoritesAreaIds: [],
  lastNotifiedAppVersion: "0.0.0"
};

export const migrateSectionType = (section: string): SectionType => {
  switch (section) {
    case "AVALANCHE":
      return "Avalanche";
    case "FLOOD_LANDSLIDE":
      return "FloodLandslide";
    case "Avalanche" || "FloodLandslide":
      return <SectionType>section;
    default:
      return <SectionType>defaultLocalStorage.rootSection;
  }
};
