=== Varsom App ===

The app version of varsom.no

== Getting started ==
1. Clone this repo
2. Make sure you have ionic installed globally
  * This app uses ionic-cli version 3
  * At the moment version 3 is in beta `npm install -g ionic@beta` 
3. Run `npm install`

== Prod routines ==

* Update values in `ionic.config.json` to prod values.
* Update values in `.io-config.json` to prod values.
* Update values in `src/app/app.module.ts` to prod values
  * Both firebase and ionic
* Update `name` and `widget.id` in config.xml
  * `<name>Varsom</name>`
  * `<widget id="no.nve.varsom">`
* Save plugins, remove platform and add platform again. 
  * This must be done when name or id is changed.
  * Save plugins: `ionic plugin save`. 
  * Remove platform: `ionic platform rm ios`. 
  * Add platform: `ionic platform add ios`. 
* Build using `ionic build ios --prod`
* Open workspace in Xcode
  * Add push capabilities
  * Archive
  * Upload to App Store
 

