const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const restartBtn = document.getElementById("restart-btn");
const levelSelector = document.getElementById("level");
const pointsDisplay = document.getElementById("points");
const resultDiv = document.getElementById("result");

const box = 20;
let snake = [{ x: 200, y: 200 }];
let food = generateFood();
let direction = null;
let score = 0;
let gameInterval = null;
let speed = parseInt(levelSelector.value);

// Draw the game components
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    snake.forEach((segment) => {
        ctx.fillStyle = "lime";
        ctx.fillRect(segment.x, segment.y, box, box);
    });

    // Draw the food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Update the snake's position
    moveSnake();

    // Check for collisions
    if (checkCollision()) {
        clearInterval(gameInterval);
        displayResult();
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        restartBtn.disabled = false;
    }

    // Update the score
    pointsDisplay.innerText = score;
}

// Generate a random food position
function generateFood() {
    return {
        x: Math.floor((Math.random() * canvas.width) / box) * box,
        y: Math.floor((Math.random() * canvas.height) / box) * box,
    };
}

// Move the snake based on the direction
function moveSnake() {
    const head = { ...snake[0] };

    if (direction === "UP") head.y -= box;
    else if (direction === "DOWN") head.y += box;
    else if (direction === "LEFT") head.x -= box;
    else if (direction === "RIGHT") head.x += box;

    // Check if the snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        food = generateFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);
}

// Check for collisions with walls or itself
function checkCollision() {
    const head = snake[0];

    // Wall collision
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }

    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// Display the result at the end
function displayResult() {
    resultDiv.innerText = `Score: ${score}\n`;
    if (score < 50) {
        resultDiv.innerText += "Average";
        resultDiv.style.color = "orange";
    } else if (score >= 50 && score < 100) {
        resultDiv.innerText += "Good";
        resultDiv.style.color = "yellow";
    } else {
        resultDiv.innerText += "Best";
        resultDiv.style.color = "lime";
    }
}

// Event listeners
startBtn.addEventListener("click", () => {
    if (!gameInterval) {
        gameInterval = setInterval(drawGame, speed);
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        restartBtn.disabled = false;
    }
});

pauseBtn.addEventListener("click", () => {
    clearInterval(gameInterval);
    gameInterval = null;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
});

restartBtn.addEventListener("click", () => {
    snake = [{ x: 200, y: 200 }];
    direction = null;
    score = 0;
    pointsDisplay.innerText = score;
    resultDiv.innerText = "";
    food = generateFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(drawGame, speed);
    startBtn.disabled = true;
    pauseBtn.disabled = false;
});

levelSelector.addEventListener("change", () => {
    speed = parseInt(levelSelector.value);
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = setInterval(drawGame, speed);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});
