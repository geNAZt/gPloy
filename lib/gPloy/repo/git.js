var exec = require('child_process').exec;

module.exports = gitUpdate;

function gitUpdate(config, cb) {
    exec("git pull " + config.origin + " " + config.branch, {cwd: config.workDir}, function(err) {
        cb(err);
    });
}