import { Container, Sprite, Text, TextStyle } from "pixi.js";
import { CELL_SIZE } from "../constants";

export default class GridCell extends Container {

  constructor(row, col) {
    super();

    this._row      = row;
    this._col      = col;
    this._char     = null;
    this._revealed = false;

    this._buildBackground();
    this._buildLabel();
  }

  reveal(char) {
    this._char          = char;
    this._revealed      = true;
    this._label.text    = char;
    this._label.visible = true;
    this._bg.tint       = 0xFF8800;
  }

  get isRevealed() { return this._revealed; }
  get row()        { return this._row; }
  get col()        { return this._col; }

  // -------- PRIVATE --------

  _buildBackground() {
    this._bg = Sprite.from("rect");
    this._bg.anchor.set(0.5);
    this._bg.width  = CELL_SIZE;
    this._bg.height = CELL_SIZE;
    this._bg.tint   = 0xfffcea;
    this.addChild(this._bg);
  }

  _buildLabel() {
    const style = new TextStyle({
      fontFamily : "Arial",
      fontSize   : 40,
      fontWeight : "bold",
      fill       : 0xFFFFFF,
    });

    this._label         = new Text("", style);
    this._label.anchor.set(0.5);
    this._label.visible = false;
    this.addChild(this._label);
  }
}
