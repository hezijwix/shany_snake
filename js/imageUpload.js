function initImageUpload() {
    setupFileInput();
    createDefaultFoodImages();
    loadDefaultImages();
}

function setupFileInput() {
    const fileInput = document.getElementById('food-images');
    if (!fileInput) return;
    
    fileInput.addEventListener('change', handleFileSelection);
    
    const dropZone = createDropZone();
    const preview = document.getElementById('image-preview');
    if (preview) {
        preview.appendChild(dropZone);
    }
}

function createDropZone() {
    const dropZone = document.createElement('div');
    dropZone.className = 'drop-zone';
    dropZone.style.cssText = `
        border: 2px dashed #555;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        margin: 10px 0;
        background: rgba(255, 255, 255, 0.05);
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    dropZone.innerHTML = `
        <p>Drag & drop PNG images here or click to select</p>
        <small>Supports multiple files with transparency</small>
    `;
    
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
    dropZone.addEventListener('click', () => {
        document.getElementById('food-images').click();
    });
    
    return dropZone;
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#4CAF50';
    e.currentTarget.style.background = 'rgba(76, 175, 80, 0.1)';
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#555';
    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#555';
    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
}

function handleFileSelection(e) {
    const files = Array.from(e.target.files);
    processFiles(files);
}

function processFiles(files) {
    const validFiles = files.filter(file => {
        if (file.type !== 'image/png') {
            displayMessage(`${file.name} is not a PNG file. Only PNG files are supported.`);
            return false;
        }
        return true;
    });
    
    if (validFiles.length === 0) return;
    
    validFiles.forEach(file => {
        loadImageFromFile(file);
    });
}

function loadImageFromFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            if (validateImage(img, file.name)) {
                addImageToGame(img, file.name);
                updateImagePreview();
                displayMessage(`${file.name} added successfully!`);
            }
        };
        img.onerror = function() {
            displayMessage(`Error loading ${file.name}`);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function validateImage(img, filename) {
    if (img.width > 512 || img.height > 512) {
        displayMessage(`${filename} is too large. Maximum size is 512x512 pixels.`);
        return false;
    }
    
    if (img.width < 16 || img.height < 16) {
        displayMessage(`${filename} is too small. Minimum size is 16x16 pixels.`);
        return false;
    }
    
    return true;
}

function addImageToGame(img, filename) {
    gameState.settings.foodImages.push({
        image: img,
        name: filename,
        id: Date.now() + Math.random()
    });
    
    saveSettings();
}

function updateImagePreview() {
    const preview = document.getElementById('image-preview');
    if (!preview) return;
    
    const existingImages = preview.querySelectorAll('.preview-image');
    existingImages.forEach(img => img.remove());
    
    gameState.settings.foodImages.forEach((foodImg, index) => {
        const container = document.createElement('div');
        container.className = 'preview-container';
        container.style.cssText = `
            position: relative;
            display: inline-block;
            margin: 5px;
        `;
        
        const img = document.createElement('img');
        img.className = 'preview-image';
        img.src = foodImg.image.src;
        img.title = foodImg.name;
        img.style.cssText = `
            width: 50px;
            height: 50px;
            border: 2px solid #555;
            border-radius: 4px;
            object-fit: cover;
            background: rgba(255, 255, 255, 0.1);
        `;
        
        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '×';
        removeBtn.style.cssText = `
            position: absolute;
            top: -5px;
            right: -5px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: none;
            background: #f44336;
            color: white;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        removeBtn.addEventListener('click', () => {
            removeImage(index);
        });
        
        container.appendChild(img);
        container.appendChild(removeBtn);
        preview.appendChild(container);
    });
}

function removeImage(index) {
    gameState.settings.foodImages.splice(index, 1);
    updateImagePreview();
    saveSettings();
    displayMessage('Image removed');
}

function loadDefaultImages() {
    const defaultImagePaths = [
        'images/apple.png',
        'images/cherry.png',
        'images/banana.png',
        'images/orange.png',
        'images/grape.png'
    ];
    
    defaultImagePaths.forEach(path => {
        const img = new Image();
        img.onload = function() {
            if (gameState.settings.foodImages.length < 5) {
                gameState.settings.foodImages.push({
                    image: img,
                    name: path.split('/').pop(),
                    id: Date.now() + Math.random(),
                    isDefault: true
                });
            }
        };
        img.onerror = function() {
            console.log(`Default image ${path} not found, using fallback`);
        };
        img.src = path;
    });
}

function createDefaultFoodImages() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.height = 64;
    
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'];
    
    colors.forEach((color, index) => {
        ctx.clearRect(0, 0, 64, 64);
        
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color + '80');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(32, 32, 28, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(24, 24, 8, 0, Math.PI * 2);
        ctx.fill();
        
        const img = new Image();
        img.onload = function() {
            gameState.settings.foodImages.push({
                image: img,
                name: `default-${index}.png`,
                id: Date.now() + Math.random() + index,
                isDefault: true
            });
        };
        img.src = canvas.toDataURL('image/png');
    });
}

function clearAllImages() {
    gameState.settings.foodImages = [];
    updateImagePreview();
    saveSettings();
    displayMessage('All images cleared');
}