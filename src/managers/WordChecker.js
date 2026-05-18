export default class WordChecker {

  constructor(wordDataList) {
    this._wordDataList  = wordDataList;
    this._foundWords    = new Set();
  }

  // Seçilen harfler geçerli ve daha önce bulunmamış bir kelime mi?
  isValidWord(selectedLetters) {
    const word = selectedLetters.join("");
    const exists = this._wordDataList.some((wordData) => wordData.word === word);
    const alreadyFound = this._foundWords.has(word);

    return exists && !alreadyFound;
  }

  // Kelimeyi bulundu olarak işaretle
  markAsFound(word) {
    this._foundWords.add(word);
  }

  // Tüm kelimeler bulundu mu?
  isGameComplete() {
    return this._foundWords.size === this._wordDataList.length;
  }

  // Verilen kelimenin WordData'sını döndürür
  getWordData(word) {
    return this._wordDataList.find((wordData) => wordData.word === word) ?? null;
  }

  get foundCount() {
    return this._foundWords.size;
  }

  get totalCount() {
    return this._wordDataList.length;
  }
}
