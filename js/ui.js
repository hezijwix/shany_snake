function initUI() {
    setupMenuButtons();
    setupSettingsPanel();
    updateUI();
}

function setupMenuButtons() {
    const startBtn = document.getElementById('start-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const restartBtn = document.getElementById('restart-btn');
    const menuBtn = document.getElementById('menu-btn');
    const closeSettingsBtn = document.getElementById('close-settings');
    
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            startGame();
        });
    }
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            showSettings();
        });
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            startGame();
        });
    }
    
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            showMainMenu();
        });
    }
    
    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', () => {
            hideSettings();
        });
    }
}

function setupSettingsPanel() {
    const settingsPanel = document.getElementById('settings-panel');
    if (!settingsPanel) return;
    
    settingsPanel.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    document.addEventListener('click', (e) => {
        if (settingsPanel.style.display === 'block' && 
            !settingsPanel.contains(e.target) && 
            e.target.id !== 'settings-btn') {
            hideSettings();
        }
    });
}

function showSettings() {
    const settingsPanel = document.getElementById('settings-panel');
    if (settingsPanel) {
        settingsPanel.style.display = 'block';
        loadSettingsUI();
    }
}

function hideSettings() {
    const settingsPanel = document.getElementById('settings-panel');
    if (settingsPanel) {
        settingsPanel.style.display = 'none';
        saveSettings();
    }
}

function loadSettingsUI() {
    const snakeColor = document.getElementById('snake-color');
    const outlineColor = document.getElementById('outline-color');
    const outlineWidth = document.getElementById('outline-width');
    const bgColor = document.getElementById('bg-color');
    
    if (snakeColor) snakeColor.value = gameState.settings.snakeColor;
    if (outlineColor) outlineColor.value = gameState.settings.outlineColor;
    if (outlineWidth) outlineWidth.value = gameState.settings.outlineWidth;
    if (bgColor) bgColor.value = gameState.settings.backgroundColor;
}

function showMainMenu() {
    const gameMenu = document.getElementById('game-menu');
    const gameOver = document.getElementById('game-over');
    const settingsPanel = document.getElementById('settings-panel');
    
    gameState.gameRunning = false;
    gameState.gameStarted = false;
    
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    if (gameMenu) gameMenu.style.display = 'block';
    if (gameOver) gameOver.style.display = 'none';
    if (settingsPanel) settingsPanel.style.display = 'none';
}

function hideAllMenus() {
    const gameMenu = document.getElementById('game-menu');
    const gameOver = document.getElementById('game-over');
    const settingsPanel = document.getElementById('settings-panel');
    
    if (gameMenu) gameMenu.style.display = 'none';
    if (gameOver) gameOver.style.display = 'none';
    if (settingsPanel) settingsPanel.style.display = 'none';
}

function showGameOver() {
    const gameOver = document.getElementById('game-over');
    const finalScore = document.getElementById('final-score');
    
    if (gameOver) gameOver.style.display = 'block';
    if (finalScore) finalScore.textContent = gameState.score;
}

function updateScoreDisplay() {
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('high-score');
    
    if (scoreElement) scoreElement.textContent = gameState.score;
    if (highScoreElement) highScoreElement.textContent = gameState.highScore;
}

function showPauseOverlay() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    
    let pauseOverlay = document.getElementById('pause-overlay');
    if (!pauseOverlay) {
        pauseOverlay = document.createElement('div');
        pauseOverlay.id = 'pause-overlay';
        pauseOverlay.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 24px;
            font-weight: bold;
            z-index: 15;
            pointer-events: none;
        `;
        pauseOverlay.textContent = 'PAUSED';
        canvas.parentElement.appendChild(pauseOverlay);
    }
    
    pauseOverlay.style.display = gameState.gameRunning ? 'none' : 'block';
}

function hidePauseOverlay() {
    const pauseOverlay = document.getElementById('pause-overlay');
    if (pauseOverlay) {
        pauseOverlay.style.display = 'none';
    }
}

function displayMessage(message, duration = 3000) {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    
    const messageElement = document.createElement('div');
    messageElement.style.cssText = `
        position: absolute;
        top: 20%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px 30px;
        border-radius: 8px;
        font-size: 18px;
        font-weight: bold;
        z-index: 15;
        pointer-events: none;
        animation: fadeInOut ${duration}ms ease-in-out;
    `;
    messageElement.textContent = message;
    
    canvas.parentElement.appendChild(messageElement);
    
    setTimeout(() => {
        if (messageElement.parentElement) {
            messageElement.parentElement.removeChild(messageElement);
        }
    }, duration);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -60%); }
        20% { opacity: 1; transform: translate(-50%, -50%); }
        80% { opacity: 1; transform: translate(-50%, -50%); }
        100% { opacity: 0; transform: translate(-50%, -40%); }
    }
`;
document.head.appendChild(style);