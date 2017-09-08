export const firebase = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};

export const ionicCloud = {
  'core': {
    'app_id': ''
  },
  'push': {
    'sender_id': '',
    'pluginConfig': {
      'ios': {
        'alert': true,
        'badge': false,
        'sound': false,
        'clearBadge': true
      },
      'android': {
        'icon': 'ic_stat_not_icon',
        'iconColor': '#e46900',
        'clearBadge': true,
        'clearNotifications': false,
      }
    }
  }
}

export const store = {
  storeFreeze: true
}