/**
 * Endless Runner Game
 * 
 * A side-scrolling game where the player controls a character that must jump
 * over obstacles. The game speeds up over time, making it progressively harder.
 * 
 * Features:
 * - Canvas-based rendering
 * - Jumping mechanics with gravity
 * - Obstacle generation and collision detection
 * - Score tracking with high score persistence
 * - Progressive difficulty increase
 * - Decorative cloud elements
 */

// Game state variables
let canvas, ctx; // Canvas and rendering context
let player = {
    x: 50,
    y: 0,
    width: 40,
    height: 50,
    jumping: false,
    jumpHeight: 15,
    jumpVelocity: 0,
    gravity: 0.8
}; // Player character properties
let obstacles = []; // Array to hold obstacle objects
let ground = 0; // Y-position of the ground
let score = 0; // Current game score
let highScore = localStorage.getItem('runnerHighScore') || 0; // Persisted high score
let gameRunning = false; // Tracks if game is in progress
let gameLoop; // Reference to the main game loop interval
let gameSpeed = 5; // Base game speed (pixels per frame)
let spawnRate = 100; // How often obstacles spawn (in frames)
let frameCount = 0; // Counts frames since game start
let clouds = []; // Array to hold cloud objects for background

/**
 * Initializes the game when the DOM is fully loaded
 * Sets up canvas, event listeners, and initial game state
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get canvas and context
    canvas = document.getElementById('runnerCanvas');
    ctx = canvas.getContext('2d');
    
    // Set ground level
    ground = canvas.height - 50;
    player.y = ground - player.height;
    
    // Set high score from local storage
    document.getElementById('highScore').textContent = highScore;
    
    // Add event listeners for game controls
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    
    // Add jump control
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && gameRunning) {
            jump();
        }
    });
    
    // Create initial clouds
    for (let i = 0; i < 5; i++) {
        createCloud(true);
    }
    
    // Draw initial screen
    drawInitialScreen();
});

/**
 * Draws the initial welcome screen
 * Shows game title and instructions
 */
function drawInitialScreen() {
    // Draw sky
    ctx.fillStyle = '#87CEEB'; // Sky blue
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw clouds
    drawClouds();
    
    // Draw ground
    ctx.fillStyle = '#8B4513'; // Brown
    ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
    
    // Draw grass
    ctx.fillStyle = '#7CFC00'; // Lawn green
    ctx.fillRect(0, ground, canvas.width, 10);
    
    // Draw title
    ctx.fillStyle = '#2c3e50';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Endless Runner', canvas.width / 2, canvas.height / 2 - 30);
    
    ctx.font = '16px Arial';
    ctx.fillText('Press Space to jump', canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText('Press Start to play', canvas.width / 2, canvas.height / 2 + 50);
    
    // Draw player
    drawPlayer();
}

/**
 * Starts a new game
 * Initializes game state and starts the game loop
 */
function startGame() {
    if (gameRunning) return; // Prevent starting if already running
    
    // Reset player position
    player.y = ground - player.height;
    player.jumping = false;
    player.jumpVelocity = 0;
    
    // Clear obstacles
    obstacles = [];
    
    // Reset score and game speed
    score = 0;
    gameSpeed = 5;
    frameCount = 0;
    document.getElementById('score').textContent = score;
    
    // Start game loop
    gameRunning = true;
    gameLoop = setInterval(gameUpdate, 1000 / 60); // 60 FPS
}

/**
 * Resets the game to initial state
 * Clears game loop and resets variables
 */
function resetGame() {
    clearInterval(gameLoop);
    gameRunning = false;
    score = 0;
    document.getElementById('score').textContent = score;
    drawInitialScreen();
}

/**
 * Makes the player jump
 * Applies initial upward velocity if player is on the ground
 */
function jump() {
    if (!player.jumping) {
        player.jumping = true;
        player.jumpVelocity = -player.jumpHeight;
    }
}

/**
 * Main game update function
 * Called every frame to update game state and render
 */
function gameUpdate() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw sky
    ctx.fillStyle = '#87CEEB'; // Sky blue
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw clouds
    updateClouds();
    drawClouds();
    
    // Update player
    updatePlayer();
    
    // Update and draw obstacles
    updateObstacles();
    drawObstacles();
    
    // Draw ground
    ctx.fillStyle = '#8B4513'; // Brown
    ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
    
    // Draw grass
    ctx.fillStyle = '#7CFC00'; // Lawn green
    ctx.fillRect(0, ground, canvas.width, 10);
    
    // Draw player
    drawPlayer();
    
    // Draw score
    ctx.fillStyle = '#2c3e50';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 10, 30);
    
    // Increment frame count
    frameCount++;
    
    // Increase score
    if (frameCount % 10 === 0) {
        score++;
        document.getElementById('score').textContent = score;
        
        // Update high score if needed
        if (score > highScore) {
            highScore = score;
            document.getElementById('highScore').textContent = highScore;
            localStorage.setItem('runnerHighScore', highScore);
        }
    }
    
    // Increase game speed gradually
    if (frameCount % 500 === 0) {
        gameSpeed += 0.5;
    }
    
    // Create new obstacle
    if (frameCount % spawnRate === 0) {
        createObstacle();
        
        // Decrease spawn rate as game progresses (make it harder)
        if (spawnRate > 60) {
            spawnRate -= 5;
        }
    }
    
    // Check for collisions
    checkCollisions();
}

