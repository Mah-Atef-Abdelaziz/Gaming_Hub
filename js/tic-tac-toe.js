/**
 * Tic-Tac-Toe Game with AI
 * 
 * This game implements a classic Tic-Tac-Toe (Noughts and Crosses) game
 * where the player plays as X against a computer opponent (O).
 * 
 * Features:
 * - 3x3 game board
 * - Player vs Computer gameplay
 * - Win detection for rows, columns, and diagonals
 * - Draw detection
 * - Game state tracking
 * - Simple AI opponent (random moves)
 */

// Game state variables
let board = ['', '', '', '', '', '', '', '', '']; // Represents the 9 cells of the game board
let currentPlayer = 'X'; // Player starts as X, computer is O
let gameActive = true; // Tracks if the game is in progress

/**
 * Initializes the game when the DOM is fully loaded
 * Creates the game board and sets up the initial game state
 */
document.addEventListener('DOMContentLoaded', function() {
    createBoard();
    updateStatus();
});

/**
 * Creates the game board by generating 9 cell elements
 * Each cell is given a click event listener to handle player moves
 */
function createBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        boardElement.appendChild(cell);
    }
}

/**
 * Handles player clicks on cells
 * Updates the game state and UI, then triggers AI move if game is still active
 * @param {Event} event - The click event
 */
function handleCellClick(event) {
    const index = event.target.getAttribute('data-index');
    
    // Check if the cell is already filled or game is not active
    if (board[index] !== '' || !gameActive) {
        return;
    }
    
    // Update the board
    board[index] = currentPlayer;
    event.target.innerHTML = currentPlayer === 'X' 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-circle"></i>';
    
    // Check for win or draw
    if (checkWin()) {
        document.getElementById('status').textContent = `${currentPlayer} wins!`;
        gameActive = false;
        return;
    }
    
    if (checkDraw()) {
        document.getElementById('status').textContent = 'Game ended in a draw!';
        gameActive = false;
        return;
    }
    
    // Switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
    
    // If it's AI's turn
    if (currentPlayer === 'O' && gameActive) {
        setTimeout(makeAIMove, 500); // Delay AI move for better UX
    }
}

/**
 * Implements the AI opponent's move logic
 * Currently uses a simple random selection of available cells
 */
function makeAIMove() {
    // Simple AI: find a random empty cell
    let emptyIndices = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            emptyIndices.push(i);
        }
    }
    
    if (emptyIndices.length > 0) {
        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        board[randomIndex] = currentPlayer;
        
        const cell = document.querySelector(`[data-index="${randomIndex}"]`);
        cell.innerHTML = '<i class="fas fa-circle"></i>';
        
        // Check for win or draw
        if (checkWin()) {
            document.getElementById('status').textContent = `${currentPlayer} wins!`;
            gameActive = false;
            return;
        }
        
        if (checkDraw()) {
            document.getElementById('status').textContent = 'Game ended in a draw!';
            gameActive = false;
            return;
        }
        
        // Switch back to player
        currentPlayer = 'X';
        updateStatus();
    }
}

/**
 * Checks if the current player has won
 * @returns {boolean} True if the current player has won, false otherwise
 */
function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    
    return false;
}

/**
 * Checks if the game has ended in a draw
 * @returns {boolean} True if the game is a draw, false otherwise
 */
function checkDraw() {
    return !board.includes('');
}

/**
 * Updates the game status message to show whose turn it is
 */
function updateStatus() {
    document.getElementById('status').textContent = `${currentPlayer === 'X' ? 'Your' : 'AI\'s'} Turn (${currentPlayer})`;
}

/**
 * Resets the game to its initial state
 * Clears the board and resets all game variables
 */
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    createBoard();
    updateStatus();
}