import { Sprite } from "pixi.js";
import { gsap } from "gsap";

const TUTORIAL_WORD = "GOD";

export default class TutorialManager {

  constructor(tray, container) {
    this._tray      = tray;
    this._container = container;
    this._hand      = null;
    this._timeline  = null;
  }

  start(onComplete) {
    this._onComplete = onComplete;
    this._buildHand();
    gsap.delayedCall(2, () => this._runSequence());
  }

  destroy() {
    if (this._timeline) {
      this._timeline.kill();
      this._timeline = null;
    }
    if (this._hand) {
      this._hand.destroy();
      this._hand = null;
    }
  }

  // -------- PRIVATE --------

  _buildHand() {
    this._hand        = Sprite.from("hand");
    this._hand.anchor.set(0.2, 0.1);
    this._hand.width  = 60;
    this._hand.height = 80;
    this._hand.alpha  = 0;
    this._container.addChild(this._hand);
  }

  _runSequence() {
    const tiles = TUTORIAL_WORD.split("").map((char) =>
      this._tray.getTiles().find((t) => t.char === char)
    ).filter(Boolean);

    if (tiles.length < TUTORIAL_WORD.length) {
      this._complete();
      return;
    }

    const firstPos  = this._getGlobalPos(tiles[0]);
    this._hand.x    = firstPos.x;
    this._hand.y    = firstPos.y;

    this._timeline  = gsap.timeline({ onComplete: () => this._complete() });

    // El beliriyor
    this._timeline.to(this._hand, { alpha: 1, duration: 0.6 });

    // Her harfe sırayla git ve seç
    tiles.forEach((tile) => {
      const pos = this._getGlobalPos(tile);

      this._timeline.to(this._hand, {
        x        : pos.x,
        y        : pos.y,
        duration : 0.8,
        ease     : "power2.inOut",
      });

      this._timeline.add(() => this._tray.selectTile(tile));
      this._timeline.to({}, { duration: 0.3 });
    });

    // Parmak bırakıldı → kelimeyi gönder
    this._timeline.add(() => this._tray.submitSelection());

    // El kayboluyor
    this._timeline.to(this._hand, { alpha: 0, duration: 0.4, delay: 0.3 });
  }

  _getGlobalPos(tile) {
    return this._tray.toGlobal({ x: tile.x, y: tile.y });
  }

  _complete() {
    this.destroy();
    if (this._onComplete) this._onComplete();
  }
}
