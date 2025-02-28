import { GameElements } from "../game/GameElements.js";

export const BulletManager = {
  bullets: [],

  update() {
    const ctx = GameElements.ctx;

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];

      bullet.x += bullet.vx;
      bullet.y += bullet.vy;
      bullet.lifetime--;

      if (bullet.lifetime <= 0) {
        this.bullets.splice(i, 1);
        continue;
      }

      if (bullet.x > GameElements.canvas.width) bullet.x = 0;
      if (bullet.x < 0) bullet.x = GameElements.canvas.width;
      if (bullet.y > GameElements.canvas.height) bullet.y = 0;
      if (bullet.y < 0) bullet.y = GameElements.canvas.height;

      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  },
};
