import { GameElements } from "./GameElements.js";
import { Ship } from "../components/Ship.js";
import { BulletManager } from "../components/BulletManager.js";
import { AsteroidManager } from "../components/AsteroidManager.js";
import { Config } from "../config.js";
import { Helpers } from "../utils/helpers.js";
import { ScoreManager } from "../components/ScoreManager.js";

function createFragment(parentAsteroid, newSize) {
  return {
    x: parentAsteroid.x,
    y: parentAsteroid.y,
    vx: parentAsteroid.vx + (Math.random() - 0.5) * 2,
    vy: parentAsteroid.vy + (Math.random() - 0.5) * 2,
    size: newSize,
    radius: parentAsteroid.radius * 0.5,
    vertices: parentAsteroid.vertices,
    angle: Math.random() * Math.PI * 2,
    rotation: (Math.random() - 0.5) * 0.02,
  };
}

export const GameSystem = {
  init() {
    GameElements.init();
    Ship.init();
    AsteroidManager.init();
    ScoreManager.init();
    this.loop();
  },

  loop() {
    GameElements.ctx.fillStyle = Config.BACKGROUND;
    GameElements.ctx.fillRect(
      0,
      0,
      GameElements.canvas.width,
      GameElements.canvas.height
    );

    BulletManager.bullets.forEach((bullet, bulletIndex) => {
      AsteroidManager.asteroids.forEach((asteroid, asteroidIndex) => {
        if (Helpers.checkCollision(bullet, asteroid)) {
          BulletManager.bullets.splice(bulletIndex, 1);

          ScoreManager.addPoints(Config.POINTS_PER_ASTEROID);

          if (asteroid.size > 1) {
            let newSize = asteroid.size - 1;
            AsteroidManager.asteroids.push(createFragment(asteroid, newSize));
            AsteroidManager.asteroids.push(createFragment(asteroid, newSize));
          }

          AsteroidManager.asteroids.splice(asteroidIndex, 1);
        }
      });
    });

    AsteroidManager.asteroids.forEach((asteroid) => {
      if (Helpers.checkCollision(Ship.instance, asteroid)) {
        console.log("Colisão da nave com um asteroide!");
      }
    });

    ScoreManager.draw();
    Ship.update();
    Ship.draw();
    BulletManager.update();
    AsteroidManager.update();

    requestAnimationFrame(() => this.loop());
  },
};
