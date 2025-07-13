// drawer code

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

clearElement.addEventListener("click", () =>
  ctx.clearRect(0, 0, canvas.width, canvas.height)
);

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
}