import { Config } from "../config.js";
import { GameElements } from "../game/GameElements.js";

export const ScoreManager = {
  score: 0,

  init() {
    this.scroe = 0;
  },
  addPoints(points) {
    this.score += points;
  },

  draw() {
    const ctx = GameElements.ctx;
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Points: ${this.score}`, 20, 30);
  },
};
