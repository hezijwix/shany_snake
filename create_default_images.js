// Node.js script to create default food PNG images
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'images');

// Create images directory if it doesn't exist
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
}

const foods = [
    { name: 'apple', color: '#ff6b6b' },      // Red apple
    { name: 'cherry', color: '#dc143c' },     // Dark red cherry  
    { name: 'banana', color: '#f9ca24' },     // Yellow banana
    { name: 'orange', color: '#ff9f43' },     // Orange
    { name: 'grape', color: '#6c5ce7' }       // Purple grape
];

function adjustColor(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

foods.forEach(food => {
    const canvas = createCanvas(64, 64);
    const ctx = canvas.getContext('2d');
    
    // Clear canvas with transparent background
    ctx.clearRect(0, 0, 64, 64);
    
    // Create gradient for the food item
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 28);
    gradient.addColorStop(0, food.color);
    gradient.addColorStop(1, adjustColor(food.color, -60));
    
    // Draw main circle
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.fill();
    
    // Add border
    ctx.strokeStyle = adjustColor(food.color, -80);
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Add highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(24, 24, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Add smaller highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(20, 20, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Save as PNG file
    const filePath = path.join(imagesDir, `${food.name}.png`);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filePath, buffer);
    
    console.log(`Created ${food.name}.png`);
});

console.log('Default food images created successfully!');