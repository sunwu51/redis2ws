var app = require('express')()
var server=require('http').createServer(app);
var io = require('socket.io').listen(server)
var redis = require("redis")
var redisClient = redis.createClient()
var redisClient2 = redis.createClient()

var app = {
    start: function(port){
        //捕捉异常
        io.on("error", function (err) {
            console.log("Error " + err);
        });
        redisClient.on("error", function (err) {
            console.log("Error " + err);
        });
        server.listen(port)

        //redis订阅所有channel，并转发至socket.io
        redisClient.psubscribe("*")
        redisClient.on("pmessage", function (p,channel, message) {
            console.log('redis recv',channel,message);
            io.sockets.emit(channel,message)
        });

        //io订阅所有topic，并转发至redis
        io.on('connection',function(socket){
            var onevent = socket.onevent;
            socket.onevent = function (packet) {
                var args = packet.data || [];
                onevent.call (this, packet);    // original call
                packet.data = ["*"].concat(args);
                onevent.call(this, packet);      // additional call to catch-all
            };
            socket.on("*",(event,data)=>{
                console.log('io recv',event,data);
                redisClient2.publish(event,data)
            })
        });

    }
};

// export default app;
module.exports=app

