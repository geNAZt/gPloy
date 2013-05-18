var spawn = require('./gPloy/spawner').detached;
var pidManager = require('./gPloy/pidManager');

var fs = require('fs');
var isRunning = require('is-running');
var path = require('path');
var mkdirp = require('mkdirp');
var crypto = require('crypto');

function gPloy() {
    this.getNewSecret = function() {
        function md5(data) {
            var hash = crypto.createHash('md5');
            hash.update(data);
            return hash.digest('hex');
        }

        return md5(Date.now().toString());
    };

    this.setup = function() {
        fs.writeFileSync(path.resolve(__dirname, "../paths.json"), JSON.stringify({home: gPloyHome}));

        mkdirp(gPloyHome, 0755, function() { });
        mkdirp(gPloyConfdir, 0755, function() { });
    };

    this.isRunning = function(cb) {
        var self = this;
        var pid = pidManager.getAll("gPloy-forever");
        var pid2 = pidManager.getAll("gPloy-worker");

        if (pid.length > 1 || pid2.length > 1) {
            if (debug) {
                console.log(" [DEBUG] Found more then 1 pid for a gPloy-forever".blue);
            }

            this.killBackground();

            return cb(null, false);
        } else {
            if (typeof pid[0] === "number") {
                isRunning(pid[0], function(err, running) {
                    if (err) {
                        if (debug) {
                            console.log(" [DEBUG] Error in getting the gPloy-forever status: ".blue, err);
                        }

                        return cb(err);
                    }

                    if (running === false) {
                        self.killBackground();
                    }

                    if (debug) {
                        console.log(" [DEBUG] gPloy-forever is running: ".blue + running.toString().blue);
                    }

                    return cb(null, running);
                });
            } else {
                if (debug) {
                    console.log(" [DEBUG] gPloy-forever pid non numeric".blue);
                }

                return cb(null, false);
            }
        }
    };

    this.setupLogPath = function(logpath) {
        mkdirp(logpath, 0755, function() { });
    };

    this.startInBackground = function() {
        spawn("gPloy-forever", 'node', ["gPloy/helper/foreverWorker.js", gPloyLog, gPloyErrorLog, "gPloy/helper/worker.js", gPloyConfdir], {
            stdio: ['ignore', 'ignore', 'ignore'],
            cwd: __dirname
        });
    };

    this.killBackground = function() {
        var pid = pidManager.getAll("gPloy-forever");
        var pid2 = pidManager.getAll("gPloy-worker");

        pid.forEach(function(p) {
            if (debug) {
                console.log(" [DEBUG] Killed gPloy-forever: ".blue + p.toString().blue);
            }

            try {
                process.kill(p);
            } catch(e) {

            }

            pidManager.remove("gPloy-forever", p);
        });

        pid2.forEach(function(p) {
            if (debug) {
                console.log(" [DEBUG] Killed gPloy-worker: ".blue + p.toString().blue);
            }

            try {
                process.kill(p);
            } catch(e) {

            }

            pidManager.remove("gPloy-worker", p);
        });
    }
}

module.exports = new gPloy();