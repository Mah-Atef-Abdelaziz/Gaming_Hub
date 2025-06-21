/**
 * Classic Snake Game
 * Control a growing snake, eat food, and avoid walls and yourself
 */

// Game variables
let canvas, ctx;
let snake = [];
let food = {};
let direction = 'right';
let newDirection = 'right';
let gameSpeed = 100; // milliseconds
let gameRunning = false;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoop;

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    // Get canvas and context
    canvas = document.getElementById('snakeCanvas');
    ctx = canvas.getContext('2d');
    
    // Set high score from local storage
    document.getElementById('highScore').textContent = highScore;
    
    // Add event listeners
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    document.addEventListener('keydown', changeDirection);
    
    // Draw initial screen
    drawInitialScreen();
});

// Draw initial welcome screen
function drawInitialScreen() {
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#2c3e50';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Classic Snake Game', canvas.width / 2, canvas.height / 2 - 30);
    
    ctx.font = '16px Arial';
    ctx.fillText('Press Start to play', canvas.width / 2, canvas.height / 2 + 20);
}

// Start the game
function startGame() {
    if (gameRunning) return;
    
    // Initialize snake
    snake = [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
    ];
    
    // Create initial food
    createFood();
    
    // Reset score
    score = 0;
    document.getElementById('score').textContent = score;
    
    // Set direction
    direction = 'right';
    newDirection = 'right';
    
    // Start game loop
    gameRunning = true;
    gameLoop = setInterval(gameUpdate, gameSpeed);
}

// Reset the game
function resetGame() {
    clearInterval(gameLoop);
    gameRunning = false;
    score = 0;
    document.getElementById('score').textContent = score;
    drawInitialScreen();
}

// Create food at random position
function createFood() {
    // Generate random coordinates (avoiding snake body)
    let validPosition = false;
    while (!validPosition) {
        food = {
            x: Math.floor(Math.random() * (canvas.width / 10)),
            y: Math.floor(Math.random() * (canvas.height / 10))
        };
        
        // Check if food is not on snake
        validPosition = true;
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === food.x && snake[i].y === food.y) {
                validPosition = false;
                break;
            }
        }
    }
}

// Handle keyboard input for direction changes
function changeDirection(event) {
    const key = event.key;
    
    // Prevent reversing direction
    if (key === 'ArrowUp' && direction !== 'down') {
        newDirection = 'up';
    } else if (key === 'ArrowDown' && direction !== 'up') {
        newDirection = 'down';
    } else if (key === 'ArrowLeft' && direction !== 'right') {
        newDirection = 'left';
    } else if (key === 'ArrowRight' && direction !== 'left') {
        newDirection = 'right';
    }
}

// Main game update function
function gameUpdate() {
    // Update direction
    direction = newDirection;
    
    // Create new head based on direction
    const head = {x: snake[0].x, y: snake[0].y};
    
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    
    // Check for collisions
    if (checkCollision(head)) {
        gameOver();
        return;
    }
    
    // Add new head to snake
    snake.unshift(head);
    
    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        // Increase score
        score++;
        document.getElementById('score').textContent = score;
        
        // Update high score if needed
        if (score > highScore) {
            highScore = score;
            document.getElementById('highScore').textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
        
        // Create new food
        createFood();
    } else {
        // Remove tail if no food was eaten
        snake.pop();
    }
    
    // Draw everything
    drawGame();
}

// Check for collisions with walls or self
function checkCollision(head) {
    // Check wall collisions
    if (head.x < 0 || head.x >= canvas.width / 10 || 
        head.y < 0 || head.y >= canvas.height / 10) {
        return true;
    }
    
    // Check self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// Game over function
function gameOver() {
    clearInterval(gameLoop);
    gameRunning = false;
    
    // Draw game over screen
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 30);
    
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
    ctx.fillText('Press Start to play again', canvas.width / 2, canvas.height / 2 + 50);
}

// Draw the game
function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        // Head is a different color
        if (i === 0) {
            ctx.fillStyle = '#2c3e50';
        } else {
            ctx.fillStyle = '#3498db';
        }
        
        ctx.fillRect(snake[i].x * 10, snake[i].y * 10, 10, 10);
        
        // Draw border around each segment
        ctx.strokeStyle = '#f8f9fa';
        ctx.strokeRect(snake[i].x * 10, snake[i].y * 10, 10, 10);
    }
    
    // Draw food
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(food.x * 10 + 5, food.y * 10 + 5, 5, 0, Math.PI * 2);
    ctx.fill();
}