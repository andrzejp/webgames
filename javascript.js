// Don't forget "sudo systemctl restart httpd.service"!
'use strict';

let gameLive = true;

//constants
let canvas;
let ctx;

const GAME_WIDTH = 640;
const GAME_HEIGHT = 360;

//enemies
const enemies = [
    {
        x: 100, //x coordinate
        y: 100, //y coordinate
        speedY: 1, //speed in Y
        w: 40, //width
        h: 40 //heght
    },
    {
        x: 260,
        y: 100,
        speedY: 2,
        w: 40,
        h: 40
    },
    {
        x: 380,
        y: 100,
        speedY: 3,
        w: 40,
        h: 40
    },
    {
        x: 470,
        y: 100,
        speedY: 4,
        w: 40,
        h: 40
    }
];

//player object
const player = {
    x: 10,
    y: 160,
    speedX: 2,
    w: 40,
    h: 40,
    isMoving: false
};

//the goal object
var goal = {
    x: 580,
    y: 160,
    w: 50,
    h: 36
};

var sprites = {};

function movePlayer() {
    player.isMoving = true;
}

function stopPlayer() {
    player.isMoving = false;
}

function load() {
    sprites.player = new Image();
    sprites.player.src = 'images/hero.png';

    sprites.background = new Image();
    sprites.background.src = 'images/floor.png';

    sprites.enemy = new Image();
    sprites.enemy.src = 'images/enemy.png';

    sprites.goal = new Image();
    sprites.goal.src = 'images/chest.png';
}

//update the logic
var update = function() {

    //check if you've won the game
    if (checkCollision(player, goal)) {
	gameLive = false;

	alert("You've won!");

	//reload page
	window.location = "";
    }
    
    //update player
    if (player.isMoving) {
	player.x += player.speedX;
    }

    var i = 0;
    var n = enemies.length;

    enemies.forEach(function(element, index){

	// check for collision with player
	if (checkCollision(player, element)) {
	    //stop the game
	    gameLive = false;

	    alert('Game Over, man!');

	    //reload
	    window.location = "";
	}

	// move enemy
        element.y += element.speedY;
        
        //check borders
        if(element.y <= 10) {
	    element.y = 10;
	    //element.speedY = element.speedY * -1;
	    element.speedY *= -1;
        }
        else if(element.y >= GAME_HEIGHT - 50) {
	    element.y = GAME_HEIGHT - 50;
	    element.speedY *= -1;
        }
    });
};

//show the game on the screen
var draw = function() {
    //clear the canvas
    ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);

    //draw background
    ctx.drawImage(sprites.background, 0, 0);

    //draw player
    ctx.drawImage(sprites.player, player.x, player.y);

    //draw enemies
    enemies.forEach(enemy => {
	ctx.drawImage(sprites.enemy, enemy.x, enemy.y);
    });

    //draw goal
    ctx.drawImage(sprites.goal, goal.x, goal.y);
};

//gets executed multiple times per second
var step = function() {

    update();
    draw();

    if (gameLive) {
	window.requestAnimationFrame(step);
    }
};

function checkCollision(rect1, rect2) {
    let overlappingX = Math.abs(rect1.x - rect2.x) <= Math.max(rect1.w, rect2.w);
    let overlappingY = Math.abs(rect1.y - rect2.y) <= Math.max(rect1.h, rect2.h);

    return overlappingX && overlappingY;	
}

//initial kick
window.addEventListener('load', () => {
    //grab the canvas and context
    canvas = document.getElementById("mycanvas");
    ctx = canvas.getContext("2d");

    // add listener to move player
    canvas.addEventListener('mousedown', movePlayer);
    canvas.addEventListener('mouseup', stopPlayer);
    canvas.addEventListener('touchstart', movePlayer);
    canvas.addEventListener('touchend', stopPlayer);

    load();
    step();
});
