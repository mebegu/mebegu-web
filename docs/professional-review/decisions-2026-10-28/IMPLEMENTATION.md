# İlk iş grubu: A01 ve Q01

Amaç: seçilen sahne kompozisyonu ve CV metni korunurken Contact/Profile çakışmasını kaldırmak; gerekli bölüm bulunmadığında oracle'ın PASS verememesi.

## Değişiklik

- Contact/Profile aynı native details grubunda. Birini açmak diğerini kapatıyor; JavaScript kapalıyken de denendi.
- Escape açık paneli kapatıp summary'ye odak veriyor. Dış pointer tıklaması paneli kapatıyor, tıklanan hedefin odağını ele geçirmiyor.
- Print sırasında grup adı geçici kaldırılıyor; iletişim ve tam özet basılıyor, ardından isimler ve önceki açık/kapalı durumlar geri yükleniyor.
- Ortak oracle scope doğrulaması: gerekli seçici sıfır veya birden çok öğe eşleştirirse FAIL. Boş kontrol listesi de FAIL.
- Geniş CV oracle'ı gerçek `#project-details` hedefini ve iki İngilizce scope'u doğruluyor; print chrome kontrolü de başarısız çıkışa etki ediyor.
- `test:professional:browser` mevcut harici Playwright/Edge ile tekrar çalıştırılabilir. Harici araç belirtilmezse test SKIP olur.

## Kanıt ve durum

`pnpm validate`: 34 test başarılı, Astro/build ve çıktı kontrolleri başarılı. Mevcut pnpm metadata uyarısı ve release-game dosyasındaki altı eski hint devam ediyor; bağımlılık değiştirilmedi. Son eklenen oracle guard'ları ayrıca altı unit test ve gerçek tarayıcı negatif senaryosuyla doğrulandı.

Gerçek Edge regresyonu: EN/TR × 1280, 768, 390, 360px; karşılıklı kapanma, klavye, Escape/focus, dış tıklama, JS-off native grup ve print state kontrolü geçti. Lean oracle sekiz görünümde PASS verdi. Geniş oracle 390px + A4 için PASS; bilerek eksik content selector verilince beklenen hata/başarısız çıkış üretildi.

A4 çıktısı JS açık ve kapalı halde iki dolu sayfa. İletişim ve Summary metni ikisinde de var. JS açık çıktının iki sayfası görsel olarak incelendi. Kaynak metindeki “sonraki sayfalarda” ifadesi S02 kapsamında hâlâ açık.

Yalnız kontrol edilen panel/okunabilirlik durumları için ajan görsel değerlendirmesi PASS. Bu, bekleyen wireframe'lere veya genel tasarıma owner onayı değildir. A02 filtre çelişkisi henüz değiştirilmedi. Q01'in buna ilişkin regresyonu D02/A02 sonrasına bırakıldı.

Yerel çalışma kanıtları: `.local/professional-panels/`, `.local/first-group-oracle/`, `.local/extended-oracle-valid/`, `.local/extended-oracle-missing/`. Özel kaynak veya müşteri eşlemesi rapora kopyalanmadı. Uygulama commit/push edilmedi.
