import { SectionType } from "./Section";

export interface LocalStorage {
  rootSection: string;
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
