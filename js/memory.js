/**
 * Memory Card Matching Game
 * 
 * A classic memory matching game where players need to find pairs of matching cards.
 * The game tracks the number of moves made and notifies the player when they win.
 * 
 * Features:
 * - Card flipping animation
 * - Match detection
 * - Move counter
 * - Win condition
 * - Game reset functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Game assets and state variables
    const icons = ['🍎', '🍌', '🍇', '🍉', '🍓', '🥝']; // Card icons/symbols
    let deck = []; // Will hold the shuffled card data
    let firstCard = null; // First card selected in a turn
    let secondCard = null; // Second card selected in a turn
    let lockBoard = false; // Prevents clicking during card evaluation
    let moves = 0; // Tracks number of moves (pairs flipped)

    // DOM element references
    const gameBoard = document.getElementById('memory-game');
    const movesDisplay = document.getElementById('moves');
    const restartBtn = document.getElementById('restart');

    /**
     * Creates and shuffles the deck of cards
     * Each icon appears twice to create matching pairs
     */
    function initDeck() {
        deck = [...icons, ...icons] // Create pairs of each icon
            .map(icon => ({ icon, id: Math.random() })) // Add random ID for shuffling
            .sort((a, b) => a.id - b.id); // Shuffle by sorting on random IDs
    }

    /**
     * Builds the game board by creating card elements
     * Adds event listeners to each card for gameplay
     */
    function buildBoard() {
        gameBoard.innerHTML = '';
        deck.forEach((cardData, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.icon = cardData.icon;
            card.dataset.index = index;
            card.textContent = '';  // initially blank (face down)
            card.addEventListener('click', onCardClick);
            gameBoard.appendChild(card);
        });
    }

    /**
     * Handles card click events
     * Implements the core game logic for flipping cards and checking matches
     * @param {Event} e - The click event
     */
    function onCardClick(e) {
        const clicked = e.currentTarget;
        
        // Prevent clicks if board is locked or card is already flipped/matched
        if (lockBoard || clicked === firstCard || clicked.classList.contains('flipped')) return;

        // Flip the card
        clicked.classList.add('flipped');
        clicked.textContent = clicked.dataset.icon;

        // If this is the first card of the pair
        if (!firstCard) {
            firstCard = clicked;
            return;
        }
        
        // This is the second card
        secondCard = clicked;
        moves++;
        movesDisplay.textContent = `Moves: ${moves}`;
        checkForMatch();
    }

    /**
     * Checks if the two flipped cards match
     * Handles the match or mismatch logic
     */
    function checkForMatch() {
        const isMatch = firstCard.dataset.icon === secondCard.dataset.icon;
        if (isMatch) {
            disableMatched();
        } else {
            unflipCards();
        }
    }

    /**
     * Handles matched cards by disabling their click events
     * Also checks for win condition
     */
    function disableMatched() {
        firstCard.removeEventListener('click', onCardClick);
        secondCard.removeEventListener('click', onCardClick);
        resetTurn();
        
        // Check if all cards are flipped (game won)
        if (document.querySelectorAll('.card:not(.flipped)').length === 0) {
            setTimeout(() => alert(`You won in ${moves} moves!`), 200);
        }
    }

    /**
     * Handles unmatched cards by flipping them back
     * Adds a delay for better UX
     */
    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.textContent = '';
            secondCard.textContent = '';
            resetTurn();
        }, 1000);
    }

    /**
     * Resets the turn state variables
     */
    function resetTurn() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    /**
     * Resets the entire game
     * Shuffles deck, rebuilds board, and resets game state
     */
    function resetGame() {
        moves = 0;
        movesDisplay.textContent = 'Moves: 0';
        initDeck();
        buildBoard();
        resetTurn();
    }

    // Event listener for restart button
    restartBtn.addEventListener('click', resetGame);

    // Initialize the game on page load
    resetGame();
});
