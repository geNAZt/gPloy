var fs = require('fs'),
    path = require('path'),
    spawn = require('child_process').spawn,
    out = fs.openSync(process.argv[2], 'a'),
    err = fs.openSync(process.argv[3], 'a');

var pidFile = path.resolve(process.cwd(), "../gPloy.pid");
var child;

fs.writeFileSync(pidFile, process.pid);

function start() {
    console.log("Forever.js starting");

    child = spawn('node', [process.argv[4]].concat(process.argv.slice(4)), {
        stdio: [ 'pipe', out, err ],
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
    fs.unlinkSync(pidFile);
    child.kill();
});