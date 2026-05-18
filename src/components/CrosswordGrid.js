import { Container } from "pixi.js";
import GridCell from "./GridCell";
import { CELL_SIZE, CELL_GAP, GAME_WIDTH, GAME_HEIGHT } from "../constants";

export default class CrosswordGrid extends Container {

  constructor(wordDataList, gridSize) {
    super();

    this._wordDataList = wordDataList;
    this._gridSize     = gridSize;
    this._cells        = {};

    this._buildGrid();
    this._centerOnScreen();
  }

  // Koordinata göre hücreyi döndürür
  getCell(row, col) {
    return this._cells[`${row}_${col}`] ?? null;
  }

  // Bir kelimenin tüm hücrelerini döndürür
  getCellsForWord(wordData) {
    return wordData.cells.map((cell) => this.getCell(cell.row, cell.col));
  }

  // -------- PRIVATE --------

  _buildGrid() {
    const occupiedCoords = this._getOccupiedCoords();

    for (const key of occupiedCoords) {
      const [row, col] = key.split("_").map(Number);

      const cell = new GridCell(row, col);
      cell.x     = col * (CELL_SIZE + CELL_GAP);
      cell.y     = row * (CELL_SIZE + CELL_GAP);

      this._cells[key] = cell;
      this.addChild(cell);
    }
  }

  // Hangi koordinatların dolu olduğunu hesaplar (Set ile tekrarsız)
  _getOccupiedCoords() {
    const coords = new Set();

    for (const wordData of this._wordDataList) {
      for (const cell of wordData.cells) {
        coords.add(`${cell.row}_${cell.col}`);
      }
    }

    return coords;
  }

  // Grid'i ekranın ortasına (yatay) ve üst-orta bölgesine (dikey) taşır
  _centerOnScreen() {
    const totalWidth  = this._gridSize.cols * (CELL_SIZE + CELL_GAP) - CELL_GAP;
    const totalHeight = this._gridSize.rows * (CELL_SIZE + CELL_GAP) - CELL_GAP;

    this.x = (GAME_WIDTH  - totalWidth)  / 2 + CELL_SIZE / 2;
    this.y = (GAME_HEIGHT - totalHeight) / 2 - CELL_SIZE;
  }
}
