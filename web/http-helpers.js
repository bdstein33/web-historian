var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');


exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};


exports.sendResponse = function(response, obj, status) {
  status = status || 200;
  response.writeHead(status);
  response.end(obj);
};

exports.serveAssets = function(response, asset, callback) {
  var encoding = {encoding: 'utf8'}
  var filePath = archive.paths.siteAssets + asset;
  fs.readFile(filePath, encoding, function(err, data) {
    if (err) {
      filePath = archive.paths.archivedSites + asset;
      fs.readFile(filePath, encoding, function(err, siteData) {
        if (err) {
          exports.sendResponse(response, "404: Page Not Found", 404);
        }
        else {
          exports.sendResponse(response, siteData);
        }
      });
    }
    else {
      console.log(data);
      exports.sendResponse(response, data);
    }
  })
};

exports.collectData = function(response, callback) {
  var data = '';

  response.on('data', function(chunk){
    data += chunk;
  });

  response.on('end', function() {
    callback(data);
  });
};



// As you progress, keep thinking about what helper functions you can put here!
