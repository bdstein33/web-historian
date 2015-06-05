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
  response.writeHead(statusCode, headers);
  data = data || '{}';
  response.end(data);
};

// require more modules/folders here!
exports.handleRequest = function (req, res) {
  // POST REQUEST
  if( req.method === "POST" ) {
    var dataStore = '';
    req.on('data', function(data) {
      dataStore += data;

    });

    req.on('end', function(data) {

      var dataObj = restConvert(dataStore);

      archive.addUrlToList(dataObj['url']);

      archive.isUrlArchived(dataObj['url'], function(fileName){
        // REDIRECT TO ARCHIVED PAGE AT THAT PATHNAM
        fs.readFile(fileName, "binary", function(err, file) {
          if( err ) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            res.write(err + "\n");
            res.end();
            return;
          }

          else {
            res.writeHead(302);
          }

          res.write(file, "binary");
          res.end();
        });
      }, function(fileName) {
        fs.readFile(archive.paths.loading, "binary", function(err, file) {
           if( err ) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            res.write(err + "\n");
            res.end();
            return;
          }
          else {
            res.writeHead(302);
          }
          res.write(file, "binary");
          res.end();
        });
      });
    });
  }


  // GET REQUEST
  if( req.method === "GET") {
    if (staticFileRequest(req)) {
      var uri = url.parse(req.url).pathname;
      var fileName = path.join(archive.paths.public, uri);
      fs.exists(fileName, function(exists) {
        if( !exists ) {
          res.writeHead(404, {"Content-Type": "text/plain"});
          res.write("404 Not Found\n");
          res.end();
          return;
        }

        if( fs.statSync(fileName).isDirectory() ) {
          fileName += 'index.html';
        }

        fs.readFile(fileName, "binary", function(err, file) {
          if( err ) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            res.write(err + "\n");
            res.end();
            return;
          }

          if( /.css$/.test(fileName) ) {
            res.writeHead(200, {'Content-Type' : 'text/css'});
          }

          else {
            res.writeHead(200);
          }

          res.write(file, "binary");
          res.end();
        });
      });
    }

    else {
      var uri = url.parse(req.url).pathname;

      var callback = function(result) {
        if (result.indexOf(uri.slice(1)) === -1) {
          sendResponse(res, 404);

        }
        else {
          // Redirect to the right site
           var fileName = path.join(archive.paths.archivedSites, uri);
           fs.readFile(fileName, "binary", function(err, file) {
           if( err ) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            res.write(err + "\n");
            res.end();
            return;
          }
          else {
            res.writeHead(302);
          }
          res.write(file, "binary");
          res.end();
        });

        }
      }

      archive.readListOfUrls(callback);



    }
  }
};

var restConvert = function(string) {
  var array = string.split('&');
  var results = {};
  for( var i = 0; i < array.length; i++ ) {
    var objData = array[i].split("=");
    results[objData[0]] = objData[1];
  }
  return results;
};

var staticFileRequest = function(req) {
  var fileName = url.parse(req.url).pathname;
  if (/.css$/.test(fileName) || /.js$/.test(fileName) || /^\/$/.test(fileName)) {
    return true;
  }
  return false;
}
