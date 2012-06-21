var zerorpc = require("zerorpc");

var server = new zerorpc.Server({
    bad: function(reply) {
        //The first parameter to reply() is for errors
        //Also possible:
        //  reply(new Error(":P"), null, false);
        reply(":P", null, false);
    }
});

server.bind("tcp://0.0.0.0:4242");