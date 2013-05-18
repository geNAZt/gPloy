global.debug = process.env.DEBUG === 'true';

var fs = require('fs'),
    path = require('path'),
    spawn = require(path.resolve(process.cwd(), './spawner.js')).spawn,
    out = fs.openSync(process.argv[2], 'a'),
    err = fs.openSync(process.argv[3], 'a');

function start() {
    console.log("Application "+ process.argv[5] +" starting");

    var child = spawn(process.argv[5], 'node', [process.argv[6]].concat(process.argv.slice(7)), {
        stdio: [ 'ignore', out, err ],
        cwd: process.argv[4]
    });

    child.on('exit', function() {
        setTimeout(function(){
            start();
        }, 2000);
    });
}

start();