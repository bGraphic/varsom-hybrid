export const NVE_API = {
  REGIONS_PATHS: {
    Avalanche:
      "http://api01.nve.no/hydrology/forecast/avalanche/v3.0.0/api/Region/",
    FloodLandslide:
      "http://api01.nve.no/hydrology/forecast/flood/v1.0.4/api/Region/"
  },
  WARNINGS_PATHS: {
    Avalanche:
      "http://api01.nve.no/hydrology/forecast/avalanche/v3.0.0/api/Warning/All/1/",
    Flood:
      "http://api01.nve.no/hydrology/forecast/flood/v1.0.4/api/Warning/All/1/",
    Landslide:
      "http://api01.nve.no/hydrology/forecast/landslide/v1.0.4/api/Warning/All/1/"
  }
};

export const REFRESH = 30000;

export const firebase = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};

export const ionicCloud = {
  core: {
    app_id: ""
  },
  push: {
    sender_id: "",
    pluginConfig: {
      ios: {
        alert: true,
        badge: false,
        sound: false,
        clearBadge: true
      },
      android: {
        icon: "ic_stat_not_icon",
        iconColor: "#e46900",
        clearBadge: true,
        clearNotifications: false
      }
    }
  }
};
