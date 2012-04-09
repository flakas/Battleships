$(function() {
    var socket = io.connect("http://127.0.0.1:8080/");
    socket.on('connect', function() {
        socket.send('hi');

        socket.on('message', function(msg) {
            console.log(msg);
        });
    });

    $('#submit').click(function() {
        socket.send($('#message').val());
    });   
});
