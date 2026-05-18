import { gsap } from "gsap";

export default class Animations {

  // Harf tile'ı seçilince küçük bir zıplama efekti
  static tileSelect(tile) {
    gsap.killTweensOf(tile); // Bu tile üzerinde çalışan varsa önceki animasyonu iptal etmemize yarıyor
    gsap.fromTo(
      tile,
      { pixi: { scale: 1 } },
      { pixi: { scale: 1.2 }, duration: 0.1, yoyo: true, repeat: 1, ease: "power1.out" }
    );
  }

  // Kelime tamamlanınca hücreleri sırayla parlat
  static revealWord(cells) {
    cells.forEach((cell, index) => {
      gsap.fromTo(
        cell,
        { pixi: { scale: 0.5, alpha: 0 } },
        {
          pixi      : { scale: 1, alpha: 1 },
          duration  : 0.3,
          delay     : index * 0.08,  // Kademeli animasyon efekti için
          ease      : "back.out(1.7)",
        }
      );
    });
  }

  // Yanlış kelime girilince tray'i salla
  static wrongWord(tray) {
    gsap.killTweensOf(tray);
    gsap.fromTo(
      tray,
      { pixi: { x: tray.x } },
      {
        pixi     : { x: tray.x + 10 },
        duration : 0.05,
        repeat   : 5,
        yoyo     : true,
        ease     : "power1.inOut",
      }
    );
  }

  // Oyun bitince tüm sahneyi yukarı uçur
  static gameWin(scene, onComplete) {
    gsap.to(scene, {
      pixi      : { alpha: 0, y: scene.y - 40 },
      duration  : 0.5,
      ease      : "power2.in",
      onComplete,
    });
  }

  // Yeni sahneyi aşağıdan kaydırarak göster
  static sceneEnter(scene) {
    gsap.fromTo(
      scene,
      { pixi: { alpha: 0, y: scene.y + 60 } },
      { pixi: { alpha: 1, y: scene.y }, duration: 0.5, ease: "power2.out" }
    );
  }
}
