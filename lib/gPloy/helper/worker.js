global.debug = process.env.DEBUG === 'true';

var fs = require('fs');
var path = require('path');

//Check for paths.json
if (fs.existsSync(path.resolve(process.cwd(), "../paths.json"))) {
    var content = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "../paths.json")).toString());
    if (content.home) {
        global.gPloyHome = content.home;
    }
}

global.gPloyConfdir     = path.resolve(gPloyHome, './configs/');
global.gPloyLibs        = path.resolve(__dirname, '../');
global.gPloyLog         = path.resolve(gPloyHome, './gploy.log');
global.gPloyErrorLog    = path.resolve(gPloyHome, './gploy.err.log');

var webhook = require('./../webhook');
var configs = process.argv[3];
var configManager = require('./../configManager');

console.log("Reading configs ", configs);
configManager.load(configs);

webhook.start();