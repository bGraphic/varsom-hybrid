=== Varsom App ===

The app version of varsom.no

== Getting started ==

1. Clone this repo
2. Make sure you have ionic installed globally
  * This app uses ionic-cli version 3
3. Run `npm install`
4. Ask for permission to repo [varsom-secrets](https://github.com/bGraphic/varsom-secrets)

== Dev routines ==

* Run the app in the browser with `ionic serve`
  * User `ionic serve --lab` to see both iOS and Android styling

== Test routines ==

* Android
  * Test on Android by running `ionic cordova run android --device`

== Prod routines ==

* Update values in `src/app/app.module.ts` to prod values
  * Both firebase and ionic
  * Check [varsom-secrets](https://github.com/bGraphic/varsom-secrets)
* Update values in `ionic.config.json` to prod values.
  * Check [varsom-secrets](https://github.com/bGraphic/varsom-secrets)
* Update values in `.io-config.json` to prod values.
  * Check [varsom-secrets](https://github.com/bGraphic/varsom-secrets)
* Update `name`, `widget.id` and `SENDER_ID` in config.xml
  * `<name>Varsom</name>`
  * `<widget id="no.nve.varsom">` for iOS and `<widget id="no.nve.varsom2">` for Android.
  * * Check [varsom-secrets](https://github.com/bGraphic/varsom-secrets) for `SENDER_ID`.
* Update `SENDER_ID` in package.json
  * Check [varsom-secrets](https://github.com/bGraphic/varsom-secrets)
* Save plugins, remove platform and add platform again. 
  * This must be done when name, id or sender id is changed.
  * Save plugins: `ionic cordova plugin save`. 
  * Remove platforms: `ionic cordova platform rm ios` and `ionic cordova platform rm android`. 
  * Add platforms: `ionic cordova platform add ios` and `ionic cordova platform add android`. 
* Generate resources: `ionic cordova resources`.
* Build using `ionic cordova build ios --prod --release`
  * Open workspace in Xcode
    * Add push capabilities
    * Archive
    * Upload to App Store
* Build using `ionic cordova build android --prod --release`
  * Sign using `jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../varsom-secrets/nve.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk regobs`
  * Zip using `zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk varsom.apk`
  * Verify using `jarsigner -verify varsom.apk`
  * Upload to Google Play
  



