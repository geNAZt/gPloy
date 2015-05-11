var fs = require('fs');
var path = require('path');
var deployer = require('./deployer');

module.exports = new ConfigManager();

function ConfigManager() {
    var configs = {};
    var configFile = path.resolve(__dirname, "../../config.json");
    var serverConfig = JSON.parse(fs.readFileSync(configFile));

    this.load = function(configdir) {
        console.log("Loading configs from: ", configdir);

        var files = fs.readdirSync(configdir);

        files.forEach(function(file) {
            var content = JSON.parse(fs.readFileSync(path.resolve(configdir, file)).toString());

            Object.keys(content).forEach(function(config) {
                configs[config] = content[config];

                deployer.deploy(configs[config], function(err) {
                    if(err) console.log(err);

                    else {

                    }
                });
            });
        });
    };

    this.findConfigViaSecret = function(secret) {
        return configs[secret];
    };

    this.getServerConfig = function() {
        return serverConfig;
    };
}