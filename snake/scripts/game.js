// Constants
const BORDER_COLOR = "white";
const BACKGROUND_COLOR = "white";

let gc = document.getElementById("gameCanvas");
let ctx = gc.getContext("2d");

let snake = [{
        x: 150,
        y: 150
    },
    {
        x: 140,
        y: 150
    },
    {
        x: 130,
        y: 150
    },
    {
        x: 120,
        y: 150
    },
    {
        x: 110,
        y: 150
    }
];

let dx = 10;
let dy = 0;

let foodX = rand(0, gc.width - 10);
let foodY = rand(0, gc.height - 10);

let score = 0;
let speed = 60;
let pause = false;
let changingDirection = false;

// Style it a bit
ctx.fillStyle = BACKGROUND_COLOR;

ctx.fillRect(0, 0, gc.width, gc.height);

ctx.imageSmoothingEnabled = false;

document.addEventListener("keydown", changeDirection);





//gc.width = window.innerWidth / 2;
//gc.height = window.innerHeight / 2;






// Variables used in the interval
let dead = false; // Only check if youre dead once after pause;
let interval;

function main() {

    drawSnake();

    interval = setInterval(function () {
        
        $("canvas").css("opacity", "1");

        changingDirection = false;

        if (pause == false) {
            
            clearCanvas();
            drawFood();
            advanceSnake();
            drawSnake();

        } else if (pause == true) {
            
            $("canvas").css("opacity", "0");
            
            if (dead == true) {
                // Show game over menu here
                $(".over").css("display", "flex");
                $("#score").text("Score: " + score);

                reset();

                clearInterval(interval);
            } else {
                // Show pause menu here
                console.log("Game is paused");
            }
        
        }

    }, speed);
}












// Functions, names will change later
function reset() {
    pause = false;
    dead = false;
    
    clearCanvas();
    createFood();

    snake = [{
        x: 150,
        y: 150
    },
    {
        x: 140,
        y: 150
    },
    {
        x: 130,
        y: 150
    },
    {
        x: 120,
        y: 150
    },
    {
        x: 110,
        y: 150
    }
];
}


function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawSnakePart(sp) {
    ctx.fillStyle = "black";
    ctx.strokeStyle = "white";

    ctx.fillRect(sp.x, sp.y, 10, 10);
    ctx.strokeRect(sp.x, sp.y, 10, 10);
}

function advanceSnake() {
    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };
    snake.unshift(head);

    let didEatFood = snake[0].x === foodX && snake[0].y === foodY;

    if (didEatFood) {
        createFood();
        score += 10;
    } else if (didGameEnd()) {
        pause = true;
        dead = true;
    } else {
        snake.pop();
    }
}

function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";

    ctx.fillRect(0, 0, gc.width, gc.height);
    //ctx.strokeRect(0, 0, gc.width, gc.height);
}

function changeDirection(e) {
    if(changingDirection == true) return;


    changingDirection = true;

    const pressed = e.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    switch (pressed) {
        case 37: // left
            if (!goingRight) {
                dx = -10;
                dy = 0;
            }
            break;
        case 39: // Right
            if (!goingLeft) {
                dx = 10;
                dy = 0;
            }
            break;
        case 38: // Up
            if (!goingDown) {
                dx = 0;
                dy = -10;
            }
            break;
        case 40: // Down
            if (!goingUp) {
                dx = 0;
                dy = 10;
            }
            break;
        case 27:
            // Esc
            if($(".pause").is(":visible")) {

                $(".pause").css("display", "none");
                $("canvas").css("box-shadow", "0 0 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)");

            } else {

                $(".pause").css("display", "flex");
                $("canvas").css("box-shadow", "none");

            }

            dead = didGameEnd();
            console.log(dead);
            pause = !pause;
            break;
    }
}

function rand(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
    foodX = rand(0, gc.width - 10);
    foodY = rand(0, gc.height - 10);

    snake.forEach(function isFoodOnSnake(part) {
        let foodIsOnSnake = part.x == foodX && part.y == foodY;
        if (foodIsOnSnake) {
            createFood();
        }
    });
}

// Change this to a more general "powerup" function
function drawFood() {
    ctx.fillStyle = "red";
    ctx.strokeStyle = "darkred";
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}

function didGameEnd() {
    for (let i = 5; i < snake.length; i++) {
        let didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;

        if (didCollide) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gc.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gc.height - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}