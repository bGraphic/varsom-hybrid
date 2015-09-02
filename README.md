# Varsom | Hybrid
Hybrid app version of varsom.no.
> More information about Varsom projects can be found at https://github.com/bgraphic/varsom-apps

## Requirements to get up and running
These are required to start developing:

* Node.js
* Gulp
* Bower
* Cordova
* Ionic

### Installation
After you have installed latest version of [node.js](https://nodejs.org/en/), boot up a command prompt and run the following (make sure to use sudo, if you are on mac/linux):

    npm install -g gulp
    npm install -g bower
    npm install -g cordova
    npm install -g ionic

## Getting Started
1. Clone the repo `git clone https://github.com/bgraphic/varsom-hybrid`
2. Add environment variables file(s)
3. Run `npm install`

### Environment variables file `config.keys.js`
Add a file `config.keys.js` under `.js/`
This file should look like this:

    var appKeys = {
      debug: {
        "appId": "[The Parse app ID here]",
        "javascriptKey": "[The Parse Javascript key here]"
      }
    };

## Test deployment
In browser on local machine:
run `ionic serve`

In Ionic View app on device:
1. Run `ionic upload`
2. Share link with tester
3. Open ionic view and click download files, and view app

## Production deployment
1. ?Build?
2. ???
