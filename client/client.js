var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
var socket;

$(function() {
    socket = io.connect("http://127.0.0.1:8080/");
    socket.on('connect', function() {
        drawField('my');
        drawField('enemy');
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

function drawField(type) {
    // Check if such field is already drawn
    if($('#' + type + '-field').length == 0) {
        field = document.createElement('table');
        field.setAttribute('id', type + '-field');
        field.setAttribute('cellpadding', '0');
        // Create rows
        for(i = 1; i <= letters.length; i++) {
            var row = document.createElement('tr');
            row.setAttribute('id', 'row-' + i);

            // Create columns
            for(var j = 1; j <= letters.length; j++) {
                var cell = document.createElement('td');
                cell.setAttribute('id', 'cell-' + i + letters[j - 1]);
                cell.setAttribute('class', 'cell');
                cell.innerHTML = '&nbsp;';
                row.appendChild(cell);
            }

            field.appendChild(row);
        }
        // Draw
        document.body.appendChild(field);
    }
};

function shoot(x, y) {
    socket.emit('shoot', { longitude : x, lattitude : y });
}
