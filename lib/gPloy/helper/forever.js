global.debug = process.env.DEBUG === 'true';

var fs = require('fs'),
    spawn = require(path.resolve(process.cwd(), './gPloy/spawner.js')).detached,
    out = fs.openSync(process.argv[2], 'a'),
    err = fs.openSync(process.argv[3], 'a');

function start() {
    console.log("Application "+ process.argv[4] +" starting");

    var child = spawn(process.argv[4], 'node', [process.argv[4]].concat(process.argv.slice(4)), {
        stdio: [ 'ignore', out, err ],
        cwd: process.cwd()
    });

    child.on('exit', function() {
        setTimeout(function(){
            start();
        }, 2000);
    });
}

start();