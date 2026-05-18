import { Container, Sprite, Text, TextStyle } from "pixi.js";
import { gsap } from "gsap";
import { GAME_WIDTH, GAME_HEIGHT } from "../constants";
import Animations from "../utils/Animations";

export default class WinScene extends Container {

  constructor() {
    super();

    this._buildBackground();
    this._buildWinText();
    this._buildInstallButton();

    Animations.sceneEnter(this);
  }

  // -------- PRIVATE --------

  _buildBackground() {
    const bg  = Sprite.from("bg");
    bg.width  = GAME_WIDTH;
    bg.height = GAME_HEIGHT;
    this.addChild(bg);
  }

  _buildWinText() {
    const style = new TextStyle({
      fontFamily        : "Arial",
      fontSize          : 52,
      fontWeight        : "bold",
      fill              : 0xffffff,
      dropShadow        : true,
      dropShadowDistance: 4,
      dropShadowAlpha   : 0.6,
    });

    const text  = new Text("You Win!", style);
    text.anchor.set(0.5);
    text.x = GAME_WIDTH  * 0.5;
    text.y = GAME_HEIGHT * 0.35;
    this.addChild(text);
  }

  _buildInstallButton() {
    this._ctaContainer   = new Container();
    this._ctaContainer.x = GAME_WIDTH  * 0.5;
    this._ctaContainer.y = GAME_HEIGHT * 0.6;
    this.addChild(this._ctaContainer);

    const btn    = Sprite.from("install");
    btn.anchor.set(0.5);
    btn.width    = GAME_WIDTH  * 0.7;
    btn.height   = GAME_WIDTH  * 0.7 * 0.35;
    btn.eventMode = "static";
    btn.cursor    = "pointer";
    btn.on("pointerdown", this._onInstallPressed, this);
    this._ctaContainer.addChild(btn);

    const labelStyle = new TextStyle({
      fontFamily : "Arial",
      fontSize   : 40,
      fontWeight : "bold",
      fill       : 0xffffff,
    });

    const label  = new Text("PLAY NOW!", labelStyle);
    label.anchor.set(0.5);
    this._ctaContainer.addChild(label);

    gsap.to(this._ctaContainer, {
      pixi     : { scale: 1.08 },
      duration : 0.55,
      repeat   : -1,
      yoyo     : true,
      ease     : "sine.inOut",
    });
  }

  _onInstallPressed() {
    this.emit("installPressed");
  }
}
