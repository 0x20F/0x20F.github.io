let storage = window.localStorage;
let info = JSON.parse(storage.getItem("snake-info")); // A json with all the highscores and settings (?)

// If it's running for the first time
if(info == null) {
    info = {
        "score": [],
        "name": "You",
        "settings": {
            "skin": "default",
            "speed": 60
        }
    };
}

let gc = document.getElementById("gameCanvas");
let ctx = gc.getContext("2d");
ctx.scale(2, 2);

let snake = [
    {x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150},
    {x: 120, y: 150},
    {x: 110, y: 150}
];

let score = 0;
let speed = 60;
let size = 5;

let dx = 5;
let dy = 0;

let foodX = rand(0, gc.width - (size + gc.width / 2));
let foodY = rand(0, gc.height - (size + gc.height / 2));

let paused = true;
let changingDirection = false;

// Variables used in the interval
let dead = false; // Only check if youre dead once after pause;
let interval;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, gc.width, gc.height);

document.addEventListener("keydown", (e) => {
    changeDir(e);
    onKeyPress(e);
});



// MENUS and oftenly used elements!
let mainMenu = $(".main");
let gameOverMenu = $(".over");
let pauseMenu = $(".pause");




hideCanvasBorder();
/**
 * Runs the entire game loop
 * - Called by button events in the menus
 */
function main() {
    paused = false;

    drawSnake();

    interval = setInterval(function () {
        
        changingDirection = false;

        if (paused == false) {
            
            clearCanvas();
            drawPickup("red", "darkred");
            moveSnake();
            drawSnake();

        } else {
            
            if (dead == true) {
                $(".over #score ul").html("");

                clearInterval(interval);
                save(score);

                // Show game-over menu here
                show(gameOverMenu, "flex");
                
                let sc = info.score;
                let current = false;

                for(let i = 0; i < sc.length; i++) {
                    if(i < 6) {
                        if(sc[i] == score) {
                            $("#score ul").append(
                                `<li class="current_run">
                                    <span class="score_item name">${i + 1}. YOU</span>
                                    <i class="fas fa-arrow-right"></i> 
                                    <span class="score_item score">${sc[i]}</span>
                                </li>`);
                            current = true;
                        } else {
                            $("#score ul").append(
                                `<li>
                                    <span class="score_item name">${i + 1}. YOU</span>
                                    <i class="fas fa-arrow-right"></i> 
                                    <span class="score_item score">${sc[i]}</span>
                                </li>`);
                        }
                    }

                    if(sc[i] == score && current == false) {
                        $("#score ul").append(`<li class="separator"><i class="fas fa-ellipsis-h"></i></li>`);
                        $("#score ul").append(
                            `<li class="current_run">
                                <span class="score_item name">${i + 1}. YOU</span>
                                <i class="fas fa-arrow-right"></i> 
                                <span class="score_item score">${sc[i]}</span>
                            </li>`);
                    }
                }
            }
        
        }

    }, speed);
}



/**
 * Clear the game board
 * - runs on death and resets everything to default
 */
function reset() {
    paused = false;
    dead = false;
    
    score = 0;

    dy = 0;
    dx = 5;
    
    clearCanvas();
    createPickup();
    updateScore();

    snake = [
        {x: 150, y: 150},
        {x: 140, y: 150},
        {x: 130, y: 150},
        {x: 120, y: 150},
        {x: 110, y: 150}
    ];
}



/**
 * Draw all snake parts
 */
function drawSnake() {
    snake.forEach(drawSnakePart);
}



/**
 * Runs for every limb of the snake and 
 * draws it on the board
 * 
 * @param {Object} sp 
 */
function drawSnakePart(sp) {
    ctx.fillStyle = "black";
    ctx.strokeStyle = "white";

    ctx.fillRect(sp.x, sp.y, size, size);
    ctx.strokeRect(sp.x, sp.y, size, size);
}


/**
 * Move the snake in the direction
 * it's pointing and check wether or not
 * food was eaten.
 */
function moveSnake() {
    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };
    snake.unshift(head);

    let ate = snake[0].x === foodX && snake[0].y === foodY;

    if (ate) {
        createPickup();
        score += 10;
        updateScore(); // Updates the html element
    } else if (checkDeath()) {
        paused = true;
        dead = true;
    } else {
        snake.pop();
    }
}


