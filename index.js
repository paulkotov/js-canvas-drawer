const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const increaseButton = document.getElementById("increase");
const decreaseButton = document.getElementById("decrease");
const sizeElement = document.getElementById("size");
const colorElement = document.getElementById("color");
const clearElement = document.getElementById("clear");
const lineButton = document.getElementById("line");
const circleButton = document.getElementById("circle");
const rectangleButton = document.getElementById("rectangle");
const backgroundButton = document.getElementById("background");

// Background modal elements
const backgroundModal = document.getElementById("backgroundModal");
const closeModalBtn = document.getElementById("closeModal");
const applyBackgroundBtn = document.getElementById("applyBackground");
const cancelBackgroundBtn = document.getElementById("cancelBackground");
const backgroundTypeRadios = document.querySelectorAll('input[name="backgroundType"]');
const solidColorInput = document.getElementById("solidColor");
const gradientTypeSelect = document.getElementById("gradientType");
const gradientColor1Input = document.getElementById("gradientColor1");
const gradientColor2Input = document.getElementById("gradientColor2");
const gradientAngleSelect = document.getElementById("gradientAngle");
const gradientDirectionDiv = document.getElementById("gradientDirection"); 

let size = 10;
let color = "black";
let x;
let y;
let isPressed = false;
// drawing mode
let currentMode = 'freehand'; // 'freehand', 'line', 'circle', 'rectangle'
let drawing = false;
let startX = 0, startY = 0;
let imageData; // Store canvas state for preview

// Background settings
let currentBackground = {
  type: 'none', // 'none', 'solid', 'gradient'
  solidColor: '#ffffff',
  gradientType: 'linear', // 'linear', 'radial'
  gradientColors: ['#667eea', '#764ba2'],
  gradientAngle: 135
};

function resizeCanvas() {
  // Store current drawing
  const currentDrawing = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Apply background and restore drawing
  applyCurrentBackground();
  if (currentDrawing.width > 0 && currentDrawing.height > 0) {
    ctx.putImageData(currentDrawing, 0, 0);
  }
}

function applyCurrentBackground() {
  if (currentBackground.type === 'solid') {
    ctx.fillStyle = currentBackground.solidColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (currentBackground.type === 'gradient') {
    let gradient;
    
    if (currentBackground.gradientType === 'linear') {
      // Calculate gradient direction based on angle
      const angle = (currentBackground.gradientAngle * Math.PI) / 180;
      const x1 = canvas.width / 2 - Math.cos(angle) * canvas.width / 2;
      const y1 = canvas.height / 2 - Math.sin(angle) * canvas.height / 2;
      const x2 = canvas.width / 2 + Math.cos(angle) * canvas.width / 2;
      const y2 = canvas.height / 2 + Math.sin(angle) * canvas.height / 2;
      
      gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    } else {
      // Radial gradient
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.max(canvas.width, canvas.height) / 2;
      
      gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    }
    
    gradient.addColorStop(0, currentBackground.gradientColors[0]);
    gradient.addColorStop(1, currentBackground.gradientColors[1]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  // If type is 'none', do nothing (transparent background)
}

resizeCanvas();

window.addEventListener('resize', resizeCanvas);

const updateSizeOnScreen = () => (sizeElement.innerText = size);

canvas.addEventListener("mousedown", (e) => {
  isPressed = true;
  startX = e.offsetX;
  startY = e.offsetY;
  x = startX;
  y = startY;
  
  if (currentMode !== 'freehand') {
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (isPressed) {
    const endX = e.offsetX;
    const endY = e.offsetY;
    
    switch (currentMode) {
      case 'line':
        drawLine(startX, startY, endX, endY);
        break;
      case 'circle':
        const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        drawCircleShape(startX, startY, radius);
        break;
      case 'rectangle':
        const width = endX - startX;
        const height = endY - startY;
        drawRectangle(startX, startY, width, height);
        break;
    }
  }
  
  isPressed = false;
  x = undefined;
  y = undefined;
});

canvas.addEventListener("mousemove", (e) => {
  if (isPressed) {
    const currentX = e.offsetX;
    const currentY = e.offsetY;
    
    if (currentMode === 'freehand') {
      // Freehand drawing
      drawFreehandCircle(currentX, currentY);
      drawFreehandLine(x, y, currentX, currentY);
      x = currentX;
      y = currentY;
    } else {
      // Shape drawing with preview
      // Restore the canvas state
      ctx.putImageData(imageData, 0, 0);
      
      // Draw preview based on current mode
      ctx.save();
      ctx.globalAlpha = 0.5; // Make preview semi-transparent
      
      switch (currentMode) {
        case 'line':
          drawLine(startX, startY, currentX, currentY);
          break;
        case 'circle':
          const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));
          drawCircleShape(startX, startY, radius);
          break;
        case 'rectangle':
          const width = currentX - startX;
          const height = currentY - startY;
          drawRectangle(startX, startY, width, height);
          break;
      }
      
      ctx.restore();
    }
  }
});

increaseButton.addEventListener("click", () => {
  size += 5;
  if (size > 50) size = 50;
  updateSizeOnScreen();
});

decreaseButton.addEventListener("click", () => {
  size -= 5;
  if (size < 5) size = 5;
  updateSizeOnScreen();
});

colorElement.addEventListener("change", (e) => (color = e.target.value));

lineButton.addEventListener("click", () => {
  currentMode = 'line';
  canvas.style.cursor = 'crosshair';
});

circleButton.addEventListener("click", () => {
  currentMode = 'circle';
  canvas.style.cursor = 'crosshair';
});

rectangleButton.addEventListener("click", () => {
  currentMode = 'rectangle';
  canvas.style.cursor = 'crosshair';
});

clearElement.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  applyCurrentBackground();
});

