# Professional değerlendirmesi ve tartışma gündemi

28 Ekim 2026. Tek ajan, sırayla tasarım → recruiter → tester/güvenilirlik. Uygulama değiştirilmedi, commit/push yapılmadı. Yerel production build incelendi; canlı sunucunun aynı sürümde olduğu doğrulanmadı.

- [Tasarım ve recruiter raporu](01-DESIGN-RECRUITER.md)
- [İşlev ve güvenilirlik raporu](02-RELIABILITY.md)
- [Action items ve görevler](TASKS.md)
- [Masaüstü](evidence/design-1280.png) · [mobil](evidence/design-390.png) · [panel çakışması](evidence/overlapping-panels.png)

## Ortak sonuç

İçerik, görünür olduğunda güçlü bir senior backend/cloud profili ortaya koyuyor. Tasarım kişisel ve hatırlanabilir. Temel sorun, o kanıta ulaşmanın gereğinden fazla keşif istemesi; en somut teknik kusur ise etkileşim durumlarının birbirini hesaba katmaması. Takımyıldızı korunarak ikisi de düzeltilebilir.

## Birlikte karar verilecekler

| Sıra | Karar | Neden |
| --- | --- | --- |
| 1 | İlk ekranda rol dışında hangi mevcut üç gerçek görünmeli? | Deneyim, konum ve liderlik kanıtı bugün farklı açma/kaydırma adımlarında. Yeni kısa CV metni gerekiyorsa kaynak alanı gerekir. |
| 2 | Contact/Profile normal akışta mı, karşılıklı kapanan panel olarak mı kalmalı? | Şu anda birbirini örtüyorlar. Seçim hem görünümü hem kullanım modelini belirler. |
| 3 | Harita bir filtre mi, proje seçici mi, ikisi birlikte mi? | Etiketler benzer, filtre ve seçim çelişebiliyor. Görsel durumlar işlevi açıklamalı. |
| 4 | Tam proje kanıtına en kısa yol ne olmalı? | Ayrıntılı liste mobilde yaklaşık 5.162px aşağıda; mevcut harita kestirmeleri var, ancak keşfedilmeleri gerekiyor. Bölüm erişimi ile içerik sırası birlikte düşünülebilir. |
| 5 | Hangi kontroller CI'da zorunlu olsun? | Unit/çıktı kontrolleri token kullanmaz. Browser kapsamı ve gizli politika erişimi ayrıca tasarlanmalı. |

Önerilen başlangıç: önce bilgi önceliği ve panel davranışı üzerinde anlaşalım. Ardından bu kararları gösteren küçük bir wireframe hazırlansın. Bu rapor, tasarımın owner tarafından onaylandığı veya önerilerin uygulanmasına otomatik izin verildiği anlamına gelmez.
