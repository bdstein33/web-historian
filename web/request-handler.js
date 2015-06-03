var path = require('path');
var archive = require('../helpers/archive-helpers');
var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10,
  'Content-Type': "application/json" // Seconds.
};

var sendResponse = function(response, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end();
};

// require more modules/folders here!

exports.handleRequest = function (req, res) {
  console.log(req.method);

  if( (/\/websites/).test(req.url) ){
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
      })

      sendResponse(res, 201);
    }
  }


  res.end(archive.paths.list);
};


// 1. / serve index.html
// 2, /website
//www.google.com



