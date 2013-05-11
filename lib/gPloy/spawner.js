var pidManager = require('./pidManager'),
    spawn = require('child_process').spawn;

exports.spawn = function(name, command, args, options) {
    var child = spawn(command, args, options);
    pidManager.insertNew(name, child.pid);

    return child;
};

exports.detached = function(name, command, args, options) {
    options.detached = true;

    var child = spawn(command, args, options);
    pidManager.insertNew(name, child.pid);
    child.unref();

    return child;
};