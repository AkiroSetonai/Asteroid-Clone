import { Config } from "../config.js";
import { GameElements } from "../game/GameElements.js";
import { BulletManager } from "./BulletManager.js";

export const Ship = {
  instance: null,
  bullets: [],
  lastFire: 0,

  init() {
    this.instance = {
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
    this.resetPosition(GameElements.canvas);
  },

  resetPosition(canvas) {
    if (this.instance) {
      this.instance.x = canvas.width / 2;
      this.instance.y = canvas.height / 2;
    }
  },

  handleKeyDown(e) {
    if (e.key === "ArrowLeft") this.instance.rotation = 0.05;
    if (e.key === "ArrowRight") this.instance.rotation = -0.05;
    if (e.key === "ArrowUp") this.instance.thrust = true;
    if (e.code === "Space") this.shoot();
  },

  handleKeyUp(e) {
    if (["ArrowLeft", "ArrowRight"].includes(e.key)) this.instance.rotation = 0;
    if (e.key === "ArrowUp") this.instance.thrust = false;
  },

  draw() {
    const ctx = GameElements.ctx;
    const s = this.instance;

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(
      s.x + s.radius * Math.cos(s.angle),
      s.y - s.radius * Math.sin(s.angle)
    );
    ctx.lineTo(
      s.x - s.radius * (Math.cos(s.angle) + Math.sin(s.angle)),
      s.y + s.radius * (Math.sin(s.angle) - Math.cos(s.angle))
    );
    ctx.lineTo(
      s.x - s.radius * (Math.cos(s.angle) - Math.sin(s.angle)),
      s.y + s.radius * (Math.sin(s.angle) + Math.cos(s.angle))
    );
    ctx.closePath();
    ctx.stroke();

    if (s.thrust) {
      ctx.beginPath();
      ctx.moveTo(
        s.x - s.radius * (Math.cos(s.angle) * 0.7),
        s.y + s.radius * (Math.sin(s.angle) * 0.7)
      );
      ctx.lineTo(
        s.x - s.radius * (Math.cos(s.angle) * 1.5),
        s.y + s.radius * (Math.sin(s.angle) * 1.5)
      );
      ctx.stroke();
    }
  },

  update() {
    const s = this.instance;

    s.angle += s.rotation;
    s.x += s.vx;
    s.y += s.vy;

    s.vx *= 1 - s.friction;
    s.vy *= 1 - s.friction;

    if (s.x > GameElements.canvas.width) s.x = 0;
    if (s.x < 0) s.x = GameElements.canvas.width;
    if (s.y > GameElements.canvas.height) s.y = 0;
    if (s.y < 0) s.y = GameElements.canvas.height;

    if (s.thrust) {
      s.vx += Math.cos(s.angle) * s.speed;
      s.vy -= Math.sin(s.angle) * s.speed;
      const speed = Math.sqrt(s.vx ** 2 + s.vy ** 2);
      if (speed > s.maxSpeed) {
        s.vx = (s.vx / speed) * s.maxSpeed;
        s.vy = (s.vy / speed) * s.maxSpeed;
      }
    }
  },

  shoot() {
    const now = Date.now();
    if (now - this.lastFire > Config.FIRE_DELAY) {
      const s = this.instance;
      BulletManager.bullets.push({
        x: s.x + Math.cos(s.angle) * (s.radius + 5),
        y: s.y - Math.sin(s.angle) * (s.radius + 5),
        vx: Math.cos(s.angle) * 7,
        vy: -Math.sin(s.angle) * 7,
        radius: 2,
        lifetime: 60,
      });
      this.lastFire = now;
    }
  },
};
