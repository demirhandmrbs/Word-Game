import { Container } from "pixi.js";
import GameScene from "./scenes/GameScene";
import WinScene  from "./scenes/WinScene";

export default class Game extends Container {

  constructor() {
    super();

    this._showGameScene();
  }

  // -------- PRIVATE --------

  _showGameScene() {
    const gameScene = new GameScene();
    gameScene.on("gameComplete", this._onGameComplete, this);
    this.addChild(gameScene);
  }

  _onGameComplete() {
    const winScene = new WinScene();
    winScene.on("installPressed", this._onInstallPressed, this);
    this.addChild(winScene);
  }

  _onInstallPressed() {
    console.log("Install button pressed");
  }
}