/**
 * Clears all drawings
 */
function clearCanvas() {
    ctx.fillStyle = "white";

    ctx.fillRect(0, 0, gc.width, gc.height);
}


/**
 * Check for keypresses and change direction
 * accordingly
 * @param {event} e 
 */
function changeDir(e) {
    if(changingDirection == true) return;

    changingDirection = true;

    const pressed = e.keyCode;
    const gUp = dy === -size;
    const gDown = dy === size;
    const gRight = dx === size;
    const gLeft = dx === -size;

    switch (pressed) {
        case 37: // left
            if (!gRight) {
                dx = -size;
                dy = 0;
            }
            break;
        case 39: // Right
            if (!gLeft) {
                dx = size;
                dy = 0;
            }
            break;
        case 38: // Up
            if (!gDown) {
                dx = 0;
                dy = -size;
            }
            break;
        case 40: // Down
            if (!gUp) {
                dx = 0;
                dy = size;
            }
            break;
        
    }
}


/**
 * Used to listen for menu shortcut presses
 */
function onKeyPress(e) {
    const pressed = e.keyCode;

    switch(pressed) {
        case 82: // R
            handleRestart();
            break;
        case 83: // S
            handleStartMenu();
            break;
        case 27:
            // Esc
            handlePause();
            break;
    }
}



/**
 * Get a random value for pickup positioning
 */
function rand(min, max) {
    return Math.round((Math.random() * (max - min) + min) / size) * size;
}


/**
 * Create the food or powerup
 */
function createPickup() {
    foodX = rand(0, gc.width - (size + gc.width / 2));
    foodY = rand(0, gc.height - (size + gc.height / 2));

    snake.forEach(function isOnSnake(part) {
        let onSnake = part.x == foodX && part.y == foodY;
        if (onSnake) {
            createPickup();
        }
    });
}


/**
 * Draw the newly created food
 */
function drawPickup(fill, stroke) {
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;

    ctx.fillRect(foodX, foodY, size, size);
    ctx.strokeRect(foodX, foodY, size, size);
}


/**
 * Check if a wall was hit or if the snake was hit
 */
function checkDeath() {
    for (let i = 5; i < snake.length; i++) {
        let collision = snake[i].x === snake[0].x && snake[i].y === snake[0].y;

        if (collision) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gc.width - (size + gc.width / 2);
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gc.height - (size + gc.height / 2);

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}






// Button functions
function handlePause() {
    if(!dead) {
        if(pauseMenu.is(":visible")) {

            hide(pauseMenu)
            showCanvasBorder();

        } else {

            show(pauseMenu, "flex");
            hideCanvasBorder();

        }

        dead = checkDeath();
        paused = !paused;
    }
}

function handleStartMenu() {
    if(paused && mainMenu.is(":visible")) {
        start();
        showCanvasBorder();

    } else if(paused && (gameOverMenu.is(":visible") || pauseMenu.is(":visible"))) {

        hide(pauseMenu);
        hide(gameOverMenu);
        show(mainMenu, "flex");

    }
}

function handleRestart() {
    if(paused && (pauseMenu.is(":visible") || gameOverMenu.is(":visible"))) {
        reset();
        restart();
    }
}



function updateScore() {
    $(".current_score").html("Score: " + score + "pts");
}




// Styling functions
function hideCanvasBorder() {
    $("canvas").css({
        "border-color": "rgba(24, 27, 33, 0.7)"
    });
}

function showCanvasBorder() {
    $("canvas").css({
        "border-color": "#181b21"
    });
}

function hide(element) {
    element.css("display", "none");
}

function show(element, displayType) {
    element.css("display", displayType);
}



/* TYPICAL GAME FUNCTIONS */
// Functions used both here and in index.html
function restart() {
    $(".pause, .over").css("display", "none");

    clearInterval(interval);
    reset();

    main();
}

function start() {
    $(".main").css("display", "none");

    clearInterval(interval);
    reset();

    main();
}

function save(score) {
    // Push the score.
    // Only if it's not a double
    for(let i = 0; i < info.score.length; i++) {
        if(info.score[i] == score) {
            return;
        }
    }

    info.score.push(score);
    info.score.sort(function(a, b) {return a - b;}).reverse();
    
    storage.setItem("snake-info", JSON.stringify(info));
}

