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
let currentMode = null; // 'line', 'circle', 'rectangle', etc.
let drawing = false;
let startX = 0, startY = 0;

const updateSizeOnScreen = () => (sizeElement.innerText = size);

canvas.addEventListener("mousedown", (e) => {
  isPressed = true;
  x = e.offsetX;
  y = e.offsetY;
});

canvas.addEventListener("mouseup", (e) => {
  isPressed = false;
  x = undefined;
  y = undefined;
});

canvas.addEventListener("mousemove", (e) => {
  if (isPressed) {
    x2 = e.offsetX;
    y2 = e.offsetY;
    drawCircle(x2, y2);
    drawLine(x, y, x2, y2);
    x = x2;
    y = y2;
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
function drawCircle (x, y) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
};

function drawLine (x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 2;
  ctx.stroke();
};

function drawRectangle(x, y, width, height) {
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.stroke();
}
function drawText(text, x, y) {
  ctx.font = "16px Arial";
  ctx.fillText(text, x, y);
}
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}