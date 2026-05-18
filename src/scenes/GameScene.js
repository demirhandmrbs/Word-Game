import { Container, Sprite } from "pixi.js";
import { GAME_WIDTH, GAME_HEIGHT, lvlLetters, lvlWords } from "../constants";
import LevelParser      from "../managers/LevelParser";
import WordChecker      from "../managers/WordChecker";
import TutorialManager  from "../managers/TutorialManager";
import CrosswordGrid    from "../components/CrosswordGrid";
import LetterTray       from "../components/LetterTray";
import Animations       from "../utils/Animations";

export default class GameScene extends Container {

  constructor() {
    super();

    this._wordDataList = LevelParser.parseWords(lvlWords);
    this._letters      = LevelParser.parseLetters(lvlLetters);
    this._gridSize     = LevelParser.parseGridSize(this._wordDataList);
    this._checker      = new WordChecker(this._wordDataList);
    this._tutorial     = null;

    this._buildBackground();
    this._buildGrid();
    this._buildTray();
    this._startTutorial();
  }

  // -------- PRIVATE --------

  _buildBackground() {
    const bg    = Sprite.from("bg");
    bg.width    = GAME_WIDTH;
    bg.height   = GAME_HEIGHT;
    this.addChild(bg);
  }

  _buildGrid() {
    this._grid = new CrosswordGrid(this._wordDataList, this._gridSize);
    this.addChild(this._grid);
  }

  _buildTray() {
    this._tray = new LetterTray(this._letters);
    this._tray.on("selectionChanged", this._onSelectionChanged, this);
    this._tray.on("userInteracted",   this._onUserInteracted,   this);
    this.addChild(this._tray);
  }

  _startTutorial() {
    this._tutorial = new TutorialManager(this._tray, this);
    this._tutorial.start(() => {
      this._tutorial = null;
    });
  }

  _onUserInteracted() {
    if (!this._tutorial) return;
    this._tutorial.destroy();
    this._tutorial = null;
    this._tray.resetSelection();
  }

  _onSelectionChanged(selectedLetters) {
    const word = selectedLetters.join("");

    if (word.length < 2) {
      this._tray.resetSelection();
      return;
    }

    if (!this._checker.isValidWord(selectedLetters)) {
      Animations.wrongWord(this._tray);
      this._tray.resetSelection();
      return;
    }

    const wordData = this._checker.getWordData(word);
    this._checker.markAsFound(word);

    const cells = this._grid.getCellsForWord(wordData);
    wordData.cells.forEach((cellData, i) => cells[i].reveal(cellData.char));
    Animations.revealWord(cells);

    this._tray.resetSelection();

    if (this._checker.isGameComplete()) {
      this._onGameComplete();
    }
  }

  _onGameComplete() {
    Animations.gameWin(this, () => {
      this.emit("gameComplete");
    });
  }
}
