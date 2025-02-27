// 1 - Criar Nave
// 2 - Criar Movimentação da Nave utilizando as setas
// 3 - Corrigir Velocidade da Movimentação
// 4 - Adicionar os Disparos
// 5 - Adicionar os Asteroides

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function resizeCanvas() {
  const targetRatio = 16 / 9;
  const width = window.innerWidth;
  const height = window.innerHeight;

  if (width / height > targetRatio) {
    canvas.width = height * targetRatio;
    canvas.height = height;
  } else {
    canvas.width = width;
    canvas.height = width / targetRatio;
  }

  canvas.style.position = "fixed";
  canvas.style.left = (window.innerWidth - canvas.width) / 2 + "px";
  canvas.style.top = (window.innerHeight - canvas.height) / 2 + "px";

  resetShipPosition();
}

function resetShipPosition() {
  ship.x = canvas.width / 2;
  ship.y = canvas.height / 2;
}

window.addEventListener("resize", resizeCanvas);

const ship = {
  x: 0,
  y: 0,
  radius: 20,
  angle: 0,
  rotation: 0,
  thrust: false,
  vx: 0,
  vy: 0,
  speed: 0.5,
  maxSpeed: 3,
  friction: 0.02,
};

const bullets = [];
const bulletSpeed = 7;
const bulletRadius = 2;
const bulletMaxlifetime = 60;
const fireDelay = 250;
let lastFire = 0;

const asteroids = [];
const asteroidCount = 5;
const asteroidSpeed = 1.5;
const asteroidRadius = 50;

function drawShip() {
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(
    ship.x + ship.radius * Math.cos(ship.angle),
    ship.y - ship.radius * Math.sin(ship.angle)
  );
  ctx.lineTo(
    ship.x - ship.radius * (Math.cos(ship.angle) + Math.sin(ship.angle)),
    ship.y + ship.radius * (Math.sin(ship.angle) - Math.cos(ship.angle))
  );
  ctx.lineTo(
    ship.x - ship.radius * (Math.cos(ship.angle) - Math.sin(ship.angle)),
    ship.y + ship.radius * (Math.sin(ship.angle) + Math.cos(ship.angle))
  );
  ctx.closePath();
  ctx.stroke();

  if (ship.thrust) {
    ctx.beginPath();
    ctx.moveTo(
      ship.x - ship.radius * (Math.cos(ship.angle) * 0.7),
      ship.y + ship.radius * (Math.sin(ship.angle) * 0.7)
    );
    ctx.lineTo(
      ship.x - ship.radius * (Math.cos(ship.angle) * 1.5),
      ship.y + ship.radius * (Math.sin(ship.angle) * 1.5)
    );
  }
  ctx.stroke();

  if (ship.thrust) {
    ship.vx += Math.cos(ship.angle) * ship.speed;
    ship.vy -= Math.sin(ship.angle) * ship.speed;

    const currentSpeed = Math.sqrt(ship.vx * ship.vx + ship.vy * ship.vy);
    if (currentSpeed > ship.maxSpeed) {
      ship.vx = (ship.vx / currentSpeed) * ship.maxSpeed;
      ship.vy = (ship.vy / currentSpeed) * ship.maxSpeed;
    }
  }

  ship.vx *= 1 - ship.friction;
  ship.vy *= 1 - ship.friction;
}

function keyDown(e) {
  if (e.key === "ArrowLeft") {
    ship.rotation = 0.05;
  } else if (e.key === "ArrowRight") {
    ship.rotation = -0.05;
  } else if (e.key === "ArrowUp") {
    ship.thrust = true;
  } else if (e.key === " ") {
    shootBullet();
  }
}

function keyUp(e) {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    ship.rotation = 0;
  } else if (e.key === "ArrowUp") {
    ship.thrust = false;
  }
}

