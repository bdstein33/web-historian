var path = require('path');
var fs = require('fs');
var url = require('url');
var archive = require('../helpers/archive-helpers');



var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10,
  'Content-Type': "application/json" // Seconds.
};

var sendResponse = function(response, statusCode, data) {
  statusCode = statusCode || 200;
  console.log(statusCode);
  console.log(headers);
  response.writeHead(statusCode, headers);
  data = data || '{}';
  response.end(data);
};

// require more modules/folders here!

exports.handleRequest = function (req, res) {
  // Handles POST requests to /websites
  if( /\/websites/.test(req.url) ){
    if( req.method === 'OPTIONS'){
      sendResponse(res);
    }

    else if( req.method === "POST" ) {
      var dataStore = '';
      req.on('data', function(data) {
        dataStore += data;
      });

      req.on('end', function() {
        console.log(JSON.parse(dataStore));
      });

      sendResponse(res, 201);
    }
  }
  // Handles GET requests for archived websites
  else if( /\/\w{1,}/.test(req.url) ) {
    var path = url.parse(req.url).path;
    if( req.method === "GET" ) {
      sendResponse(res, 200, path);
    }
  }

  // Handles GET requests to home page
  else if ( /\//.test(req.url) ) {
    console.log(req.method);
    if( req.method === 'GET'){
      fs.readFile(archive.paths.index, 'utf8', function(err, data) {
        if (err) throw err;
        // sendResponse(res, 200, data);
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(data, 'utf-8');
    });
      // sendResponse(res, 200, '<input>');
    }
  }

};


// 1. / serve index.html
// 2, /website
//www.google.com



