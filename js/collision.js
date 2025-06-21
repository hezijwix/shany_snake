function checkCollisions() {
    if (!gameState.gameRunning) return;
    
    checkWallCollision();
    checkSelfCollision();
    checkFoodCollision();
}

function checkWallCollision() {
    const head = getSnakeHead();
    const margin = gameState.snake.size / 2;
    
    if (head.x < margin || 
        head.x > gameState.canvas.width - margin || 
        head.y < margin || 
        head.y > gameState.canvas.height - margin) {
        gameOver();
    }
}

function checkSelfCollision() {
    const head = getSnakeHead();
    const body = getSnakeBody();
    const collisionRadius = gameState.snake.size * 0.8;
    
    if (body.length < 4) return;
    
    for (let i = 3; i < body.length; i++) {
        const bodyPart = body[i];
        const distance = Math.sqrt(
            Math.pow(head.x - bodyPart.x, 2) + 
            Math.pow(head.y - bodyPart.y, 2)
        );
        
        if (distance < collisionRadius) {
            gameOver();
            return;
        }
    }
}

function isPointInSnake(x, y, excludeHead = false) {
    const checkRadius = gameState.snake.size / 2;
    const positions = excludeHead ? getSnakeBody() : gameState.snake.positions;
    
    for (const pos of positions) {
        const distance = Math.sqrt(
            Math.pow(x - pos.x, 2) + 
            Math.pow(y - pos.y, 2)
        );
        
        if (distance < checkRadius) {
            return true;
        }
    }
    
    return false;
}

function getDistanceToWall(x, y) {
    const distances = [
        x,
        gameState.canvas.width - x,
        y,
        gameState.canvas.height - y
    ];
    
    return Math.min(...distances);
}

function isPositionSafe(x, y, safeRadius = 30) {
    if (getDistanceToWall(x, y) < safeRadius) {
        return false;
    }
    
    if (isPointInSnake(x, y)) {
        return false;
    }
    
    return true;
}