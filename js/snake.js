let inputQueue = [];
let nextDirection = null;
let lastMoveTime = 0;
const moveInterval = 150; // Move every 150ms (faster, classic Snake speed)

function updateSnake(deltaTime) {
    if (!gameState.gameRunning) return;
    
    processDirectionChange();
    
    // Only move at regular intervals for grid-based movement
    const currentTime = Date.now();
    if (currentTime - lastMoveTime >= moveInterval) {
        moveSnake(deltaTime);
        lastMoveTime = currentTime;
    }
}

function processDirectionChange() {
    if (inputQueue.length > 0) {
        const newDirection = inputQueue.shift();
        if (isValidDirectionChange(gameState.snake.direction, newDirection)) {
            gameState.snake.direction = newDirection;
        }
    }
}

function isValidDirectionChange(currentDirection, newDirection) {
    const opposites = {
        'up': 'down',
        'down': 'up',
        'left': 'right',
        'right': 'left'
    };
    
    return opposites[currentDirection] !== newDirection && currentDirection !== newDirection;
}

function moveSnake(deltaTime) {
    // Grid-based movement - move one cell at a time
    const cellSize = getCellSize(); // Dynamic cell size
    const head = gameState.snake.positions[0];
    
    // Convert current position to grid coordinates (subtract half cell to get proper grid position)
    let gridX = Math.round((head.x - cellSize / 2) / cellSize);
    let gridY = Math.round((head.y - cellSize / 2) / cellSize);
    
    // Move one grid cell in the current direction
    switch (gameState.snake.direction) {
        case 'up':
            gridY -= 1;
            break;
        case 'down':
            gridY += 1;
            break;
        case 'left':
            gridX -= 1;
            break;
        case 'right':
            gridX += 1;
            break;
    }
    
    // Wrap around walls - snake goes through walls to other side
    if (gridX < 0) gridX = gameState.grid.size - 1;
    if (gridX >= gameState.grid.size) gridX = 0;
    if (gridY < 0) gridY = gameState.grid.size - 1;
    if (gridY >= gameState.grid.size) gridY = 0;
    
    // Convert back to pixel coordinates (center of grid cell)
    const newHead = {
        x: gridX * cellSize + cellSize / 2,
        y: gridY * cellSize + cellSize / 2
    };
    
    gameState.snake.positions.unshift(newHead);
    
    // Handle growing when food is eaten
    if (!gameState.snake.growing) {
        gameState.snake.positions.pop();
    } else {
        gameState.snake.growing = false;
    }
}

function growSnake() {
    gameState.snake.growing = true;
}

function resetMoveTimer() {
    lastMoveTime = Date.now();
    inputQueue = []; // Clear any pending direction changes
}

function renderSnake() {
    const positions = gameState.snake.positions;
    const cellSize = getCellSize(); // Dynamic cell size
    const snakeWidth = Math.max(4, cellSize - 4); // Minimum 4px, reduce by 4px from cell size
    const outlineWidth = gameState.settings.outlineWidth;
    
    if (positions.length === 0) return;
    
    // Set line properties for smooth rendering
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Draw outline line first if enabled
    if (outlineWidth > 0 && positions.length > 1) {
        ctx.strokeStyle = gameState.settings.outlineColor;
        ctx.lineWidth = snakeWidth + (outlineWidth * 2);
        
        ctx.beginPath();
        ctx.moveTo(positions[0].x, positions[0].y);
        for (let i = 1; i < positions.length; i++) {
            ctx.lineTo(positions[i].x, positions[i].y);
        }
        ctx.stroke();
    }
    
    // Draw main snake line
    if (positions.length > 1) {
        ctx.strokeStyle = gameState.settings.snakeColor;
        ctx.lineWidth = snakeWidth; // 16px instead of 20px
        
        ctx.beginPath();
        ctx.moveTo(positions[0].x, positions[0].y);
        for (let i = 1; i < positions.length; i++) {
            ctx.lineTo(positions[i].x, positions[i].y);
        }
        ctx.stroke();
    } else {
        // Single segment - draw as circle with reduced size
        ctx.fillStyle = gameState.settings.snakeColor;
        ctx.beginPath();
        ctx.arc(positions[0].x, positions[0].y, snakeWidth / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function changeDirection(direction) {
    // Only allow one direction change in queue to prevent diagonal movement
    if (inputQueue.length === 0) {
        inputQueue.push(direction);
    }
}

function getSnakeHead() {
    return gameState.snake.positions[0];
}

function getSnakeBody() {
    return gameState.snake.positions.slice(1);
}