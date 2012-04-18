console.log('Starting Battleship server on 127.0.0.1:8080');
var io = require('socket.io').listen(8080);
    clients = 0;
    ready_clients = 0;

io.sockets.on('connection', function(socket) {
    var is_ready = false;
    clients += 1;

    if(clients == 2) {
        socket.emit('prepare', {});
    }

    socket.on('ready', function(obj) {
        ready_clients += 1;
        is_ready = true;
        if(ready_clients == 2) {
            socket.emit('start', { my_turn : true });
            socket.broadcast.emit('start', {});
            //io.sockets.emit('start', {});
        }
    });

    socket.on('shoot', function(obj) {
        socket.broadcast.emit('shoot', obj);
    });

    socket.on('miss', function(obj) {
        socket.broadcast.emit('miss', obj);
    });

    socket.on('hit', function(obj) {
        socket.broadcast.emit('hit', obj);
    });

    socket.on('kill', function(obj) {
        socket.broadcast.emit('kill', obj);
    });

    socket.on('disconnect', function() {
        console.log('Client disconnected');
        if(is_ready) {
            ready_clients -= 1;
        }
        clients -= 1;
    });
});
