'use strict';

var http = require('http');

// Options to be used by request 
var options = {
    host: 'localhost',
    port: '8081',
    //path: 'https://pp.userapi.com/c543109/v543109048/50de3/Wg3mEVhc8m0.jpg',
    method: 'POST',
    timeout: 10000,
};


var req = http.request(options, (res) => {
    var output = '';
    console.log('STATUS: ' + res.statusCode);
    res.on('data', (chunk) => {
        console.log('A new chunk: ', chunk);
        output += chunk;
    });


    res.on('end', () => {
        console.log(JSON.parse(output));
        console.log('End GET Request');
    });


    res.on('error', (err) => {
        console.log('Error: ', err);
    });
});
req.write("cf8ff490-66f8-11e7-9e8f-67a0b368f701");
req.end();



