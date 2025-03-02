import { Config } from "../config.js";
import { Ship } from "../components/Ship.js";
import { LifeManager } from "../components/LifeManager.js";

export const GameElements = {
  canvas: null,
  ctx: null,

  init() {
    this.canvas = document.getElementById(Config.CANVAS_ID);
    this.ctx = this.canvas.getContext("2d");
    this.setupEventListeners();
    this.resizeCanvas();
  },

  setupEventListeners() {
    window.addEventListener("resize", () => this.resizeCanvas());
    document.addEventListener("keydown", (e) => Ship.handleKeyDown(e));
    document.addEventListener("keyup", (e) => Ship.handleKeyUp(e));
  },

  resizeCanvas() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width / height > Config.ASPECT_RATIO) {
      this.canvas.width = height * Config.ASPECT_RATIO;
      this.canvas.height = height;
    } else {
      this.canvas.width = width;
      this.canvas.height = width / Config.ASPECT_RATIO;
    }

    this.canvas.style.position = "fixed";
    this.canvas.style.left = (window.innerWidth - this.canvas.width) / 2 + "px";
    this.canvas.style.top =
      (window.innerHeight - this.canvas.height) / 2 + "px";

    Ship.resetPosition(this.canvas);
  },
};
