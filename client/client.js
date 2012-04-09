var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
var socket;

$(function() {
    socket = io.connect("http://127.0.0.1:8080/");
    socket.on('connect', function() {
        drawFields();
        socket.on('message', function(msg) {
            console.log(msg);
        });
    });

    // Enemy shoots at client
    socket.on('shoot', function(obj) {
        //TODO: needs to return proper information
        $('#my-field #cell-' + obj.lattitude + obj.longitude).addClass('miss');
        socket.emit('miss', obj);
        console.log('Enemy shoots at ' + obj);
    });

    // My shot misses
    socket.on('miss', function(obj) {
        $('#enemy-field #cell-' + obj.lattitude + obj.longitude).addClass('miss');
    });

    // My shot hits
    socket.on('hit', function(obj) {
        $('#enemy-field #cell-' + obj.lattitude + obj.longitude).addClass('hit');
    });

    // My shot kills
    socket.on('kill', function(obj) {
        $('#enemy-field #cell-' + obj.lattitude + obj.longitude).addClass('kill');
    });
});

function drawFields() {
    field = document.createElement('table');
    field.setAttribute('id', 'my-field');
    field.setAttribute('cellpadding', '0');
    for(i = 1; i <= letters.length; i++) {
        var row = document.createElement('tr');
        row.setAttribute('id', 'row-' + i);

        for(var j = 1; j <= letters.length; j++) {
            var cell = document.createElement('td');
            cell.setAttribute('id', 'cell-' + i + letters[j - 1]);
            cell.setAttribute('class', 'cell');
            cell.innerHTML = '&nbsp;';
            row.appendChild(cell);
        }

        field.appendChild(row);
    }

    document.body.appendChild(field);

    field = document.createElement('table');
    field.setAttribute('id', 'enemy-field');
    field.setAttribute('cellpadding', '0');
    for(i = 1; i <= letters.length; i++) {
        var row = document.createElement('tr');
        row.setAttribute('id', 'row-' + i);

        for(var j = 1; j <= letters.length; j++) {
            var cell = document.createElement('td');
            cell.setAttribute('id', 'cell-' + i + letters[j - 1]);
            cell.setAttribute('class', 'cell');
            cell.innerHTML = '&nbsp;';
            row.appendChild(cell);
        }

        field.appendChild(row);
    }

    document.body.appendChild(field);

};

function shoot(x, y) {
    socket.emit('shoot', { longitude : x, lattitude : y });
}
