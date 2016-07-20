//Initialize global variables
var counterX = 200;
var counterY = 395;

var possibleY = [55, 140, 225, 310];
var possibleX = [0, 100, 200, 300, 400];

var lives = 6;
var score = 0;

//reset for when player dies or gets a key
function reset() {
    counterX = 200;
    counterY = 395;
    lives = lives - 1;
    var lifeSpanElement = document.getElementById("lives");
    lifeSpanElement.innerHTML = lives;
    if (lives === 0) {
        document.write("<h1>You Ran Out of Lives!</h1><p>Refresh to play again!</p>");
    }
}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -100;
    this.y = possibleY[Math.floor(Math.random() * possibleY.length)];
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (dt * 300 * Math.random());
    //handles collisions
    if (this.x - counterX < 50 && this.x - counterX > 0 && this.y === counterY) {
        reset()
    }
    if (this.x > 505) {
        this.x = -100;
        this.y = possibleY[Math.floor(Math.random() * possibleY.length)];
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = counterX;
    this.y = counterY;
};

Player.prototype.update = function(dt) {
    this.x = counterX;
    this.y = counterY;

    if (counterX === key.x && counterY === key.y) {
        foundKey();
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    switch (key) {
        // case for going off the map, calling reset function
        case 'up':
            if (counterY === 55) {
                reset();
            }
            else {
                counterY -= 85;
            }
            break;
        case 'down':
            if (counterY === 395) {
                reset();
            }
            else {
                counterY += 85;
            }
            break;
        case 'left':
            if (counterX === 0) {
                reset();
            }
            else {
                counterX -= 100;
            }
            break;
        case 'right':
            if (counterX === 400) {
                reset();
            }
            else {
                counterX += 100;
            }

            break;
    }
};

var Key = function() {
    this.sprite = 'images/Key.png';
    this.x = possibleX[Math.floor(Math.random() * possibleX.length)];
    this.y = possibleY[Math.floor(Math.random() * possibleY.length)];
    keyX = this.x;
    keyY = this.y;
};

Key.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

function foundKey() {
    counterX = 200;
    counterY = 395;
    score = score + 1;
    key.x = possibleX[Math.floor(Math.random() * possibleX.length)];
    key.y = possibleY[Math.floor(Math.random() * possibleY.length)];
    var numKeys = document.getElementById("score");
    numKeys.innerHTML = score;
    if (score === 10) {
        document.write("<h1>YOU WIN!</h1><p>Refresh to play again!</p>");
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy()];

var player = new Player();

var key = new Key();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});