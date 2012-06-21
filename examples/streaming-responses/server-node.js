var zerorpc = require("zerorpc");

var server = new zerorpc.Server({
    streaming_range: function(from, to, step, reply) {
        for(var i=from; i<to; i+=step) {
            reply(i, i + step < to);
        }
    }
});

server.bind("tcp://0.0.0.0:4242");