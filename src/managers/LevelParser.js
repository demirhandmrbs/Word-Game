export default class LevelParser {

  // "G,O,D,L" → ["G", "O", "D", "L"]
  static parseLetters(lvlLetters) {
    return lvlLetters.split(",").map((letter) => letter.trim().toUpperCase());
  }

  // "0,0,GOLD,H|0,0,GOD,V|2,0,DOG,H|0,2,LOG,V" → WordData[]
  static parseWords(lvlWords) {
    return lvlWords.split("|").map((entry) => LevelParser._parseWordEntry(entry));
  }

  // Tüm kelimelerin kapladığı grid boyutunu hesaplar → { rows, cols }
  static parseGridSize(wordDataList) {
    let maxRow = 0;
    let maxCol = 0;

    for (const wordData of wordDataList) {
      for (const cell of wordData.cells) {
        if (cell.row > maxRow) maxRow = cell.row;
        if (cell.col > maxCol) maxCol = cell.col;
      }
    }

    return { rows: maxRow + 1, cols: maxCol + 1 };
  }

  // -------- PRIVATE --------

  // "0,0,GOLD,H" → { row, col, word, direction, cells }
  static _parseWordEntry(entry) {
    const [rowStr, colStr, word, direction] = entry.split(",");

    const row       = parseInt(rowStr, 10);
    const col       = parseInt(colStr, 10);
    const cells     = LevelParser._buildCells(row, col, word, direction);

    return { row, col, word, direction, cells };
  }

  // Her harfin grid koordinatını üretir
  // GOLD, H, (0,0) → [{row:0,col:0,char:"G"}, {row:0,col:1,char:"O"}, ...]
  static _buildCells(startRow, startCol, word, direction) {
    return word.split("").map((char, index) => ({
      char,
      row: direction === "V" ? startRow + index : startRow,
      col: direction === "H" ? startCol + index : startCol,
    }));
  }
}
