var fs = require('fs');
var path = require('path');
var webhook = require('./webhook');
var configs = process.argv[3];
var configManager = require('./configManager');

console.log("Reading configs ", configs);
configManager.load(configs);

webhook.start();