var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
var ships = [];
var socket;
var gameStarted = false;
var myTurn = false;

$(function() {
    socket = io.connect("http://127.0.0.1:8080/");
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
            myTurn = true;
            console.log('My turn');
        }
    });

    // Enemy shoots at client
    socket.on('shoot', function(obj) {
        //TODO: needs to return proper information
        console.log('Enemy shoots at ' + obj);
        cell = $('#my-field #cell-' + obj.lattitude + obj.longitude);
        if(cell.hasClass('my')) {
            ship = cell.data('ship');
            ship.liveCells--;
            if(ship.liveCells > 0) { // Hit
                cell.addClass('hit');
                cell.text('+');
                socket.emit('hit', obj);
                console.log('He hits!');
            } else { // Kill
                obj.killedCells = ship.markAsKilled();
                cell.addClass('kill');
                cell.text('X');
                socket.emit('kill', obj);
                console.log('He kills!');
            }
        } else {
            cell.addClass('miss');
            cell.text('-');
            socket.emit('miss', obj);
            console.log('He misses');
        }
        myTurn = true;
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
        $('#enemy-field #cell-' + obj.lattitude + obj.longitude).text('+');
    });

    // My shot kills
    socket.on('kill', function(obj) {
        //$('#enemy-field #cell-' + obj.lattitude + obj.longitude).addClass('kill');
        for(var i = 0; i < obj.killedCells.length; i++) {
            $('#enemy-field #cell-' + obj.killedCells[i].y + obj.killedCells[i].x).addClass('kill');
            $('#enemy-field #cell-' + obj.killedCells[i].y + obj.killedCells[i].x).text('X');
        }
    });
});

function drawField(type) {
    // Check if such field is already drawn
    if($('#' + type + '-field').length == 0) {
        field = document.createElement('table');
        field.setAttribute('id', type + '-field');
        field.setAttribute('cellpadding', '0');
        // Create rows
        for(i = 0; i <= letters.length; i++) {
            var row = document.createElement('tr');
            row.setAttribute('id', 'row-' + i);

            // Create columns
            for(var j = 0; j <= letters.length; j++) {
                var cell = document.createElement('td');
                if(i == 0 || j == 0) {
                    cell.setAttribute('class', 'coordinate');
                    if(i == 0 && j > 0) {
                        cell.innerHTML = letters[j - 1];
                    }
                    if(i > 0 && j == 0) {
                        cell.innerHTML = i;
                    }
                } else {
                    cell.setAttribute('id', 'cell-' + i + letters[j - 1]);
                    cell.setAttribute('class', 'cell');
                    if(type == "enemy") {
                        cell.setAttribute('onClick', 'javascript:shoot(\'' + letters[j - 1] + '\', ' + i + ')');
                    }
                    cell.innerHTML = '&nbsp;';
                }
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
    ships[2] = new Ship('g', 3, 1, 1);
    ships[3] = new Ship('f', 10, 1, 0);
    ships[4] = new Ship('a', 3, 2, 1);
    ships[5] = new Ship('a', 6, 2, 1);
    ships[6] = new Ship('a', 9, 2, 1);
    ships[7] = new Ship('c', 1, 3, 0);
    ships[8] = new Ship('g', 1, 3, 0);
    ships[9] = new Ship('j', 6, 4, 1);
    socket.emit('ready', {});
    console.log('I am ready!');
};

function Ship(x, y, size, orientation) {
    this.position = new Coords(x, y);
    this.size = size;
    this.orientation = orientation; //0 - horizontal, 1 - vertical
    this.status = 1;
    this.liveCells = size;
    if(orientation == 0) {
        for(var i = 0; i < size; i++) {
            $('#cell-' + y + (letters[letters.indexOf(x) + i])).data('ship', this);
        }
    } else {
        for(var i = 0; i < size; i++) {
            $('#cell-' + (y + i) + x).data('ship', this);
        }
    }
}

Ship.prototype.isHit = function() {
    if(this.status == 0) {
        return true;
    } else {
        return false;
    }
}

Ship.prototype.markAsKilled = function() {
    var killedCells = [];
    if(this.orientation == 0) {
        for(var i = 0; i < this.size; i++) {
            $('#cell-' + this.position.y + (letters[letters.indexOf(this.position.x) + i])).addClass('kill');
            $('#cell-' + this.position.y + (letters[letters.indexOf(this.position.x) + i])).text('X');
            killedCells.push(new Coords(letters[letters.indexOf(this.position.x) + i], this.position.y));
        }
    } else {
        for(var i = 0; i < this.size; i++) {
            $('#cell-' + (this.position.y + i) + this.position.x).addClass('kill');
            $('#cell-' + (this.position.y + i) + this.position.x).text('X');
            killedCells.push(new Coords(this.position.x, (this.position.y + i)));
        }
    }
    return killedCells;
}

Ship.prototype.isHorizontal = function() {
    return this.orientation === 0;
}

Ship.prototype.isVertical = function() {
    return this.orientation === 1;
}

Ship.prototype.drawShip = function() {
    var ship;
    for(var i = 0; i < this.size; i++) {
        if(this.isHorizontal()) {
            ship = $("#my-field #cell-" + this.position.y + (letters[letters.indexOf(this.position.x) + i]));
        } else {
            ship = $("#my-field #cell-" + (this.position.y + i) + this.position.x);
        }
        ship.addClass('my');
    }
}

function Coords(x, y) {
    this.x = x;
    this.y = y;
}

function drawShips() {
    for(var i = 0; i < ships.length; i++) {
        ships[i].drawShip();
    }
}

function shoot(x, y) {
    if(gameStarted) {
        if (myTurn) {
            socket.emit('shoot', { longitude : x, lattitude : y });
            myTurn = false;
        } else {
            console.log('It is not my turn');
        }
    } else {
        console.log('Cannot shoot before game start');
    }
}

