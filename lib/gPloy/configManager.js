var fs = require('fs');
var path = require('path');

module.exports = new ConfigManager();

function ConfigManager() {
    var configs = {};

    this.load = function(configdir) {
        console.log("Loading configs from: ", configdir);

        var files = fs.readdirSync(configdir);

        files.forEach(function(file) {
            var content = JSON.parse(fs.readFileSync(path.resolve(configdir, file)).toString());

            Object.keys(content).forEach(function(config) {
                configs[config] = content[config];
            });
        });
    };

    this.findConfigViaSecret = function(secret) {
        return configs[secret];
    };
}