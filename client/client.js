var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

$(function() {
    var socket = io.connect("http://127.0.0.1:8080/");
    socket.on('connect', function() {
        drawFields();
        socket.on('message', function(msg) {
            console.log(msg);
        });
    });

    $('#submit').click(function() {
        socket.send($('#message').val());
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
