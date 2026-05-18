import { Container, Sprite } from "pixi.js";

export default class ShuffleButton extends Container {

  constructor() {
    super();

    this._buildButton();
    this._enableInteraction();
  }

  // -------- PRIVATE --------

  _buildButton() {
    this._icon = Sprite.from("shuffle");
    this._icon.anchor.set(0.5);
    this._icon.width  = 50;
    this._icon.height = 50;
    this._icon.alpha  = 0.75;
    this.addChild(this._icon);
  }

  _enableInteraction() {
    this.eventMode = "static";
    this.cursor    = "pointer";
    this.on("pointerdown", this._onPointerDown, this);
  }

  _onPointerDown() {
    this.emit("shufflePressed");
  }
}
