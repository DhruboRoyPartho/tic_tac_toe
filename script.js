const board = document.querySelector(".board");
const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector(".status");
const restartBtn = document.querySelector(".restart-btn");

const X = "X";
const O = "O";
const EMPTY = "";
let currentPlayer = O;
let gameActive = true;
let gameState = Array(9).fill(EMPTY);

const winningConditions = [
    [0, 1, 2], // Rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // Columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // Diagonals
    [2, 4, 6],
];

// Initialize the game
function initializeGame() {
    cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
    restartBtn.addEventListener("click", restartGame);
    updateStatus();
}

// Handle cell click
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

    if (gameState[clickedCellIndex] !== EMPTY || !gameActive) return;

    makeMove(clickedCellIndex, currentPlayer);
    if (checkWin()) {
        endGame(false);
        return;
    }
    if (checkDraw()) {
        endGame(true);
        return;
    }

    currentPlayer = currentPlayer === O ? X : O;
    updateStatus();

    if (currentPlayer === X) {
        makeAIMove();
    }
}

// Make a move
function makeMove(index, player) {
    gameState[index] = player;
    cells[index].textContent = player;
}

// Check for a win
function checkWin() {
    return winningConditions.some((condition) => {
        return condition.every((index) => gameState[index] === currentPlayer);
    });
}

// Check for a draw
function checkDraw() {
    return gameState.every((cell) => cell !== EMPTY);
}

// End the game
function endGame(isDraw) {
    gameActive = false;
    if (isDraw) {
        statusText.textContent = "It's a draw!";
    } else {
        statusText.textContent = `Player ${currentPlayer} wins!`;
    }
}

// Update game status
function updateStatus() {
    statusText.textContent = `It's ${currentPlayer}'s turn`;
}

// Restart the game
function restartGame() {
    gameState.fill(EMPTY);
    cells.forEach((cell) => (cell.textContent = EMPTY));
    gameActive = true;
    currentPlayer = O;
    updateStatus();
}

// AI move using Minimax
function makeAIMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < 9; i++) {
        if (gameState[i] === EMPTY) {
            gameState[i] = X;
            let score = minimax(gameState, 0, false);
            gameState[i] = EMPTY;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    makeMove(move, X);
    if (checkWin()) {
        endGame(false);
        return;
    }
    if (checkDraw()) {
        endGame(true);
        return;
    }

    currentPlayer = O;
    updateStatus();
}

// Minimax algorithm
function minimax(boardState, depth, isMaximizing) {
    if (checkWinForPlayer(X)) return 10 - depth;
    if (checkWinForPlayer(O)) return depth - 10;
    if (checkDraw()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (boardState[i] === EMPTY) {
                boardState[i] = X;
                let score = minimax(boardState, depth + 1, false);
                boardState[i] = EMPTY;
                bestScore = Math.min(bestScore, score);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (boardState[i] === EMPTY) {
                boardState[i] = O;
                let score = minimax(boardState, depth + 1, true);
                boardState[i] = EMPTY;
                bestScore = Math.max(bestScore, score);
            }
        }
        return bestScore;
    }
}

// Check win for a specific player
function checkWinForPlayer(player) {
    return winningConditions.some((condition) => {
        return condition.every((index) => gameState[index] === player);
    });
}

// Start the game
initializeGame();
