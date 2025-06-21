/**
 * Image Puzzle Slider Game
 * 
 * A sliding puzzle game where players rearrange tiles to complete an image.
 * Players can select different difficulty levels that change the grid size.
 * 
 * Features:
 * - Adjustable difficulty (grid size)
 * - Move counter
 * - Timer
 * - Tile movement validation
 * - Shuffling algorithm
 * - Dynamic grid creation
 */

// Game state variables
let grid = []; // 2D array to hold references to tile elements
let emptyTile = { row: 0, col: 0 }; // Tracks position of the empty tile
let gridSize = 4; // Default 4x4 grid
let moves = 0; // Counts player moves
let timer = 0; // Tracks game duration
let timerInterval; // Reference to the timer interval
let gameRunning = false; // Tracks if game is in progress
let tileSize = 0; // Size of each tile in pixels

/**
 * Initializes the game when the DOM is fully loaded
 * Sets up event listeners and initial game state
 */
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for game controls
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    document.getElementById('difficulty').addEventListener('change', function() {
        gridSize = parseInt(this.value);
    });
    
    // Create assets folder if it doesn't exist
    createAssetsFolder();
    
    // Create initial grid
    createGrid();
});

/**
 * Creates assets folder and adds default puzzle image
 * Note: This would normally be done server-side
 */
function createAssetsFolder() {
    // This would normally be done server-side
    // For this client-side implementation, we'll assume the folder exists
    console.log('Ensuring assets folder exists...');
}

/**
 * Starts a new game
 * Initializes game state, shuffles grid, and starts timer
 */
function startGame() {
    if (gameRunning) return; // Prevent starting if already running
    
    // Reset game state
    resetGame();
    
    // Start the game
    gameRunning = true;
    
    // Create and shuffle the grid
    createGrid();
    shuffleGrid();
    
    // Start timer
    timerInterval = setInterval(function() {
        timer++;
        document.getElementById('timer').textContent = timer;
    }, 1000);
}

/**
 * Resets the game to initial state
 * Clears timer and resets variables
 */
function resetGame() {
    // Clear timer
    clearInterval(timerInterval);
    
    // Reset variables
    moves = 0;
    timer = 0;
    gameRunning = false;
    
    // Update UI
    document.getElementById('moves').textContent = moves;
    document.getElementById('timer').textContent = timer;
    
    // Create initial grid
    createGrid();
}

/**
 * Creates the puzzle grid
 * Generates a grid of tiles based on current gridSize
 */
function createGrid() {
    const puzzleGrid = document.getElementById('puzzleGrid');
    puzzleGrid.innerHTML = '';
    
    // Set grid template
    puzzleGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    
    // Calculate tile size based on grid size
    const gridWidth = Math.min(400, window.innerWidth - 40);
    tileSize = gridWidth / gridSize;
    
    // Initialize grid array
    grid = [];
    
    // Create tiles
    for (let row = 0; row < gridSize; row++) {
        grid[row] = [];
        
        for (let col = 0; col < gridSize; col++) {
            const tile = document.createElement('div');
            tile.className = 'puzzle-tile';
            tile.style.width = `${tileSize}px`;
            tile.style.height = `${tileSize}px`;
            
            // Set the last tile as empty
            if (row === gridSize - 1 && col === gridSize - 1) {
                tile.classList.add('empty');
                emptyTile = { row, col };
            } else {
                // Create tile with background image
                const img = document.createElement('div');
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.backgroundImage = 'url(../assets/images/puzzle.jpg)';
                img.style.backgroundSize = `${gridSize * 100}%`;
                img.style.backgroundPosition = `${col * 100 / (gridSize - 1)}% ${row * 100 / (gridSize - 1)}%`;
                
                tile.appendChild(img);
            }
            
            // Add click event
            tile.dataset.row = row;
            tile.dataset.col = col;
            tile.addEventListener('click', function() {
                if (gameRunning) {
                    moveTile(parseInt(this.dataset.row), parseInt(this.dataset.col));
                }
            });
            
            puzzleGrid.appendChild(tile);
            grid[row][col] = tile;
        }
    }
}

