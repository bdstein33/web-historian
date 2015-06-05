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
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
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
  fs.readFile(exports.paths.list, function(err, data){
    if (err) throw err;
    sites = data.toString().split('\n');
    cb(sites);
  });
};

exports.isUrlInList = function(url, cb){
  exports.readListOfUrls(function(sites){
    var found = sites.indexOf(url) > -1;
    cb(found);
  });
};

exports.addUrlToList = function(url){
  fs.appendFile(exports.paths.list, url + '\n', function(err, file) {
    if (err) throw err;
  });
};

exports.isUrlArchived = function(url, cb){
  var sitePath = path.join(exports.paths.archivedSites, url);
  fs.exists(sitePath, function(exists) {
    cb(exists);
  });
};

exports.downloadUrls = function(urls){
  _.each(urls, function(url) {
    if(!url){ return; }
    request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + "/" + url));
  });
  return true;
};
