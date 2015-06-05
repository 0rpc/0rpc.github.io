var zerorpc = require("zerorpc");

var server = new zerorpc.Server({
    hello: function(name, reply) {
        reply(null, "Hello, " + name);
    }
});

server.bind("tcp://0.0.0.0:4242");
