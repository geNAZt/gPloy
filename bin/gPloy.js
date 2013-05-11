#!/usr/bin/env node

var path = require('path');
var colors = require('colors');
var fs = require('fs');

var userHome = process.env.APPDATA || process.env.HOME;
var user = process.env.USERNAME || process.getuid();

var gPloyHome = path.resolve(userHome, '.gploy/');

//Check for paths.json
if (fs.existsSync(path.resolve(__dirname, "../paths.json"))) {
    var content = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../paths.json")).toString());
    if (content.home) {
        gPloyHome = content.home;
    }
}

var gPloyConfdir = path.resolve(gPloyHome, './configs/');
var gPloyLibs = path.resolve(__dirname, '../lib');
var gPloyLog = path.resolve(gPloyHome, './gploy.log');
var gPloyErrorLog = path.resolve(gPloyHome, './gploy.err.log');

var gPloy = require(gPloyLibs + '/gPloy');

var action = process.argv[2];

console.log('Welcome to gPloy v1.0.0 - Continious Deployment Server'.bold.magenta);

if (action == "start") {
    gPloy.isRunning(function(err, running) {
        if (err) {
            console.log(" Error getting the worker status".red);
            console.log(err.message.red);
            console.log(err.stack);
            process.exit(-1);
        }

        if (running === false) {
            gPloy.setup(gPloyHome, gPloyConfdir);

            console.log(" gPloy isnt running in the moment".green);
            gPloy.startInBackground(gPloyLog, gPloyErrorLog, gPloyConfdir);
        } else {
            console.log(" gPloy is running in the moment".yellow);
        }
    });
} else if(action == "restart") {
    gPloy.isRunning(function(err, running) {
        if (err) {
            console.log(" Error getting the worker status".red);
            console.log(err.message.red);
            console.log(err.stack);
            process.exit(-1);
        }

        if (running === false) {
            gPloy.setup(gPloyHome, gPloyConfdir);

            console.log(" gPloy isnt running in the moment".green);
            gPloy.startInBackground(gPloyLog, gPloyErrorLog, gPloyConfdir);
        } else {
            gPloy.killBackground();
            gPloy.startInBackground(gPloyLog, gPloyErrorLog, gPloyConfdir);

            console.log(" gPloy restarted".green);
        }
    });
} else if(action == "stop") {
    gPloy.isRunning(function(err, running) {
        if (err) {
            console.log(" Error getting the worker status".red);
            console.log(err.message.red);
            console.log(err.stack);
            process.exit(-1);
        }

        if (running === true) {
            gPloy.killBackground();

            console.log(" gPloy stopped".green);
        }
    });
} else if(action == "add") {
    var name = process.argv[3];
    var repoType = (process.argv[4])? process.argv[4]: 'git';
    var origin = (process.argv[5])? process.argv[5]: 'origin';
    var branch = (process.argv[6])? process.argv[6]: "master";

    if (name) {
        var json = {};
        var add = true;

        if (fs.existsSync(path.resolve(gPloyConfdir, user + ".json"))) {
            json = JSON.parse(fs.readFileSync(path.resolve(gPloyConfdir, user + ".json")).toString());

            //Check if this dir is already listed
            Object.keys(json).forEach(function(key) {
                var content = json[key];
                if (content.workDir == process.cwd()) {
                    console.log(' Project was already added'.yellow);
                    console.log('  Add the webhook'.yellow + ' http://hostname:10010/deploy/'.green + key.green + ' to your git repo'.yellow);
                    add = false;
                }
            });
        }

        if (add) {
            var secret = gPloy.getNewSecret();

            var logpath = path.resolve(userHome + "/.gploy/");

            gPloy.setupLogPath(logpath);

            json[secret] = {
                owner: user,
                workDir: process.cwd(),
                type: repoType,
                origin: origin,
                branch: branch,
                name: name,
                logpath: logpath
            };

            fs.writeFile(path.resolve(gPloyConfdir, user + ".json"), JSON.stringify(json));

            console.log(' Added Project'.green);
            console.log('  Add the webhook'.yellow + ' http://hostname:10010/deploy/'.green + secret.green + ' to your git repo'.yellow);
        }

        gPloy.isRunning(function(err, running) {
            if (err) {
                console.log(" Error getting the worker status".red);
                console.log(err.message.red);
                console.log(err.stack);
                process.exit(-1);
            }

            if (running === false) {
                console.log(" gPloy isnt running in the moment. Start it to deploy".yellow);
            }
        });
    } else {
        console.log(' Project Name Required:'.red);
        console.log('  eg: gPloy add project-name');
    }
} else {

}