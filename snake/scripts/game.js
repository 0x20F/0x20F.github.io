let storage = window.localStorage;
let info = JSON.parse(storage.getItem("info")); // A json with all the highscores and settings (?)

// If it's running for the first time
if(info == null) {
    info = {
        "Score": [],
        "Name": "You",
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

let pause = true;
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




hideCanvasBorder();
/**
 * Runs the entire game loop
 * - Called by button events in the menus
 */
function main() {
    pause = false;

    drawSnake();

    interval = setInterval(function () {
        
        changingDirection = false;

        if (pause == false) {
            
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
                $(".over").css("display", "flex");
                
                let sc = info["Score"];
                let current = false;

                for(let i = 0; i < sc.length; i++) {
                    if(i < 6) {
                        if(sc[i] == score) {
                            $("#score ul").append(`<li class="current_run">${i + 1}. YOU --- ${sc[i]}</li>`);
                            current = true;
                        } else {
                            $("#score ul").append(`<li>${i + 1}. YOU --- ${sc[i]}</li>`);
                        }
                    }

                    if(sc[i] == score && current == false) {
                        $("#score ul").append(`<li class="current_run">${i + 1}. YOU --- ${sc[i]}</li>`);
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
    pause = false;
    dead = false;
    score = 0;
    
    clearCanvas();
    createPickup();

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
    } else if (checkDeath()) {
        pause = true;
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
            if(pause && $(".pause, .over").is(":visible")) {
                reset();
                restart();
            }
            break;
        case 83: // S
            if(pause && $(".main").is(":visible")) {
                start();
                showCanvasBorder();
            }
            break;
        case 27:
            // Esc
            if(!dead) {
                if($(".pause").is(":visible")) {

                    $(".pause").css("display", "none");
                    showCanvasBorder();
    
                } else {
    
                    $(".pause").css("display", "flex");
                    hideCanvasBorder();
    
                }

                dead = checkDeath();
                pause = !pause;
            }
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

    console.log("FOOD: " + foodX + " -> " + foodY);

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
    main();
}

function save(score) {
    // Push the score.
    // Only if it's not a double
    for(let i = 0; i < info["Score"].length; i++) {
        if(info["Score"][i] == score) {
            return;
        }
    }

    info["Score"].push(score);
    info["Score"].sort(function(a, b) {return a - b;}).reverse();
    
    storage.setItem("info", JSON.stringify(info));
}