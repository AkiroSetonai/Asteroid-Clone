import { Config } from "../config.js";
import { GameElements } from "../game/GameElements.js";

export const LifeManager = {
  lives: Config.INITIAL_LIVES,

  init() {
    this.lives = Config.INITIAL_LIVES;
  },

  loseLife() {
    this.lives--;
  },

  draw() {
    const ctx = GameElements.ctx;
    ctx.fillStyle = Config.LIFE_COLOR;
    ctx.font = "20px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`Life: ${this.lives}`, GameElements.canvas.width - 20, 30);
  },

  isGameOver() {
    return this.lives <= 0;
  },
};