// Update player position
function updatePlayer() {
    // Apply gravity if jumping
    if (player.jumping) {
        player.jumpVelocity += player.gravity;
        player.y += player.jumpVelocity;
        
        // Check if player has landed
        if (player.y >= ground - player.height) {
            player.y = ground - player.height;
            player.jumping = false;
            player.jumpVelocity = 0;
        }
    }
}

// Draw the player
function drawPlayer() {
    // Player body
    ctx.fillStyle = '#3498db'; // Blue
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Player head
    ctx.fillStyle = '#2c3e50';
    ctx.beginPath();
    ctx.arc(player.x + player.width/2, player.y - 10, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Player eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(player.x + player.width/2 + 5, player.y - 15, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Player legs
    ctx.fillStyle = '#2c3e50';
    
    // Animate legs when running
    if (!player.jumping) {
        const legOffset = Math.sin(frameCount * 0.3) * 5;
        
        // Left leg
        ctx.fillRect(player.x + 5, player.y + player.height, 10, 10 + legOffset);
        
        // Right leg
        ctx.fillRect(player.x + player.width - 15, player.y + player.height, 10, 10 - legOffset);
    } else {
        // Both legs up when jumping
        ctx.fillRect(player.x + 5, player.y + player.height, 10, 5);
        ctx.fillRect(player.x + player.width - 15, player.y + player.height, 10, 5);
    }
}

// Create a new obstacle
function createObstacle() {
    const height = Math.floor(Math.random() * 30) + 20; // Random height between 20-50
    
    const obstacle = {
        x: canvas.width,
        y: ground - height,
        width: 20,
        height: height
    };
    
    obstacles.push(obstacle);
}

// Update obstacles positions
function updateObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        // Move obstacle to the left
        obstacles[i].x -= gameSpeed;
        
        // Remove obstacles that are off screen
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            i--;
        }
    }
}

// Draw obstacles
function drawObstacles() {
    ctx.fillStyle = '#e74c3c'; // Red
    
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // Add some detail to obstacles
        ctx.fillStyle = '#c0392b'; // Darker red
        ctx.fillRect(obstacle.x + 5, obstacle.y, 10, obstacle.height);
        ctx.fillStyle = '#e74c3c'; // Back to original red
    }
}

// Create a new cloud
function createCloud(isInitial = false) {
    const y = Math.floor(Math.random() * 150) + 20; // Random y position
    const width = Math.floor(Math.random() * 60) + 40; // Random width between 40-100
    
    const cloud = {
        x: isInitial ? Math.random() * canvas.width : canvas.width,
        y: y,
        width: width,
        height: width * 0.6,
        speed: Math.random() * 1 + 0.5 // Random speed between 0.5-1.5
    };
    
    clouds.push(cloud);
}

// Update clouds positions
function updateClouds() {
    for (let i = 0; i < clouds.length; i++) {
        // Move cloud to the left
        clouds[i].x -= clouds[i].speed;
        
        // Remove clouds that are off screen
        if (clouds[i].x + clouds[i].width < 0) {
            clouds.splice(i, 1);
            i--;
            
            // Create a new cloud
            createCloud();
        }
    }
}

// Draw clouds
function drawClouds() {
    ctx.fillStyle = '#fff';
    
    for (let i = 0; i < clouds.length; i++) {
        const cloud = clouds[i];
        
        // Draw cloud as a group of circles
        ctx.beginPath();
        ctx.arc(cloud.x + cloud.width * 0.3, cloud.y + cloud.height * 0.5, cloud.height * 0.5, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.width * 0.7, cloud.y + cloud.height * 0.5, cloud.height * 0.6, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.width * 0.5, cloud.y + cloud.height * 0.3, cloud.height * 0.7, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Check for collisions
function checkCollisions() {
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        
        // Check if player collides with obstacle
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            gameOver();
            return;
        }
    }
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