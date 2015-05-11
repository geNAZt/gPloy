var path = require('path');
var fs = require('fs');

module.exports = new PidManager();

function PidManager() {
    var pids = {};

    var pidFile = path.resolve(__dirname, "../../gPloy.pid");
    var lockFile = path.resolve(__dirname, "../../pid.lock");

    if (fs.existsSync(pidFile)) {
        if (debug) {
            console.log(" [DEBUG] Found a pid file".blue);
        }

        try {
            pids = JSON.parse(fs.readFileSync(pidFile).toString());
        } catch(e) {
            throw new Error("Error in parsing the JSON pids");
        }
    } else {
        if (debug) {
            console.log(" [DEBUG] Found no pid file".blue);
        }
    }

    this.cleanup = function() {
        if ( fs.existsSync(pidFile) ) fs.unlinkSync(pidFile);
    };

    function savePidFile() {
        if (!fs.existsSync(lockFile)) {
            fs.writeFileSync(lockFile, 1);
            fs.writeFileSync(pidFile, JSON.stringify(pids));
            fs.unlinkSync(lockFile);
        } else {
            setTimeout(function() {
                savePidFile();
            }, 3);
        }
    };

    this.getAll = function(type) {
        if (Array.isArray(pids[type])) {
            return pids[type];
        } else {
            return [];
        }
    };

    this.insertNew = function(type, pid) {
        if (!Array.isArray(pids[type])) {
            pids[type] = [];
        }

        pids[type].push(pid);
        savePidFile();
    };

    this.remove = function(type, pid) {
        pids[type] = pids[type].splice(pids[type].indexOf(pid), 1);
        savePidFile();
    };
}