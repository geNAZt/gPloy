var fs = require('fs');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var path = require('path');

module.exports = new Deployer();

function Deployer() {

    var self = this;

    this.deploy = function(config, callback) {
        var appname = config.name;
        var workDir = config.workDir;
        var logpath = config.logpath;

        console.log('deploying app', {workDir: workDir, appname: appname});

        //check for NO_DEPLOY file
        var noDeployFilePath = path.resolve(workDir, 'NO_DEPLOY');

        console.info('checking for NO_DEPLOY');

        fs.exists(noDeployFilePath, function(exists) {
            if(exists) {
                console.log('NO_DEPLOY exists, so abort');
                callback(null, false);
            } else {
                //npm install
                console.log('executing npm install');
                self.executeIfExists(workDir, 'package.json', 'npm install', afterNpmInstalled);
            }
        });

        function afterNpmInstalled(error) {
            if(!error) {
                console.log('executing pre.js');
                self.executeIfExists(workDir, 'pre.js', 'node pre.js', afterPreJsExecuted);
            } else {
                console.error('error on npm install', {error: error});
                callback(wrapError('NPM_INSTALL_ERROR', error));
            }
        }

        function afterPreJsExecuted(error) {
            //Try to find out the start script
            if(!error) {
                self.findStartScript(workDir, function(error, file) {
                    if(error) {
                        console.log("Error in finding startscript", workDir);
                        afterAppStarted(error);
                    }

                    if(typeof file !== "undefined") {
                        console.log('starting the application with ', file);

                        var outLogs = path.resolve(logpath, appname + '.log');
                        var errLogs = path.resolve(logpath, appname + '.err.log');

                        var child = spawn('node', ["forever.js", outLogs, errLogs, file], {
                            detached: true,
                            stdio: [ 'ignore', 'ignore', 'ignore' ],
                            cwd: workDir
                        });

                        child.unref();

                        afterAppStarted(null);
                    } else {
                        console.log("No startscript found - bypassing", {appname: appname});
                        afterAppStarted(null);
                    }
                });
            } else {
                console.error('error on executing pre.js', {error: error});
                callback(wrapError('PRE_JS_ERROR', error));
            }
        }

        function afterAppStarted(error) {
            if(!error) {
                console.info('executing post.js');
                self.executeIfExists(workDir, 'post.js', 'node post.js', afterPostJsExecuted);
            } else {
                console.log('error on starting the app', {error: error});
                callback(wrapError('APP_START_ERROR', error));
            }
        }

        function afterPostJsExecuted(error) {
            if(!error) {
                console.log('deployment completed', {appname: appname, workDir: workDir});
                callback();
            } else {
                console.log('error on executing post.js', {error: error});
                callback(wrapError('POST_JS_ERROR', error));
            }
        }

    };

    function wrapError(id, error) {
        return {
            code: id,
            message: error.message
        };
    }

    this.executeIfExists = function executeIfExists(cwd, file, command, callback) {
        var filepath = path.resolve(cwd, file);
        fs.exists(filepath, function(exists) {
            if(exists) {
                exec(command, {cwd: cwd, maxBuffer: 2048*1024 }, afterExecuted);
            } else {
                callback(null, false);
            }
        });

        function afterExecuted(err) {
            if(err) {
                callback(err, false);
            } else {
                callback(null, true);
            }
        }
    }

    this.findStartScript =  function(location, callback) {
        fs.readdir(location, function(err, files) {
            if(!err) {
                for(var index in files) {
                    var file = files[index];
                    if(file.match(/^app.*\.js$/)) {
                        return callback(null, file);
                    }
                }

                return callback();
            } else {
                callback(err);
            }
        });
    };
}