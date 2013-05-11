var fs = require('fs'),
    spawn = require('child_process').spawn,
    out = fs.openSync(process.argv[2], 'a'),
    err = fs.openSync(process.argv[3], 'a');

var child;

function start() {
    console.log("Forever.js starting");

    child = spawn('node', [process.argv[4]].concat(process.argv.slice(4)), {
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

process.on('exit', function() {
    child.kill();
});