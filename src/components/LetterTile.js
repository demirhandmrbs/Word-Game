import { Container, Sprite, Text, TextStyle } from "pixi.js";
import { TILE_RADIUS } from "../constants";

export default class LetterTile extends Container {

  constructor(char) {
    super();

    this._char     = char;
    this._selected = false;

    this._buildBackground();
    this._buildLabel();
  }

  get char()       { return this._char; }
  get isSelected() { return this._selected; }

  select() {
    this._selected         = true;
    this._bg.visible       = true;
    this._bg.tint          = 0xFF8800;
    this._label.style.fill = 0xffffff;
  }

  deselect() {
    this._selected         = false;
    this._bg.visible       = false;
    this._label.style.fill = 0xFF8800;
  }

  // -------- PRIVATE --------

  _buildBackground() {
    this._bg         = Sprite.from("circle");
    this._bg.anchor.set(0.5);
    this._bg.width   = TILE_RADIUS * 2;
    this._bg.height  = TILE_RADIUS * 2;
    this._bg.visible = false;
    this.addChild(this._bg);
  }

  _buildLabel() {
    const style = new TextStyle({
      fontFamily : "Arial",
      fontSize   : 45,
      fontWeight : "bold",
      fill       : 0xFF8800,
    });

    this._label = new Text(this._char, style);
    this._label.anchor.set(0.5);
    this.addChild(this._label);
  }
}
