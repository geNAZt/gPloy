var spawn = require('child_process').spawn;
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

    this.setup = function(home, config) {
        fs.writeFileSync(path.resolve(__dirname, "../paths.json"), JSON.stringify({home: home}));

        mkdirp(home, 0755, function() { });
        mkdirp(config, 0755, function() { });
    };

    this.isRunning = function(cb) {
        if (fs.existsSync(path.resolve(__dirname, "../gPloy.pid"))) {
            isRunning(parseInt(fs.readFileSync(path.resolve(__dirname, "../gPloy.pid")), 10), function(err, running) {
                if (err) {
                    return cb(err);
                }

                if (running === false) {
                    fs.unlinkSync(path.resolve(__dirname, "../gPloy.pid"));
                }

                return cb(null, running);
            });
        } else {
            return cb(null, false);
        }
    };

    this.setupLogPath = function(logpath) {
        mkdirp(logpath, 0755, function() { });
    };

    this.startInBackground = function(log, errorLog, configs) {
        var child = spawn('node', ["gPloy/foreverWorker.js", log, errorLog, "gPloy/worker.js", configs], {
            detached: true,
            stdio: [ 'ignore', 'ignore', 'ignore'],
            cwd: __dirname
        });

        child.unref();
    };

    this.killBackground = function() {
        if (fs.existsSync(path.resolve(__dirname, "../gPloy.pid"))) {
            var pid = parseInt(fs.readFileSync(path.resolve(__dirname, "../gPloy.pid")), 10);

            isRunning(pid, function(err, running) {
                if (running === true) {
                    process.kill(pid);
                }
            });
        }
    }
}

module.exports = new gPloy();