var http = require('http');
var router = require('router');
var configManager = require('./configManager');
var deployer = require('./deployer');

module.exports = new WebHook();

function WebHook() {
    var route = router();

    route.get('/deploy/{secret}', function(req, res) {
        var config = configManager.findConfigViaSecret(req.params.secret);

        if (typeof config !== "undefined") {
            require('./repo/' + config.type)(config, function(err) {
                if(!err) {
                    deployer.deploy(config, function(err, finished) {
                        if(err) console.log(err);
                    });
                } else {
                    console.log("Error in getting repo content: ", err);
                }
            });
        }

        res.writeHead(200);
        res.end('');
    });

    this.start = function() {
        http.createServer(route).listen(configManager.getServerConfig().port, function() {
            console.log("Bound the webHook to port 10010")
        });
    }
}