/**
 * Shuffles the grid by making random valid moves
 * Ensures the puzzle is solvable
 */
function shuffleGrid() {
    // Make random valid moves to shuffle
    const moves = gridSize * gridSize * 10; // Number of random moves
    
    for (let i = 0; i < moves; i++) {
        // Get adjacent tiles to empty tile
        const adjacentTiles = getAdjacentTiles();
        
        // Pick a random adjacent tile
        const randomIndex = Math.floor(Math.random() * adjacentTiles.length);
        const { row, col } = adjacentTiles[randomIndex];
        
        // Swap with empty tile (without animation or move counting)
        swapTiles(row, col, false);
    }
}

// Get tiles adjacent to the empty tile
function getAdjacentTiles() {
    const { row, col } = emptyTile;
    const adjacent = [];
    
    // Check top
    if (row > 0) {
        adjacent.push({ row: row - 1, col });
    }
    
    // Check right
    if (col < gridSize - 1) {
        adjacent.push({ row, col: col + 1 });
    }
    
    // Check bottom
    if (row < gridSize - 1) {
        adjacent.push({ row: row + 1, col });
    }
    
    // Check left
    if (col > 0) {
        adjacent.push({ row, col: col - 1 });
    }
    
    return adjacent;
}

// Move a tile
function moveTile(row, col) {
    // Check if the tile is adjacent to the empty tile
    const { row: emptyRow, col: emptyCol } = emptyTile;
    
    if (
        (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
        (col === emptyCol && Math.abs(row - emptyRow) === 1)
    ) {
        // Swap the tile with the empty tile
        swapTiles(row, col, true);
        
        // Increment moves
        moves++;
        document.getElementById('moves').textContent = moves;
        
        // Check if puzzle is solved
        if (isPuzzleSolved()) {
            gameComplete();
        }
    }
}

// Swap a tile with the empty tile
function swapTiles(row, col, countMove = true) {
    const { row: emptyRow, col: emptyCol } = emptyTile;
    
    // Get the tile elements
    const tile = grid[row][col];
    const emptyTileElement = grid[emptyRow][emptyCol];
    
    // Swap in the DOM
    const tileContent = tile.innerHTML;
    tile.innerHTML = '';
    emptyTileElement.innerHTML = tileContent;
    
    // Update classes
    tile.classList.add('empty');
    emptyTileElement.classList.remove('empty');
    
    // Update grid array
    grid[row][col] = tile;
    grid[emptyRow][emptyCol] = emptyTileElement;
    
    // Update empty tile position
    emptyTile = { row, col };
}

// Check if the puzzle is solved
function isPuzzleSolved() {
    // Check if empty tile is in the bottom right
    if (emptyTile.row !== gridSize - 1 || emptyTile.col !== gridSize - 1) {
        return false;
    }
    
    // Check if all tiles are in the correct position
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            // Skip the empty tile
            if (row === gridSize - 1 && col === gridSize - 1) {
                continue;
            }
            
            const tile = grid[row][col];
            
            // Get the background position of the tile's image
            const imgDiv = tile.querySelector('div');
            if (!imgDiv) continue; // Skip if no image div (empty tile)
            
            const bgPosition = imgDiv.style.backgroundPosition;
            
            // Calculate the expected background position for this grid location
            const expectedBgPosition = `${col * 100 / (gridSize - 1)}% ${row * 100 / (gridSize - 1)}%`;
            
            // If background position doesn't match expected, puzzle is not solved
            if (bgPosition !== expectedBgPosition) {
                return false;
            }
        }
    }
    
    return true;
}

// Game complete
function gameComplete() {
    clearInterval(timerInterval);
    gameRunning = false;
    
    // Show completion message
    setTimeout(function() {
        alert(`Congratulations! You solved the puzzle in ${moves} moves and ${timer} seconds!`);
    }, 500);
}