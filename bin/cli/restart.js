var gPloy = require(gPloyLibs + "/gPloy");

module.exports = function() {
    gPloy.isRunning(function(err, running) {
        if (err) {
            console.log(" Error getting the worker status".red);
            console.log(err.message.red);
            console.log(err.stack);
            process.exit(-1);
        }

        if (running === false) {
            gPloy.setup();

            console.log(" gPloy isnt running in the moment".green);
            gPloy.startInBackground();
        } else {
            gPloy.killBackground();
            gPloy.startInBackground();

            console.log(" gPloy restarted".green);
        }
    });
}