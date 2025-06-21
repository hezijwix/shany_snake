let keys = {};
let lastDirection = null;

function initInput() {
    setupKeyboardInput();
    setupTouchInput();
}

function setupKeyboardInput() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

function setupTouchInput() {
    const buttons = {
        'up-btn': 'up',
        'down-btn': 'down',
        'left-btn': 'left',
        'right-btn': 'right'
    };
    
    Object.entries(buttons).forEach(([id, direction]) => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                handleDirectionInput(direction);
                button.classList.add('active');
            });
            
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                button.classList.remove('active');
            });
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                handleDirectionInput(direction);
            });
        }
    });
    
    document.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });
}

function handleKeyDown(event) {
    keys[event.code] = true;
    
    const keyMap = {
        'ArrowUp': 'up',
        'KeyW': 'up',
        'ArrowDown': 'down',
        'KeyS': 'down',
        'ArrowLeft': 'left',
        'KeyA': 'left',
        'ArrowRight': 'right',
        'KeyD': 'right',
        'Space': 'pause',
        'Escape': 'menu'
    };
    
    const direction = keyMap[event.code];
    if (direction) {
        event.preventDefault();
        handleDirectionInput(direction);
    }
}

function handleKeyUp(event) {
    keys[event.code] = false;
}

function handleDirectionInput(direction) {
    if (direction === 'pause') {
        togglePause();
        return;
    }
    
    if (direction === 'menu') {
        showMainMenu();
        return;
    }
    
    if (!gameState.gameRunning || !gameState.gameStarted) {
        return;
    }
    
    if (['up', 'down', 'left', 'right'].includes(direction)) {
        changeDirection(direction);
        lastDirection = direction;
    }
}

function processInput() {
    if (!gameState.gameRunning) return;
    
    if (keys['Space']) {
        keys['Space'] = false;
        togglePause();
    }
    
    if (keys['Escape']) {
        keys['Escape'] = false;
        showMainMenu();
    }
}

function togglePause() {
    if (!gameState.gameStarted) return;
    
    gameState.gameRunning = !gameState.gameRunning;
    
    if (gameState.gameRunning) {
        gameLoop();
    } else {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    }
}

function showMainMenu() {
    gameState.gameRunning = false;
    gameState.gameStarted = false;
    
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    document.getElementById('game-menu').style.display = 'block';
    document.getElementById('game-over').style.display = 'none';
}

function getInputDirection() {
    return lastDirection;
}

function clearInputQueue() {
    inputQueue = [];
    lastDirection = null;
}