import { Container, Circle, Graphics } from "pixi.js";
import { gsap } from "gsap";
import LetterTile from "./LetterTile";
import ShuffleButton from "./ShuffleButton";
import { TILE_RADIUS, GAME_WIDTH, GAME_HEIGHT } from "../constants";

const CIRCULAR_RADIUS = TILE_RADIUS * 2.5;
const LINE_COLOR      = 0xFF8800;
const LINE_WIDTH      = 10;

export default class LetterTray extends Container {

  constructor(letters) {
    super();

    this._letters       = letters;
    this._tiles         = [];
    this._selectedTiles = [];
    this._isDragging    = false;

    this._buildTrayBackground();
    this._buildLineGraphics();
    this._buildTiles();
    this._buildShuffleButton();
    this._enableDragInteraction();
    this._centerOnScreen();
  }

  // -------- PUBLIC API --------

  get selectedLetters() {
    return this._selectedTiles.map((tile) => tile.char);
  }

  getTiles() {
    return this._tiles;
  }

  selectTile(tile) {
    if (tile.isSelected) return;
    this._selectedTiles.push(tile);
    tile.select();
    this._drawLines({ x: tile.x, y: tile.y });
  }

  submitSelection() {
    this.emit("selectionChanged", this.selectedLetters);
  }

  setInteractive(enabled) {
    this.eventMode = enabled ? "static" : "none";
  }

  resetSelection() {
    for (const tile of this._selectedTiles) {
      tile.deselect();
    }
    this._selectedTiles = [];
    this._lineGraphics.clear();
  }

  shuffle() {
    this.resetSelection();

    const indices = this._letters.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const count = this._letters.length;
    indices.forEach((oldIndex, newIndex) => {
      const angle   = ((newIndex / count) * Math.PI * 2) - Math.PI / 2;
      const targetX = Math.cos(angle) * CIRCULAR_RADIUS;
      const targetY = Math.sin(angle) * CIRCULAR_RADIUS;

      gsap.to(this._tiles[oldIndex], {
        pixi     : { x: targetX, y: targetY },
        duration : 0.4,
        ease     : "back.out(1.7)",
      });
    });

    this._tiles   = indices.map((i) => this._tiles[i]);
    this._letters = indices.map((i) => this._letters[i]);
  }

  // -------- PRIVATE --------

  _buildTrayBackground() {
    const bg = new Graphics();
    bg.beginFill(0xffffff, 0.25);
    bg.drawCircle(0, 0, CIRCULAR_RADIUS + TILE_RADIUS);
    bg.endFill();
    this.addChild(bg);
  }

  _buildLineGraphics() {
    this._lineGraphics = new Graphics();
    this.addChild(this._lineGraphics);
  }

  _buildTiles() {
    const count = this._letters.length;

    this._letters.forEach((letter, i) => {
      const angle = ((i / count) * Math.PI * 2) - Math.PI / 2;
      const tile  = new LetterTile(letter);
      tile.x      = Math.cos(angle) * CIRCULAR_RADIUS;
      tile.y      = Math.sin(angle) * CIRCULAR_RADIUS;
      this._tiles.push(tile);
      this.addChild(tile);
    });
  }

  _buildShuffleButton() {
    this._shuffleBtn   = new ShuffleButton();
    this._shuffleBtn.x = 0;
    this._shuffleBtn.y = 0;
    this._shuffleBtn.on("shufflePressed", this._onShufflePressed, this);
    this.addChild(this._shuffleBtn);
  }

  _enableDragInteraction() {
    this.eventMode = "static";
    this.hitArea   = new Circle(0, 0, CIRCULAR_RADIUS + TILE_RADIUS * 1.5);

    this.on("pointerdown",      this._onPointerDown, this);
    this.on("pointermove",      this._onPointerMove, this);
    this.on("pointerup",        this._onPointerUp,   this);
    this.on("pointerupoutside", this._onPointerUp,   this);
  }

  _onPointerDown(event) {
    this.emit("userInteracted");
    this._isDragging = true;
    this._checkTileHit(event.global);
    this._drawLines(this.toLocal(event.global));
  }

  _onPointerMove(event) {
    if (!this._isDragging) return;
    const localPoint = this.toLocal(event.global);
    this._checkTileHit(event.global);
    this._drawLines(localPoint);
  }

  _onPointerUp() {
    if (!this._isDragging) return;
    this._isDragging = false;
    this.emit("selectionChanged", this.selectedLetters);
  }

  _checkTileHit(globalPoint) {
    const localPoint = this.toLocal(globalPoint);

    for (const tile of this._tiles) {
      if (tile.isSelected) continue;

      const dx   = localPoint.x - tile.x;
      const dy   = localPoint.y - tile.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= TILE_RADIUS) {
        this._selectedTiles.push(tile);
        tile.select();
        break;
      }
    }
  }

  _drawLines(currentLocalPoint) {
    this._lineGraphics.clear();

    if (this._selectedTiles.length === 0) return;

    this._lineGraphics.lineStyle(LINE_WIDTH, LINE_COLOR, 1);

    const first = this._selectedTiles[0];
    this._lineGraphics.moveTo(first.x, first.y);

    for (let i = 1; i < this._selectedTiles.length; i++) {
      this._lineGraphics.lineTo(this._selectedTiles[i].x, this._selectedTiles[i].y);
    }

    if (this._isDragging && currentLocalPoint) {
      this._lineGraphics.lineTo(currentLocalPoint.x, currentLocalPoint.y);
    }
  }

  _centerOnScreen() {
    this.x = GAME_WIDTH  * 0.5;
    this.y = GAME_HEIGHT * 0.78;
  }

  _onShufflePressed() {
    this.shuffle();
  }
}
