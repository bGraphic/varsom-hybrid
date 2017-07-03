#!/usr/bin/env node

var filestocopy = [
  {
    "resources/android/not/drawable-hdpi/ic_stat_not_icon.png":
    "platforms/android/res/drawable-hdpi/ic_stat_not_icon.png"
  },
  {
    "resources/android/not/drawable-mdpi/ic_stat_not_icon.png":
    "platforms/android/res/drawable-mdpi/ic_stat_not_icon.png"
  },
  {
    "resources/android/not/drawable-xhdpi/ic_stat_not_icon.png":
    "platforms/android/res/drawable-xhdpi/ic_stat_not_icon.png"
  },
  {
    "resources/android/not/drawable-xxhdpi/ic_stat_not_icon.png":
    "platforms/android/res/drawable-xxhdpi/ic_stat_not_icon.png"
  },
  {
    "resources/android/not/drawable-xxxhdpi/ic_stat_not_icon.png":
    "platforms/android/res/drawable-xxxhdpi/ic_stat_not_icon.png"
  }
];

var fs = require('fs');
var path = require('path');

// no need to configure below
var rootdir = path.dirname(process.argv[2]);
console.log("~~~~ Start Copying Notification Status Icons");
filestocopy.forEach(function (obj) {
  Object.keys(obj).forEach(function (key) {
    var val = obj[key];
    var srcfile = path.join(rootdir, key);
    var destfile = path.join(rootdir, val);
    console.log("copying: " + srcfile);
    console.log("     to: " + destfile);
    var destdir = path.dirname(destfile);
    if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
      fs.createReadStream(srcfile).pipe(
        fs.createWriteStream(destfile));
    }
  });
});
console.log("~~~~ End Copying Notification Status Icons");
console.log("");