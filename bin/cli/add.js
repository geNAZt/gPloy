var fs = require('fs');
var gPloy = require(gPloyLibs + "/gPloy");
var path = require('path');

module.exports = function() {
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
                console.log(" gploy isnt running in the moment. Start it to deploy".yellow);
            } else {
                gPloy.killBackground();
                gPloy.startInBackground();
            }
        });
    } else {
        console.log(' Project Name Required:'.red);
        console.log('  eg: gploy add project-name');
    }
}