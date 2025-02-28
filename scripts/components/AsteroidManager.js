import { GameElements } from "../game/GameElements.js";
import { Config } from "../config.js";

export const AsteroidManager = {
  asteroids: [],
  asteroidSpeed: 1.5,
  asteroidRadius: 50,

  init() {
    this.createInitialAsteroids();
  },

  createInitialAsteroids() {
    for (let i = 0; i < 5; i++) {
      this.createAsteroid();
    }
  },

  createAsteroid() {
    const side = Math.floor(Math.random() * 4);
    let x, y, vx, vy;

    switch (side) {
      case 0:
        x = Math.random() * GameElements.canvas.width;
        y = -this.asteroidRadius;
        vx = (Math.random() - 0.5) * this.asteroidSpeed;
        vy = Math.random() * this.asteroidSpeed;
        break;
      case 1:
        x = GameElements.canvas.width + this.asteroidRadius;
        y = Math.random() * GameElements.canvas.height;
        vx = -Math.random() * this.asteroidSpeed;
        vy = (Math.random() - 0.5) * this.asteroidSpeed;
        break;
      case 2:
        x = Math.random() * GameElements.canvas.width;
        y = GameElements.canvas.height + this.asteroidRadius;
        vx = (Math.random() - 0.5) * this.asteroidSpeed;
        vy = -Math.random() * this.asteroidSpeed;
        break;
      case 3:
        x = -this.asteroidRadius;
        y = Math.random() * GameElements.canvas.height;
        vx = Math.random() * this.asteroidSpeed;
        vy = (Math.random() - 0.5) * this.asteroidSpeed;
        break;
    }

    this.asteroids.push({
      x,
      y,
      vx,
      vy,
      size: 3,
      radius: this.asteroidRadius,
      vertices: Math.floor(Math.random() * 6 + 6),
      angle: Math.random() * Math.PI * 2,
      rotation: (Math.random() - 0.5) * 0.02,
    });
  },

  update() {
    const ctx = GameElements.ctx;

    this.asteroids.forEach((asteroid) => {
      asteroid.x += asteroid.vx;
      asteroid.y += asteroid.vy;
      asteroid.angle += asteroid.rotation;

      if (asteroid.x > GameElements.canvas.width + asteroid.radius)
        asteroid.x = -asteroid.radius;
      if (asteroid.x < -asteroid.radius)
        asteroid.x = GameElements.canvas.width + asteroid.radius;
      if (asteroid.y > GameElements.canvas.height + asteroid.radius)
        asteroid.y = -asteroid.radius;
      if (asteroid.y < -asteroid.radius)
        asteroid.y = GameElements.canvas.height + asteroid.radius;

      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
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
  },
};
