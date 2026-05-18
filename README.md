# Kelime Oyunu — Playable Ad

PixiJS + GSAP ile yapılmış kelime bulmaca oyunu. Kullanıcı dairesel tile'lardan harf seçerek kelime oluşturuyor, tüm kelimeleri bulunca kazanıyor.

---

## Kurulum

```bash
npm install
npm start        # localhost:8008
npm run build    # dist/ klasörüne build
```

---

## Kullanılan Teknolojiler

- **PixiJS v7** — 2D WebGL render motoru
- **GSAP v3** — Animasyon kütüphanesi
- **Webpack 5** — Bundler

---

## Klasör Yapısı

```
src/
├── index.js              # Giriş noktası
├── Game.js               # Sahne yönetimi
├── assets.js             # Asset yükleme
├── constants.js          # Sabit değerler ve level datası
├── manifest.json         # Asset bundle tanımları
├── components/
│   ├── CrosswordGrid.js  # Grid container
│   ├── GridCell.js       # Tek hücre
│   ├── LetterTray.js     # Harf tepsisi (drag mekaniği)
│   ├── LetterTile.js     # Tek harf tile'ı
│   └── ShuffleButton.js  # Karıştır butonu
├── managers/
│   ├── LevelParser.js    # String → obje parse
│   ├── WordChecker.js    # Kelime doğrulama
│   └── TutorialManager.js# Otomatik tutorial
├── scenes/
│   ├── GameScene.js      # Ana oyun ekranı
│   └── WinScene.js       # Kazanma ekranı
└── utils/
    └── Animations.js     # GSAP animasyonları
```

## Oyun Akışı

```
Uygulama başlar
  → Asset'ler yüklenir
  → GameScene açılır
  → 2 saniye sonra tutorial başlar

Kullanıcı tile'lara sürükler
  → Geçersiz kelime → sallama animasyonu
  → Geçerli kelime  → hücre açılır
  → Tüm kelimeler   → WinScene açılır

"PLAY NOW" butonuna basar
  → installPressed eventi
```

## Event Sistemi

```
ShuffleButton  → shufflePressed    → LetterTray.shuffle()
LetterTray     → userInteracted    → TutorialManager.destroy()
LetterTray     → selectionChanged  → GameScene (kelime kontrolü)
GameScene      → gameComplete      → Game (WinScene aç)
WinScene       → installPressed    → Game (CTA)
```