function shootBullet() {
  const now = Date.now();
  if (now - lastFire > fireDelay) {
    bullets.push({
      x: ship.x + Math.cos(ship.angle) * (ship.radius + 5),
      y: ship.y - Math.sin(ship.angle) * (ship.radius + 5),
      vx: Math.cos(ship.angle) * bulletSpeed,
      vy: -Math.sin(ship.angle) * bulletSpeed,
      radius: bulletRadius,
      lifetime: bulletMaxlifetime,
    });
    lastFire = now;
  }
}

function drawBullets() {
  ctx.fillStyle = "#fff";
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.lifetime--;

    if (bullet.lifetime <= 0) {
      bullets.splice(i, 1);
      continue;
    }

    bullet.x += bullet.vx;
    bullet.y += bullet.vy;

    if (bullet.x > canvas.width) bullet.x = 0;
    if (bullet.x < 0) bullet.x = canvas.width;
    if (bullet.y > canvas.height) bullet.y = 0;
    if (bullet.y < 0) bullet.y = canvas.height;

    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function gameLoop() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ship.angle += ship.rotation;

  if (ship.thrust) {
    ship.vx += Math.cos(ship.angle) * ship.speed;
    ship.vy -= Math.sin(ship.angle) * ship.speed;
  }

  ship.x += ship.vx;
  ship.y += ship.vy;

  if (ship.x > canvas.width) ship.x = 0;
  if (ship.x < 0) ship.x = canvas.width;
  if (ship.y > canvas.height) ship.y = 0;
  if (ship.y < 0) ship.y = canvas.height;

  drawShip();
  drawBullets();
  drawAsteroids();
  requestAnimationFrame(gameLoop);
}

function createAsteroid() {
  const side = Math.floor(Math.random() * 4);
  let x, y, vx, vy;

  switch (side) {
    case 0:
      x = Math.random() * canvas.width;
      y = -asteroidRadius;
      vx = (Math.random() - 0.5) * asteroidSpeed;
      vy = Math.random() * asteroidSpeed;
      break;
    case 1:
      x = canvas.width + asteroidRadius;
      y = Math.random() * canvas.height;
      vx = -Math.random() * asteroidSpeed;
      vy = (Math.random() - 0.5) * asteroidSpeed;
      break;
    case 2:
      x = Math.random() * canvas.width;
      y = canvas.height + asteroidRadius;
      vx = (Math.random() - 0.5) * asteroidSpeed;
      vy = -Math.random() * asteroidSpeed;
      break;
    case 3:
      x = -asteroidRadius;
      y = Math.random() * canvas.height;
      vx = Math.random() * asteroidSpeed;
      vy = (Math.random() - 0.5) * asteroidSpeed;
      break;
  }

  asteroids.push({
    x,
    y,
    vx,
    vy,
    radius: asteroidRadius,
    vertices: Math.floor(Math.random() * 6 + 6),
    angle: Math.random() * Math.PI * 2,
    rotation: (Math.random() - 0.5) * 0.05,
  });
}

function drawAsteroids() {
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;

  asteroids.forEach((asteroid) => {
    asteroid.x += asteroid.vx;
    asteroid.y += asteroid.vy;
    asteroid.angle += asteroid.rotation;

    if (asteroid.x > canvas.width + asteroid.radius)
      asteroid.x = -asteroid.radius;
    if (asteroid.x < -asteroid.radius)
      asteroid.x = canvas.width + asteroid.radius;
    if (asteroid.y > canvas.height + asteroid.radius)
      asteroid.y = -asteroid.radius;
    if (asteroid.y < -asteroid.radius)
      asteroid.y = canvas.height + asteroid.radius;

    ctx.beginPath();
    for (let i = 0; i < asteroid.vertices; i++) {
      const angle = (i / asteroid.vertices) * Math.PI * 2 + asteroid.angle;
      const radius = asteroid.radius * (0.7 + Math.random() * 0.3);
      const x = asteroid.x + radius * Math.cos(angle);
      const y = asteroid.y + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  });
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

for (let i = 0; i < asteroidCount; i++) {
  createAsteroid();
}
gameLoop();
