#!/usr/local/bin/node

global.debug = process.env.DEBUG === 'true';

var path = require('path');
var fs = require('fs');

require('colors');

console.log('Welcome to gPloy v1.0.1 - Continious Deployment Server'.bold.magenta);

global.userHome         = process.env.APPDATA || process.env.HOME;
global.user             = process.env.USERNAME || process.getuid();
global.gPloyHome        = path.resolve(global.userHome, '.gploy/');

//Check for paths.json
if (fs.existsSync(path.resolve(__dirname, "../paths.json"))) {
    var content = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../paths.json")).toString());
    if (content.home) {
        global.gPloyHome = content.home;
    }
}

global.gPloyConfdir     = path.resolve(gPloyHome, './configs/');
global.gPloyLibs        = path.resolve(__dirname, '../lib');
global.gPloyLog         = path.resolve(gPloyHome, './gploy.log');
global.gPloyErrorLog    = path.resolve(gPloyHome, './gploy.err.log');

if (debug) {
    console.log(" [DEBUG] Setting userHome to ".blue + userHome.blue);
    console.log(" [DEBUG] Setting user to ".blue + user.blue);
    console.log(" [DEBUG] Setting gPloyHome to ".blue + gPloyHome.blue);
    console.log(" [DEBUG] Setting gPloyConfdir to ".blue + gPloyConfdir.blue);
    console.log(" [DEBUG] Setting gPloyLibs to ".blue + gPloyLibs.blue);
    console.log(" [DEBUG] Setting gPloyLog to ".blue + gPloyLog.blue);
    console.log(" [DEBUG] Setting gPloyErrorLog to ".blue + gPloyErrorLog.blue);
}

var gPloyCLI = require('./cli');
var action = process.argv[2];

if (debug) {
    console.log(" [DEBUG] Wanted action: ".blue + action.blue);
}

if (typeof gPloyCLI[action] !== "undefined") {
    gPloyCLI[action].apply();
} else {
    if (debug) {
        console.log(" [DEBUG] Wanted action not found. Displaying help.".blue);
    }

    gPloyCLI.help();
}