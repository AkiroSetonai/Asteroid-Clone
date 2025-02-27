const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

canvas.width = 800;
canvas.height = 600;

const ship = {
  x: canvas.width / 2,
  y: canvas.height / 2,
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
  requestAnimationFrame(gameLoop);
}

function keyDown(e) {
  if (e.key === "ArrowLeft") {
    ship.rotation = 0.05;
  } else if (e.key === "ArrowRight") {
    ship.rotation = -0.05;
  } else if (e.key === "ArrowUp") {
    ship.thrust = true;
  }
}

function keyUp(e) {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    ship.rotation = 0;
  } else if (e.key === "ArrowUp") {
    ship.thrust = false;
  }
}

gameLoop();
