var io = require('socket.io').listen(8080);

io.sockets.on('connection', function(socket) {
    socket.on('message', function(msg) {
        console.log('Message from client: ' + msg); 
        socket.emit('message', { other : 'This is private' });
        socket.broadcast.emit('message', { data : msg });
    });

    socket.on('disconnect', function() {
        console.log('Client disconnected');
    });
});
