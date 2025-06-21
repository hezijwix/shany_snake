function spawnFood() {
    while (gameState.food.length < 5) {
        const newFood = createFood();
        if (newFood) {
            gameState.food.push(newFood);
        }
    }
}

function createFood() {
    const maxAttempts = 100;
    let attempts = 0;
    const cellSize = getCellSize(); // Dynamic cell size
    
    while (attempts < maxAttempts) {
        // Pick random grid cell (avoid edges for safety)
        const gridX = Math.floor(Math.random() * (gameState.grid.size - 2)) + 1;
        const gridY = Math.floor(Math.random() * (gameState.grid.size - 2)) + 1;
        
        // Convert to pixel coordinates (center of grid cell)
        const x = gridX * cellSize + cellSize / 2;
        const y = gridY * cellSize + cellSize / 2;
        
        const position = { x, y };
        
        if (!isPositionOccupied(position, gridX, gridY)) {
            const foodImageObj = getRandomFoodImage(); // Get random food image object
            const isLongFood = foodImageObj && foodImageObj.isLong;
            
            // For 1x2 foods, check if there's space for the second cell
            if (isLongFood && !canPlaceLongFood(gridX, gridY)) {
                attempts++;
                continue;
            }
            
            return {
                position: position,
                gridX: gridX,
                gridY: gridY,
                imageObj: foodImageObj,
                image: foodImageObj ? foodImageObj.image : null,
                isLong: isLongFood,
                width: foodImageObj ? foodImageObj.width : 1,
                height: foodImageObj ? foodImageObj.height : 1,
                size: Math.max(4, cellSize - 2), // Grid cell size minus 2px margin, minimum 4px
                created: Date.now()
            };
        }
        
        attempts++;
    }
    
    return null;
}

function isPositionOccupied(position, gridX, gridY) {
    const cellSize = getCellSize();
    const tolerance = cellSize / 4; // Quarter cell tolerance
    
    // Check snake positions
    for (const snakePos of gameState.snake.positions) {
        const distance = Math.sqrt(
            Math.pow(position.x - snakePos.x, 2) + 
            Math.pow(position.y - snakePos.y, 2)
        );
        if (distance < tolerance) {
            return true;
        }
    }
    
    // Check other food positions - need to check all cells of long foods
    for (const food of gameState.food) {
        if (food.isLong) {
            // Check both cells of 1x2 food
            for (let dx = 0; dx < food.width; dx++) {
                const foodGridX = food.gridX + dx;
                const foodGridY = food.gridY;
                if (gridX === foodGridX && gridY === foodGridY) {
                    return true;
                }
            }
        } else {
            // Regular 1x1 food
            const distance = Math.sqrt(
                Math.pow(position.x - food.position.x, 2) + 
                Math.pow(position.y - food.position.y, 2)
            );
            if (distance < tolerance) {
                return true;
            }
        }
    }
    
    return false;
}

function canPlaceLongFood(gridX, gridY) {
    const gridSize = gameState.grid.size;
    
    // Check if there's space to the right (1x2 horizontal)
    if (gridX + 1 >= gridSize - 1) { // Avoid edge
        return false;
    }
    
    const cellSize = getCellSize();
    const secondCellX = (gridX + 1) * cellSize + cellSize / 2;
    const secondCellY = gridY * cellSize + cellSize / 2;
    const secondPosition = { x: secondCellX, y: secondCellY };
    
    // Check if second cell is occupied
    return !isPositionOccupied(secondPosition, gridX + 1, gridY);
}

function renderFood() {
    for (const food of gameState.food) {
        if (food.image) {
            const cellSize = getCellSize();
            
            if (food.isLong) {
                // Render 1x2 horizontal food
                const width = cellSize * 2 - 4; // 2 cells minus margin
                const height = cellSize - 4; // 1 cell minus margin
                
                ctx.drawImage(
                    food.image,
                    food.position.x - cellSize / 2, // Start from left edge of first cell
                    food.position.y - height / 2,
                    width,
                    height
                );
            } else {
                // Render regular 1x1 food
                const size = food.size;
                
                ctx.drawImage(
                    food.image,
                    food.position.x - size / 2,
                    food.position.y - size / 2,
                    size,
                    size
                );
            }
        } else {
            renderSimpleFood(food);
        }
    }
}

function renderSimpleFood(food) {
    const cellSize = getCellSize();
    const x = food.position.x;
    const y = food.position.y;
    
    if (food.isLong) {
        // Draw simple red rectangle for 1x2 food
        const width = cellSize * 2 - 4;
        const height = cellSize - 4;
        
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(x - cellSize / 2, y - height / 2, width, height);
        
        // Draw white border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - cellSize / 2, y - height / 2, width, height);
    } else {
        // Draw simple red square for 1x1 food
        const size = food.size;
        
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
        
        // Draw white border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - size / 2, y - size / 2, size, size);
    }
}

function renderDefaultFood(food) {
    const size = food.size;
    const x = food.position.x;
    const y = food.position.y;
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size / 2);
    gradient.addColorStop(0, '#ff6b6b');
    gradient.addColorStop(0.6, '#ee5a24');
    gradient.addColorStop(1, '#c44569');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x - size / 6, y - size / 6, size / 8, 0, Math.PI * 2);
    ctx.fill();
}

function checkFoodCollision() {
    const head = getSnakeHead();
    const cellSize = getCellSize();
    const pickupRadius = cellSize / 2; // Half a cell size
    
    for (let i = gameState.food.length - 1; i >= 0; i--) {
        const food = gameState.food[i];
        
        if (food.isLong) {
            // Check collision with 1x2 horizontal food
            // Check both cells of the long food
            for (let dx = 0; dx < food.width; dx++) {
                // Calculate the center of each cell in the 1x2 food
                const cellGridX = food.gridX + dx;
                const cellGridY = food.gridY;
                const cellCenterX = cellGridX * cellSize + cellSize / 2;
                const cellCenterY = cellGridY * cellSize + cellSize / 2;
                
                const distance = Math.sqrt(
                    Math.pow(head.x - cellCenterX, 2) + 
                    Math.pow(head.y - cellCenterY, 2)
                );
                
                console.log(`Checking 1x2 food collision: Snake at (${head.x.toFixed(1)}, ${head.y.toFixed(1)}), Cell ${dx} at (${cellCenterX.toFixed(1)}, ${cellCenterY.toFixed(1)}), Distance: ${distance.toFixed(1)}, Radius: ${pickupRadius.toFixed(1)}`);
                
                if (distance < pickupRadius) {
                    console.log(`1x2 food eaten!`);
                    gameState.food.splice(i, 1);
                    addScore(15); // Bonus points for long food
                    growSnake();
                    
                    spawnFood();
                    
                    return true;
                }
            }
        } else {
            // Regular 1x1 food collision
            const distance = Math.sqrt(
                Math.pow(head.x - food.position.x, 2) + 
                Math.pow(head.y - food.position.y, 2)
            );
            
            if (distance < pickupRadius) {
                gameState.food.splice(i, 1);
                addScore(10);
                growSnake();
                
                spawnFood();
                
                return true;
            }
        }
    }
    
    return false;
}

function getFoodPositions() {
    return gameState.food.map(food => food.position);
}