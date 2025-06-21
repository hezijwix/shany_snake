# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Game

Open `index.html` in any modern web browser. No build process or server required - this is a pure client-side HTML5 Canvas game.

## Architecture Overview

This is a modern Snake game built with vanilla JavaScript and HTML5 Canvas. The architecture is modular with clear separation of concerns:

### Core Game Loop
- `js/game.js` - Central game state management and main game loop using `requestAnimationFrame`
- The `gameState` object holds all game data including canvas dimensions, grid configuration, snake state, food array, and settings
- Game runs at 60 FPS with snake movement intervals of 150ms for classic feel

### Grid System 
- **Dynamic Grid Sizing**: Core feature supporting configurable grid sizes (10x10 to 35x35)
- `getCellSize()` function calculates cell dimensions: `canvasWidth / gridSize`  
- All positioning, rendering, and collision detection adapts automatically to any grid size
- Snake, food, and collision systems all use `getCellSize()` instead of hardcoded values

### Food System Architecture
- **Dual Food Types**: 1x1 regular foods and 1x2 horizontal foods
- **"_2" Naming Convention**: Files ending with "_2.png" automatically become 1x2 horizontal foods
- `js/simpleFoodImages.js` - Manages automatic PNG loading from `images/` folder
- `js/food.js` - Handles food creation, positioning, rendering, and collision detection
- 5 food items spawn simultaneously with smart placement validation for 1x2 foods

### Snake Rendering System
- Smooth line rendering using Canvas `stroke()` with round caps and joins
- Dynamic width calculation: `Math.max(4, cellSize - 4)` ensures proper scaling
- Handles both single segments (circles) and multi-segment snakes (smooth lines)

### Input and Controls  
- `js/input.js` - Unified keyboard (WASD/arrows) and touch control system
- Input queue system prevents diagonal movement by limiting one direction change per movement interval
- Mobile-responsive with on-screen directional buttons

### Settings and Persistence
- `js/customization.js` - Settings panel with color customization and grid size selection
- Local storage for settings and high scores
- Grid size changes trigger complete game state reset with proper snake repositioning

## Key Implementation Details

### Custom Food Image System
- Auto-scans `images/` folder for PNG files matching predefined names
- Supports both regular 1x1 foods and 1x2 horizontal foods via "_2" suffix
- Fallback to programmatically generated colored circles if no images found
- Each food object stores: `position`, `gridX/gridY`, `imageObj`, `isLong`, `width/height`

### 1x2 Food Collision Detection
- 1x2 foods occupy two horizontal grid cells: `(gridX, gridY)` and `(gridX+1, gridY)`  
- Collision detection loops through both cells independently
- Snake can eat 1x2 food by touching either cell
- Bonus scoring: 15 points for 1x2 foods vs 10 points for regular foods

### Grid-Based Movement
- Snake movement is discrete, cell-by-cell rather than smooth pixel movement
- Position calculations use grid coordinates converted to pixel centers
- Wall wrapping enabled - snake teleports to opposite side when hitting edges
- Movement validation prevents reversing into snake body

## File Dependencies and Loading Order

Scripts must load in this specific order (as defined in `index.html`):
1. `game.js` - Core game state and initialization  
2. `snake.js` - Snake logic and rendering
3. `food.js` - Food system
4. `collision.js` - Collision detection utilities
5. `input.js` - Input handling  
6. `customization.js` - Settings management
7. `ui.js` - UI state management
8. `simpleFoodImages.js` - Custom image loading system

## Adding New Food Images

Place PNG files in `images/` folder:
- Regular foods: `filename.png` → 1x1 food items
- Long foods: `filename_2.png` → 1x2 horizontal food items  
- Update the `actualImageNames` array in `simpleFoodImages.js` to include new file names
- Images auto-load on game initialization with fallback to default shapes

## Game State Management

The central `gameState` object coordinates all game systems:
- `canvas`: Fixed 500x500 dimensions
- `grid`: Dynamic size and calculated cellSize  
- `snake`: Positions array, direction, growing state
- `food`: Array of food objects with position and type data
- `settings`: Customizable colors, grid size, stored in localStorage

## Mobile Responsiveness

- Canvas scales responsively while maintaining aspect ratio
- Touch controls provide directional input equivalent to keyboard
- UI elements repositioned for mobile screens via CSS media queries