// Background modal event listeners
backgroundButton.addEventListener("click", () => {
  backgroundModal.style.display = 'block';
  updateModalFromCurrentBackground();
});

closeModalBtn.addEventListener("click", () => {
  backgroundModal.style.display = 'none';
});

cancelBackgroundBtn.addEventListener("click", () => {
  backgroundModal.style.display = 'none';
});

// Close modal when clicking outside
backgroundModal.addEventListener("click", (e) => {
  if (e.target === backgroundModal) {
    backgroundModal.style.display = 'none';
  }
});

applyBackgroundBtn.addEventListener("click", () => {
  updateBackgroundFromModal();
  applyCurrentBackground();
  backgroundModal.style.display = 'none';
});

// Show/hide gradient controls based on selected background type
backgroundTypeRadios.forEach(radio => {
  radio.addEventListener("change", (e) => {
    const gradientControls = document.querySelector('.gradient-controls');
    const colorInput = document.getElementById('solidColor');
    
    if (e.target.value === 'gradient') {
      gradientControls.style.display = 'flex';
      colorInput.style.display = 'none';
    } else if (e.target.value === 'solid') {
      gradientControls.style.display = 'none';
      colorInput.style.display = 'block';
    } else {
      gradientControls.style.display = 'none';
      colorInput.style.display = 'none';
    }
  });
});

// Show/hide gradient direction based on gradient type
gradientTypeSelect.addEventListener("change", (e) => {
  if (e.target.value === 'radial') {
    gradientDirectionDiv.style.display = 'none';
  } else {
    gradientDirectionDiv.style.display = 'flex';
  }
});

function updateModalFromCurrentBackground() {
  // Set background type radio
  const typeRadio = document.querySelector(`input[name="backgroundType"][value="${currentBackground.type}"]`);
  if (typeRadio) {
    typeRadio.checked = true;
  }
  
  // Update solid color
  solidColorInput.value = currentBackground.solidColor;
  
  // Update gradient settings
  gradientTypeSelect.value = currentBackground.gradientType;
  gradientColor1Input.value = currentBackground.gradientColors[0];
  gradientColor2Input.value = currentBackground.gradientColors[1];
  gradientAngleSelect.value = currentBackground.gradientAngle;
  
  // Show/hide appropriate controls
  const gradientControls = document.querySelector('.gradient-controls');
  const colorInput = document.getElementById('solidColor');
  
  if (currentBackground.type === 'gradient') {
    gradientControls.style.display = 'flex';
    colorInput.style.display = 'none';
    gradientDirectionDiv.style.display = currentBackground.gradientType === 'radial' ? 'none' : 'flex';
  } else if (currentBackground.type === 'solid') {
    gradientControls.style.display = 'none';
    colorInput.style.display = 'block';
  } else {
    gradientControls.style.display = 'none';
    colorInput.style.display = 'none';
  }
}

function updateBackgroundFromModal() {
  const selectedType = document.querySelector('input[name="backgroundType"]:checked').value;
  
  currentBackground.type = selectedType;
  currentBackground.solidColor = solidColorInput.value;
  currentBackground.gradientType = gradientTypeSelect.value;
  currentBackground.gradientColors = [gradientColor1Input.value, gradientColor2Input.value];
  currentBackground.gradientAngle = parseInt(gradientAngleSelect.value);
}

// drawing methods
function drawFreehandCircle(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawFreehandLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 2;
  ctx.stroke();
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.stroke();
}

function drawCircleShape(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.stroke();
}

function drawRectangle(x, y, width, height) {
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.stroke();
}

function drawText(text, x, y) {
  ctx.font = "16px Arial";
  ctx.fillText(text, x, y);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  applyCurrentBackground();
}