// Simple food image system - loads images from images/ folder or creates defaults

let foodImages = [];
let imagesLoaded = false;

function initSimpleFoodImages() {
    // Try to load images from the images folder
    loadImagesFromFolder();
}

function loadImagesFromFolder() {
    // Load all PNG files that are currently in your images folder
    const actualImageNames = [
        // Your actual images from the folder
        'SVC.png', 'ai.png', 'cocktail.png', 'crm.png', 'dev.png', 
        'lamp.png', 'massege.png', 'mic.png', 'wm.png',
        
        // Your actual 1x2 images with _2 suffix
        'Done_2.png', 'lead_2.png', 'ticket_2.png',
        
        // Also try some common names in case you add them later
        'apple.png', 'cherry.png', 'banana.png', 'orange.png', 'grape.png',
        'glass.png', 'servixe.png', 'food1.png', 'food2.png', 'food3.png',
        'hotdog_2.png', 'bread_2.png', 'sandwich_2.png'
    ];
    
    let loadedCount = 0;
    let failedCount = 0;
    
    actualImageNames.forEach((imageName, index) => {
        const img = new Image();
        
        img.onload = function() {
            const isLongFood = imageName.includes('_2.png');
            foodImages.push({
                image: img,
                name: imageName,
                isLong: isLongFood,
                width: isLongFood ? 2 : 1,  // 2 cells wide for _2 items
                height: 1
            });
            loadedCount++;
            console.log(`Loaded ${isLongFood ? '1x2' : '1x1'} food image: ${imageName}`);
            checkLoadingComplete(loadedCount, failedCount, actualImageNames.length);
        };
        
        img.onerror = function() {
            failedCount++;
            console.log(`Failed to load: ${imageName}`);
            checkLoadingComplete(loadedCount, failedCount, actualImageNames.length);
        };
        
        img.src = `images/${imageName}`;
    });
}

function checkLoadingComplete(loadedCount, failedCount, totalCount) {
    if (loadedCount + failedCount === totalCount) {
        if (foodImages.length === 0) {
            // No images loaded, create default images
            createDefaultFoodImages();
        } else {
            imagesLoaded = true;
            console.log(`Loaded ${foodImages.length} custom food images`);
        }
    }
}

function createDefaultFoodImages() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.height = 32;
    
    const colors = [
        '#ff6b6b', // Red apple
        '#4ecdc4', // Teal cherry
        '#f9ca24', // Yellow banana
        '#ff9f43', // Orange
        '#6c5ce7'  // Purple grape
    ];
    
    colors.forEach((color, index) => {
        // Clear canvas
        ctx.clearRect(0, 0, 32, 32);
        
        // Draw food item as a circle with gradient
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 15);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, adjustColor(color, -40));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(16, 16, 14, 0, Math.PI * 2);
        ctx.fill();
        
        // Add highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(12, 12, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Convert canvas to image
        const img = new Image();
        img.onload = function() {
            foodImages.push({
                image: img,
                name: `default-${index}.png`
            });
            if (foodImages.length === colors.length) {
                imagesLoaded = true;
                console.log(`Created ${foodImages.length} default food images`);
            }
        };
        img.src = canvas.toDataURL('image/png');
    });
}

function adjustColor(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function getRandomFoodImage() {
    if (!imagesLoaded || foodImages.length === 0) {
        return null;
    }
    const randomFood = foodImages[Math.floor(Math.random() * foodImages.length)];
    return randomFood; // Return the full food object with dimensions
}

function getRandomFoodImageLegacy() {
    // Legacy function for backward compatibility
    const foodObj = getRandomFoodImage();
    return foodObj ? (foodObj.image || foodObj) : null;
}

function getFoodImagesCount() {
    return foodImages.length;
}