/**
 * Whack-a-Mole Game
 * 
 * A classic arcade game where players must click on moles as they randomly
 * appear from holes to score points within a time limit.
 * 
 * Features:
 * - Randomized mole appearances
 * - Score tracking
 * - High score persistence using localStorage
 * - Countdown timer
 * - Game state management
 */

// Game state variables
let score = 0; // Current game score
let timeLeft = 30; // Game duration in seconds
let gameRunning = false; // Tracks if game is in progress
let gameTimer; // Timer for game countdown
let moleTimer; // Timer for showing/hiding moles
let highScore = localStorage.getItem('whackHighScore') || 0; // Persisted high score
let moles = []; // Will hold references to mole DOM elements

/**
 * Initializes the game when the DOM is fully loaded
 * Sets up event listeners and initial game state
 */
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for game controls
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    
    // Set high score from local storage
    document.getElementById('highScore').textContent = highScore;
    
    // Create the game board with mole holes
    createMoleGrid();
});

/**
 * Creates the grid of mole holes
 * Generates a 3x3 grid of holes with moles inside
 */
function createMoleGrid() {
    const grid = document.getElementById('moleGrid');
    grid.innerHTML = '';
    
    // Create 9 mole holes (3x3 grid)
    for (let i = 0; i < 9; i++) {
        const hole = document.createElement('div');
        hole.className = 'mole-hole';
        
        // Create mole
        const mole = document.createElement('div');
        mole.className = 'mole';
        mole.dataset.index = i;
        
        // Add click event to mole for whacking
        mole.addEventListener('click', function() {
            if (gameRunning && this.classList.contains('active') && !this.classList.contains('whacked')) {
                whackMole(this);
            }
        });
        
        hole.appendChild(mole);
        grid.appendChild(hole);
    }
    
    // Store references to all mole elements
    moles = Array.from(document.querySelectorAll('.mole'));
}

/**
 * Starts a new game
 * Initializes game state and starts timers
 */
function startGame() {
    if (gameRunning) return; // Prevent starting if already running
    
    // Reset game state
    resetGame();
    
    // Start the game
    gameRunning = true;
    
    // Start game countdown timer
    gameTimer = setInterval(function() {
        timeLeft--;
        document.getElementById('timeLeft').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
    
    // Start showing moles
    showRandomMole();
}

/**
 * Resets the game to initial state
 * Clears timers and resets variables
 */
function resetGame() {
    // Clear timers
    clearInterval(gameTimer);
    clearInterval(moleTimer);
    
    // Reset variables
    score = 0;
    timeLeft = 30;
    gameRunning = false;
    
    // Update UI
    document.getElementById('score').textContent = score;
    document.getElementById('timeLeft').textContent = timeLeft;
    
    // Hide all moles
    moles.forEach(mole => {
        mole.classList.remove('active');
        mole.classList.remove('whacked');
    });
}

/**
 * Shows a random mole for a random duration
 * Core gameplay mechanic that makes moles appear
 */
function showRandomMole() {
    // Hide all active moles
    moles.forEach(mole => {
        mole.classList.remove('active');
        mole.classList.remove('whacked');
    });
    
    // Select a random mole
    const randomIndex = Math.floor(Math.random() * moles.length);
    const randomMole = moles[randomIndex];
    
    // Show the mole
    randomMole.classList.add('active');
    
    // Set a random time for the mole to stay visible
    const minTime = 600; // minimum time in ms
    const maxTime = 1500; // maximum time in ms
    const randomTime = Math.floor(Math.random() * (maxTime - minTime)) + minTime;
    
    // Hide the mole after the random time
    moleTimer = setTimeout(function() {
        if (gameRunning) {
            showRandomMole();
        }
    }, randomTime);
}

/**
 * Handles player clicking on a mole
 * Updates score and mole appearance
 * @param {HTMLElement} mole - The mole element that was clicked
 */
function whackMole(mole) {
    // Increase score
    score++;
    document.getElementById('score').textContent = score;
    
    // Mark mole as whacked
    mole.classList.add('whacked');
    mole.classList.remove('active');
    
    // Update high score if needed
    if (score > highScore) {
        highScore = score;
        document.getElementById('highScore').textContent = highScore;
        localStorage.setItem('whackHighScore', highScore);
    }
}

/**
 * Ends the current game
 * Cleans up timers and shows final score
 */
function endGame() {
    clearInterval(gameTimer);
    clearInterval(moleTimer);
    gameRunning = false;
    
    // Show game over message
    alert(`Game Over! Your score: ${score}`);
}