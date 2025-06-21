const gameState = {
    canvas: { width: 500, height: 500 },
    grid: { size: 25, cellSize: 20 },
    snake: { 
        positions: [
            { x: 250, y: 250 },
            { x: 230, y: 250 },
            { x: 210, y: 250 },
            { x: 190, y: 250 }
        ], 
        direction: 'right', 
        speed: 2,
        size: 20
    },
    food: [],
    score: 0,
    highScore: 0,
    gameRunning: false,
    gameStarted: false,
    lastTime: 0,
    targetFPS: 60,
    frameInterval: 1000 / 60,
    settings: {
        snakeColor: '#4CAF50',
        outlineColor: '#2E7D32',
        outlineWidth: 2,
        backgroundColor: '#1a1a1a',
        foodImages: [],
        foodSize: 30
    }
};

let canvas, ctx;
let animationId;

function initGame() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    setupCanvas();
    loadSettings();
    loadHighScore();
    
    updateUI();
    
    if (typeof initInput === 'function') initInput();
    if (typeof initUI === 'function') initUI();
    if (typeof initCustomization === 'function') initCustomization();
    if (typeof initSimpleFoodImages === 'function') initSimpleFoodImages();
}


function setupCanvas() {
    const container = canvas.parentElement;
    const containerRect = container.getBoundingClientRect();
    
    const maxWidth = Math.min(containerRect.width * 0.9, 1000);
    const maxHeight = Math.min(containerRect.height * 0.7, 1000);
    
    const scale = Math.min(maxWidth / gameState.canvas.width, maxHeight / gameState.canvas.height);
    
    canvas.style.width = (gameState.canvas.width * scale) + 'px';
    canvas.style.height = (gameState.canvas.height * scale) + 'px';
}

function startGame() {
    resetGame();
    gameState.gameRunning = true;
    gameState.gameStarted = true;
    
    // Reset snake movement timer
    if (typeof resetMoveTimer === 'function') resetMoveTimer();
    
    document.getElementById('game-menu').style.display = 'none';
    document.getElementById('game-over').style.display = 'none';
    
    // Re-enabled food spawning
    if (typeof spawnFood === 'function') spawnFood();
    
    gameLoop();
}

function resetGame() {
    // Start snake at center of grid with length 4
    const cellSize = getCellSize();
    const centerGrid = Math.floor(gameState.grid.size / 2);
    const centerX = centerGrid * cellSize + cellSize / 2;
    const centerY = centerGrid * cellSize + cellSize / 2;
    
    // Create 4-segment snake moving right
    gameState.snake.positions = [
        { x: centerX, y: centerY },                    // Head
        { x: centerX - cellSize, y: centerY },         // Body segment 1
        { x: centerX - cellSize * 2, y: centerY },     // Body segment 2  
        { x: centerX - cellSize * 3, y: centerY }      // Body segment 3
    ];
    gameState.snake.direction = 'right';
    gameState.snake.growing = false;
    gameState.food = [];
    gameState.score = 0;
    gameState.gameRunning = false;
    gameState.lastTime = 0;
    
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    updateUI();
}

function gameLoop(currentTime = 0) {
    if (!gameState.gameRunning) return;
    
    const deltaTime = currentTime - gameState.lastTime;
    
    if (deltaTime >= gameState.frameInterval) {
        update(deltaTime);
        render();
        gameState.lastTime = currentTime;
    }
    
    animationId = requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
    if (typeof updateSnake === 'function') updateSnake(deltaTime);
    if (typeof processInput === 'function') processInput();
    
    // Re-enable food collision only (not wall/self collision)
    if (typeof checkFoodCollision === 'function') checkFoodCollision();
}

function render() {
    // Clear canvas
    ctx.fillStyle = gameState.settings.backgroundColor;
    ctx.fillRect(0, 0, gameState.canvas.width, gameState.canvas.height);
    
    // DEBUG: Render grid
    renderDebugGrid();
    
    // Render food
    if (typeof renderFood === 'function') renderFood();
    
    // Render snake
    if (typeof renderSnake === 'function') renderSnake();
}

function renderDebugGrid() {
    const gridSize = gameState.grid.size;
    const cellSize = getCellSize();
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; // Semi-transparent white
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let x = 0; x <= gridSize; x++) {
        const xPos = x * cellSize;
        ctx.beginPath();
        ctx.moveTo(xPos, 0);
        ctx.lineTo(xPos, gameState.canvas.height);
        ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= gridSize; y++) {
        const yPos = y * cellSize;
        ctx.beginPath();
        ctx.moveTo(0, yPos);
        ctx.lineTo(gameState.canvas.width, yPos);
        ctx.stroke();
    }
    
    // Add grid labels for debugging
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '10px Arial';
    ctx.fillText(`Grid: ${gridSize}x${gridSize}`, 10, 20);
    ctx.fillText(`Cell: ${cellSize.toFixed(1)}px`, 10, 35);
}

function getCellSize() {
    return gameState.canvas.width / gameState.grid.size;
}

function updateGridSize(newSize) {
    gameState.grid.size = newSize;
    gameState.grid.cellSize = getCellSize();
    
    // Reset snake to center of new grid with length 4
    const centerGrid = Math.floor(gameState.grid.size / 2);
    const cellSize = getCellSize();
    const centerX = centerGrid * cellSize + cellSize / 2;
    const centerY = centerGrid * cellSize + cellSize / 2;
    
    // Create 4-segment snake moving right
    gameState.snake.positions = [
        { x: centerX, y: centerY },                    // Head
        { x: centerX - cellSize, y: centerY },         // Body segment 1
        { x: centerX - cellSize * 2, y: centerY },     // Body segment 2  
        { x: centerX - cellSize * 3, y: centerY }      // Body segment 3
    ];
    gameState.food = []; // Clear food to respawn with new size
}

function gameOver() {
    gameState.gameRunning = false;
    
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        saveHighScore();
    }
    
    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('game-over').style.display = 'block';
    
    updateUI();
}

function addScore(points) {
    gameState.score += points;
    updateUI();
}

function updateUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('high-score').textContent = gameState.highScore;
}

function loadSettings() {
    const saved = localStorage.getItem('snakeGameSettings');
    if (saved) {
        const settings = JSON.parse(saved);
        Object.assign(gameState.settings, settings);
        
        // Load grid size if saved
        if (settings.gridSize) {
            updateGridSize(settings.gridSize);
        }
    }
}

function saveSettings() {
    const settingsToSave = {
        ...gameState.settings,
        gridSize: gameState.grid.size
    };
    localStorage.setItem('snakeGameSettings', JSON.stringify(settingsToSave));
}

function loadHighScore() {
    const saved = localStorage.getItem('snakeGameHighScore');
    if (saved) {
        gameState.highScore = parseInt(saved);
    }
}

function saveHighScore() {
    localStorage.setItem('snakeGameHighScore', gameState.highScore.toString());
}

window.addEventListener('load', initGame);
window.addEventListener('resize', setupCanvas);