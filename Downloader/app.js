'use strict';

var os = require('os');
var http = require('http');
var fs = require('fs');
var url = require('url');
var uuid = require('uuid/v1');
var mtd = require('zeltice-mt-downloader')

var Statuses = {};


const Status =
    {
        InProcess: 0,
        Error: 1,
        Success: 2
    }


//load Statuses
if (fs.existsSync('statuses.json')) {
    var data = fs.readFileSync('statuses.json');
    Statuses = JSON.parse(data);
}

//save Statuses
var save = function () {

    fs.writeFile('statuses.json', JSON.stringify(Statuses), function (err) {
        if (err) {
            return console.error(err);
        }
    });
    console.log("Saved:", Statuses);
    //exit(0);
};


process.on('SIGINT', save);



http.createServer(function (request, response) {
    let body = [];
    request.on('error', (err) => {
        console.error(err);
        return;
    });
    request.on('data', (chunk) => {
        body.push(chunk);
    })
    request.on('end', () => {
        body = Buffer.concat(body).toString();

        if (request.url !== '/') {

            var id = uuid(request.url);

            var path = __dirname + '\\downloads\\' + id + '.jpg';
            var options = {
                onStart: function (meta) {
                    if (Statuses[id] != undefined)
                        Statuses.length++;
                    Statuses[id] = Status.InProcess;
                    console.log('Download Started');
                },

                onEnd: function (err, result) {
                    if (err) {
                        Statuses[id] = Status.Error;
                        console.error(err);
                    }
                    else {
                        Statuses[id] = Status.Success;
                        console.log('Download Complete');
                    }
                }
            }
            var downloader = new mtd(path, request.url, options)
            downloader.start();
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify({ id: id }));
        }
        else {
            if (Statuses[body] != undefined) {
                console.log("Recived id:" + body);
                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json');

                if (Statuses[body] == Status.Success) {
                    //response
                    response.end(JSON.stringify({
                        status: Statuses[body],
                        ref: '/downloads/' + id + '.jpg'
                    }));
                }
                else {
                    response.end(JSON.stringify({ status: Statuses[body] }));
                }
            }
            else {
                response.statusCode = 404;
                response.end();
            }
        }

        
    });
        

    
}).listen(8081);

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');

