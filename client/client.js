var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
var ships = [];
var socket;
var gameStarted = false;

$(function() {
    socket = io.connect("http://192.168.1.102:8080/");
    socket.on('connect', function() {
        drawField('my');
        drawField('enemy');
    });

    socket.on('prepare', function(obj) {
        console.log('Place your ships!');
        positionShips();
        drawShips();
    });

    socket.on('start', function(obj) {
        console.log('Let the battle begin!');
        gameStarted = true;
        if(obj.my_turn == true) {
            console.log('My turn');
        }
    });

    // Enemy shoots at client
    socket.on('shoot', function(obj) {
        //TODO: needs to return proper information
        console.log('Enemy shoots at ' + obj);
        cell = $('#my-field #cell-' + obj.lattitude + obj.longitude);
        if(cell.hasClass('my')) {
            cell.addClass('hit');
            cell.text('+');
            socket.emit('hit', obj);
            console.log('He hits!');
        } else {
            cell.addClass('miss');
            cell.text('-');
            socket.emit('miss', obj);
            console.log('He misses');
        }
    });

    // My shot misses
    socket.on('miss', function(obj) {
        $('#enemy-field #cell-' + obj.lattitude + obj.longitude).addClass('miss');
        $('#enemy-field #cell-' + obj.lattitude + obj.longitude).text('-');
        console.log(obj);
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
                if(type == "enemy") {
                    cell.setAttribute('onClick', 'javascript:shoot(\'' + letters[j - 1] + '\', ' + i + ')');
                }
                cell.innerHTML = '&nbsp;';
                row.appendChild(cell);
            }

            field.appendChild(row);
        }
        // Draw
        document.body.appendChild(field);
    }
};

function positionShips() {
    ships[0] = new Ship('a', 1, 1, 0);
    ships[1] = new Ship('c', 7, 1, 0);
    ships[2] = new Ship('g', 3, 1, 0);
    ships[3] = new Ship('f', 10, 1, 0);
    socket.emit('ready', {});
    console.log('I am ready!');
};

function Ship(x, y, size, orientation) {
    this.position = new Coords(x, y);
    this.size = size;
    this.orientation = orientation; //0 - horizontal, 1 - vertical
    this.status = 1;
}

function Coords(x, y) {
    this.x = x;
    this.y = y;
}

function drawShips() {
    for(var i = 0; i < ships.length; i++) {
        $("#my-field #cell-" + ships[i].position.y + ships[i].position.x).addClass('my');
    }
}

function shoot(x, y) {
    if(gameStarted) {
        socket.emit('shoot', { longitude : x, lattitude : y });
    } else {
        console.log('Cannot shoot before game start');
    }
}
