const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const highScoreDisplay = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const gameOverMessage = document.getElementById('gameOverMessage');

const tileSize = 50;
const rows = canvas.height / tileSize;
const cols = canvas.width / tileSize;

let snake, food, obstacles, score, level, speed, direction, gameInterval, highScore;

// Load images
const appleImage = new Image();
appleImage.src = 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4fc3574e-d2ff-4d56-8d76-66e08422a5c5/dfxqw0x-3d877eef-cdcc-4d38-9b19-066b37530e77.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzRmYzM1NzRlLWQyZmYtNGQ1Ni04ZDc2LTY2ZTA4NDIyYTVjNVwvZGZ4cXcweC0zZDg3N2VlZi1jZGNjLTRkMzgtOWIxOS0wNjZiMzc1MzBlNzcucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0._5oaER-dOeVxnmMV-BX8ve1m_JV3He35hWEaaQ9gZDA';

const snakeHeadImage = new Image();
snakeHeadImage.src = 'snake_head.png';

const snakeBodyImage = new Image();
snakeBodyImage.src = 'snake_body.png';

// Initialize the game
function init() {
    snake = [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }];
    food = spawnFood();
    obstacles = [];
    score = 0;
    level = 1;
    speed = 200;
    direction = { x: 0, y: -1 };
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    highScore = parseInt(localStorage.getItem('highScore')) || 0;
    highScoreDisplay.textContent = highScore;
    gameOverMessage.classList.add('hidden'); // Hide game over message
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, speed);
}

// Spawn food at a random position
function spawnFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows),
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

// Update the game
function updateGame() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (checkCollision(head)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        food = spawnFood();
        if (score % 5 === 0) {
            level++;
            levelDisplay.textContent = level;
            speed = Math.max(speed - 20, 50);
            clearInterval(gameInterval);
            gameInterval = setInterval(updateGame, speed);
        }
    } else {
        snake.pop();
    }

    drawGame();
}

// Draw the game
function drawGame() {
    // Draw the grid
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            ctx.fillStyle = (row + col) % 2 === 0 ? '#32a852' : '#76c893'; // Alternating green shades
            ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
        }
    }

    // Draw the food (apple)
    ctx.drawImage(appleImage, food.x * tileSize, food.y * tileSize, tileSize, tileSize);

    // Draw the snake
    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];
        const x = segment.x * tileSize;
        const y = segment.y * tileSize;

        if (i === 0) {
            ctx.drawImage(snakeHeadImage, x, y, tileSize, tileSize);
        } else {
            ctx.drawImage(snakeBodyImage, x, y, tileSize, tileSize);
        }
    }
}

// Check for collisions
function checkCollision(head) {
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
        return true;
    }
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        return true;
    }
    return false;
}

// Handle game over
function gameOver() {
    clearInterval(gameInterval);
    saveHighScore();
    gameOverMessage.textContent = `Game Over! Your Score: ${score}`;
    gameOverMessage.classList.remove('hidden'); // Show game over message
}

// Save high score
function saveHighScore() {
    if (score > highScore) {
        localStorage.setItem('highScore', score);
        highScore = score;
        highScoreDisplay.textContent = highScore;
    }
}

// Handle keyboard input
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && direction.y !== 1) {
        direction = { x: 0, y: -1 };
    } else if (e.key === 'ArrowDown' && direction.y !== -1) {
        direction = { x: 0, y: 1 };
    } else if (e.key === 'ArrowLeft' && direction.x !== 1) {
        direction = { x: -1, y: 0 };
    } else if (e.key === 'ArrowRight' && direction.x !== -1) {
        direction = { x: 1, y: 0 };
    }
});

// Start the game
startBtn.addEventListener('click', init);
