var gPloy = require(gPloyLibs + "/gPloy");

module.exports = function() {
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
}