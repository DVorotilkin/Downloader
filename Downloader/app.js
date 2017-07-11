'use strict';

var os = require('os');
var http = require('http');
var fs = require('fs');
var url = require('url');
var uuid = require('uuid/v1');
var Downloader = require('mt-files-downloader');


var Statuses = new Array();


http.createServer(function (request, response) {

    var downloader = new Downloader;
    var id = uuid(request);
    Statuses.push(id);
    var path = __dirname + '\\downloads\\' +id + '.jpg';
    var dl = downloader.download(request.url, path);

    dl.setRetryOptions({
        maxRetries: 0,
        retryInterval: 1000
    });

    Statuses[id] = dl.getStats();

    dl.on('start', function () {
        console.log("start");
    });

    dl.on('error', function () 
    {
        Statuses[id] = dl.error;
        console.log(dl.error);
    });

    // Called when the download is finished
    dl.on('end', function () {

        Statuses[id] = dl.getStats();
        console.log(dl.getStats());
    });

    dl.start();

}).listen(8081);

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');

