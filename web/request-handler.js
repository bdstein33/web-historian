var path = require('path');
var archive = require('../helpers/archive-helpers');
var utils = require('./http-helpers');
var urlParser = require('url');
var fs = require('fs');
// require more modules/folders here!

var actions = {
  'GET' : function(request, response) {
    var url = request.url;
    var urlPath = url === '/' ? '/index.html' : url;
    utils.serveAssets(response, urlPath);

  },

  'POST' : function(request, response) {
    utils.collectData(request, function(data) {
      var url = data.split('=')[1];
      archive.isUrlInList(url, function(found) {
        if (found) {
          archive.isUrlArchived(url, function(exists) {
            if (exists) {
              utils.serveAssets(response, '/' + url)
            }
            else {
              utils.serveAssets(response, '/loading.html');
            }
          });
        }
        else {
          archive.addUrlToList(url);
        }
      })
    });
  },
}

exports.handleRequest = function (request, response) {
  //doesn't work when this code is active but this code is active to update the links

  // archive.readListOfUrls(function(data) {
  //   archive.downloadUrls(data)
  // });
  console.log(request.method);
  var action = actions[request.method];
  if (action) {
    action(request, response);
  }
  else {
    utils.sendResponse(response, "404: Page Not Found", 404)
  }
};