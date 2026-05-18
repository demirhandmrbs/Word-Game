import * as PIXI from "pixi.js";
import { Application } from "pixi.js";
import { initAssets } from "./assets";
import { gsap } from "gsap";
import { CustomEase, PixiPlugin } from "gsap/all";
import { GAME_WIDTH, GAME_HEIGHT } from "./constants";
import Game from "./Game";

export const app = new Application({
  backgroundColor: 0x000000,
  antialias: true,
  hello: true,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
});

app.ticker.stop();
gsap.ticker.add(() => {
  app.ticker.update();
});

function resize() {
  const scale = Math.min(
    window.innerWidth  / GAME_WIDTH,
    window.innerHeight / GAME_HEIGHT
  );
  app.renderer.view.style.width  = Math.floor(GAME_WIDTH  * scale) + "px";
  app.renderer.view.style.height = Math.floor(GAME_HEIGHT * scale) + "px";
}

async function init() {
  document.body.appendChild(app.view);

  await initAssets();

  gsap.registerPlugin(PixiPlugin, CustomEase);
  PixiPlugin.registerPIXI(PIXI);

  const game = new Game();
  app.stage.addChild(game);

  resize();
  window.addEventListener("resize", resize);
}

init();
