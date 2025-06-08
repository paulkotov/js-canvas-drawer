// drawer code
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// drawing methods
function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawCircle(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

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

