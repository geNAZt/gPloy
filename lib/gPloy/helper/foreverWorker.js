global.debug = process.env.DEBUG === 'true';

var fs = require('fs'),
    path = require('path'),
    spawn = require(path.resolve(process.cwd(), './gPloy/spawner.js')).detached,
    out = fs.openSync(process.argv[2], 'a'),
    err = fs.openSync(process.argv[3], 'a');

function start() {
    console.log("gPloy-forever starting");

    var child = spawn("gPloy-worker", 'node', [process.argv[4]].concat(process.argv.slice(4)), {
        stdio: [ 'ipc', out, err ],
        cwd: process.cwd()
    });

    child.on('exit', function() {
        setTimeout(function(){
            start();
        }, 2000);
    });
}

start();