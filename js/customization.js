function initCustomization() {
    setupColorInputs();
    setupRangeInputs();
    setupGridSizeInput();
    loadCustomizationValues();
}

function setupColorInputs() {
    const snakeColorInput = document.getElementById('snake-color');
    const outlineColorInput = document.getElementById('outline-color');
    const bgColorInput = document.getElementById('bg-color');
    
    if (snakeColorInput) {
        snakeColorInput.addEventListener('input', (e) => {
            gameState.settings.snakeColor = e.target.value;
            applyCustomization();
        });
    }
    
    if (outlineColorInput) {
        outlineColorInput.addEventListener('input', (e) => {
            gameState.settings.outlineColor = e.target.value;
            applyCustomization();
        });
    }
    
    if (bgColorInput) {
        bgColorInput.addEventListener('input', (e) => {
            gameState.settings.backgroundColor = e.target.value;
            applyCustomization();
        });
    }
}

function setupRangeInputs() {
    const outlineWidthInput = document.getElementById('outline-width');
    
    if (outlineWidthInput) {
        outlineWidthInput.addEventListener('input', (e) => {
            gameState.settings.outlineWidth = parseInt(e.target.value);
            applyCustomization();
        });
    }
}

function setupGridSizeInput() {
    const gridSizeInput = document.getElementById('grid-size');
    
    if (gridSizeInput) {
        gridSizeInput.addEventListener('change', (e) => {
            const newSize = parseInt(e.target.value);
            updateGridSize(newSize);
            applyCustomization();
        });
    }
}

function loadCustomizationValues() {
    const snakeColorInput = document.getElementById('snake-color');
    const outlineColorInput = document.getElementById('outline-color');
    const bgColorInput = document.getElementById('bg-color');
    const outlineWidthInput = document.getElementById('outline-width');
    const gridSizeInput = document.getElementById('grid-size');
    
    if (snakeColorInput) {
        snakeColorInput.value = gameState.settings.snakeColor;
    }
    
    if (outlineColorInput) {
        outlineColorInput.value = gameState.settings.outlineColor;
    }
    
    if (bgColorInput) {
        bgColorInput.value = gameState.settings.backgroundColor;
    }
    
    if (outlineWidthInput) {
        outlineWidthInput.value = gameState.settings.outlineWidth;
    }
    
    if (gridSizeInput) {
        gridSizeInput.value = gameState.grid.size.toString();
    }
    
    applyCustomization();
}

function applyCustomization() {
    const canvas = document.getElementById('game-canvas');
    if (canvas) {
        canvas.style.backgroundColor = gameState.settings.backgroundColor;
    }
    
    saveSettings();
}

function resetToDefaults() {
    gameState.settings = {
        snakeColor: '#4CAF50',
        outlineColor: '#2E7D32',
        outlineWidth: 2,
        backgroundColor: '#1a1a1a',
        foodImages: gameState.settings.foodImages,
        foodSize: 30
    };
    
    loadCustomizationValues();
    saveSettings();
}

function exportSettings() {
    const settings = {
        ...gameState.settings,
        foodImages: []
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'snake-game-settings.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
}

function importSettings(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const settings = JSON.parse(e.target.result);
            
            if (settings.snakeColor) gameState.settings.snakeColor = settings.snakeColor;
            if (settings.outlineColor) gameState.settings.outlineColor = settings.outlineColor;
            if (settings.outlineWidth !== undefined) gameState.settings.outlineWidth = settings.outlineWidth;
            if (settings.backgroundColor) gameState.settings.backgroundColor = settings.backgroundColor;
            if (settings.foodSize !== undefined) gameState.settings.foodSize = settings.foodSize;
            
            loadCustomizationValues();
            displayMessage('Settings imported successfully!');
        } catch (error) {
            displayMessage('Error importing settings: Invalid file format');
        }
    };
    reader.readAsText(file);
}

function createPresetThemes() {
    const themes = {
        classic: {
            snakeColor: '#4CAF50',
            outlineColor: '#2E7D32',
            outlineWidth: 2,
            backgroundColor: '#1a1a1a'
        },
        neon: {
            snakeColor: '#00ffff',
            outlineColor: '#0080ff',
            outlineWidth: 3,
            backgroundColor: '#000020'
        },
        retro: {
            snakeColor: '#ffff00',
            outlineColor: '#ff8000',
            outlineWidth: 1,
            backgroundColor: '#008000'
        },
        dark: {
            snakeColor: '#ffffff',
            outlineColor: '#888888',
            outlineWidth: 2,
            backgroundColor: '#000000'
        },
        sunset: {
            snakeColor: '#ff6b35',
            outlineColor: '#d63031',
            outlineWidth: 2,
            backgroundColor: '#2d3436'
        }
    };
    
    return themes;
}

function applyTheme(themeName) {
    const themes = createPresetThemes();
    const theme = themes[themeName];
    
    if (theme) {
        Object.assign(gameState.settings, theme);
        loadCustomizationValues();
        displayMessage(`${themeName.charAt(0).toUpperCase() + themeName.slice(1)} theme applied!`);
    }
}

function getColorPalette(baseColor) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.height = 1;
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 1, 1);
    
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    
    return {
        light: `rgb(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)})`,
        dark: `rgb(${Math.max(0, r - 50)}, ${Math.max(0, g - 50)}, ${Math.max(0, b - 50)})`,
        complement: `rgb(${255 - r}, ${255 - g}, ${255 - b})`
    };
}