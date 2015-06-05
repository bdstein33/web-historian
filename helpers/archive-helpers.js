var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../web/archives/sites'),
  'list' : path.join(__dirname, '../web/archives/sites.txt'),
  'index' : path.join(__dirname, '../web/public/index.html'),
  'loading' : path.join(__dirname, '../web/public/loading.html'),
  'public' : path.join(__dirname, '../web/public'),

};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb){
  fs.readFile(exports.paths.list, "utf8", function(err, data) {
    if (err) throw err;
    data = data.split('\n');
    cb(data);
  });
};

exports.isUrlInList = function(fileName, cb){
  exports.readListOfUrls(function(result) {
    if (result.indexOf(fileName) !== -1) {
      cb(fileName)
    }
  });
};

exports.addUrlToList = function(url){
  exports.readListOfUrls(function(result) {
    if (result.indexOf(url) === -1) {
      fs.appendFile(exports.paths.list, url + '\n');
    }
  });

};

exports.isUrlArchived = function(url, cb1, cb2){
  var fileName = exports.paths.archivedSites + "/" + url;
  fs.exists(fileName, function(exists) {
    console.log(exists);
    if (exists) {
      cb1(fileName);
    } else {
      cb2(fileName);
    }
  })
};

// exports.downloadUrls = function(){
//   exports.readListOfUrls(function(data){
//     for (var i = 0; i < data.length; i++) {
//       exports.isUrlArchived(data[i],
//         function(fileName){
//         return;
//       }), function (filePath) {
//         http.get(data[i], function(err, res) {
//           if (err) throw err;
//         })
//         //get html
//         //create file
//         //reference data[i] for website url
//         //fileName will be the name of the new file created
//       }
//     }
//   })
// };


exports.downloadUrls = function(){
  var uri;
  exports.readListOfUrls(function(data){
    for (var i = 0; i < data.length-1; i++) {
      uri = data[i];
      //console.log(uri);
      exports.isUrlArchived(data[i],
        function(fileName){
        },
        function(filePath){
          console.log(uri);
          request('http://' + uri).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + uri));
        });
    }
    return true;
  });
};
