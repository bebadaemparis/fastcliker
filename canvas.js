// canvas.js
const canvas = document.getElementById("backgroundCanvas");
const ctx = canvas.getContext("2d");

let width, height;
function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Bubble {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = height + Math.random() * 100;
    this.radius = Math.random() * 15 + 10;
    this.speed = Math.random() * 1 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.5;
    this.color = `rgba(255, 255, 255, ${this.alpha})`;
  }

  update() {
    this.y -= this.speed;
    if (this.y + this.radius < 0) {
      this.reset();
      this.y = height + this.radius;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

const bubbles = [];
for (let i = 0; i < 40; i++) {
  bubbles.push(new Bubble());
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  bubbles.forEach((bubble) => {
    bubble.update();
    bubble.draw();
  });
  requestAnimationFrame(animate);
}

animate();
