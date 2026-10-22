# Blog kataloğu

Katalog artık gerçek Markdown yazılarını kullanır. [Wireframe](wireframes/blog.svg) ilk tasarım kararının kaydıdır; canlı sayfalar `/writing/` ve `/tr/writing/` adreslerindedir.

## İçerik ve dil

- Weebly’den sekiz özgün yazı yayımlanır: iki İngilizce, altı Türkçe. Altı Türkçe yazının ayrıca İngilizce sürümü vardır. Berkin Elvan yazısı yayına dahil edilmez.
- İngilizce katalog sekiz yazının İngilizce sürümlerine gider. Türkçe katalog altı özgün Türkçe ve iki özgün İngilizce yazıya gider; yazının dili görünürdür. Kartlar ve banner yazıları yeni sekmede açar.
- Özgün başlık ve gövdeler korunur. Kartların arkasındaki kısa özetler ayrı `catalog.summary` metaverisidir; yazı gövdesine eklenmez. Çeviriler ayrı dosyalardır, `translationKey` ve `translatedFrom` ile eşleşir.
- Görseller kaynak arşivinden seçilir. Kapak alt metni, ölçüler ve kırpma konumu metaveride bulunur; yapay görsel üretilmedi. Yazıların mevcut galeri görselleri ve PDF bağlantıları da korunur.
- Görünen tarihler Weebly’de gösterilen takvim günüdür. Seçim analizi için 10 Ağustos 2014 gösterilir; farklı olan özgün RSS zamanı kaynak metaverisinde korunur. Aktarım veya çeviri tarihi, yayın tarihi yerine geçmez.
- RSS, kullanıcı isteğiyle kaldırıldı: route, HTML keşif bağlantısı, footer bağlantısı ve paket bağımlılığı yoktur.

## Yerleşim ve etkileşim

Banner ekran kenarlarına uzanır; ayrı kart çerçevesi yoktur. Dört seçilmiş yazı 6,5 saniye arayla 850 ms çapraz geçişle değişir. Yazılım/güvenlik, Glass deneyimi, İstanbul trafiği ve oyun yazısı birlikte görünür.

Sekiz görsel kart üç raftadır: **Teknoloji & dijital yaşam (4)**, **Oyun & sinema (2)**, **Toplum & şehir (2)**. Kartın önünde kısa başlık, 180° dönen arkasında tarih, yazı dili ve kısa özet vardır. Dokunmatikte özet ön yüzde de gösterilir. Başlıklar dar kartta satır kırar.

Swipe, oklar ve otomatik geçiş aynı 850 ms animasyonu kullanır. Touchpad’de atalet yeni hareketten ayrılır; geçiş sürerken yalnızca son yeni yön isteği tutulur. Dikey kaydırma ve pinch engellenmez. Yazı alanında hover, banner içinde klavye odağı veya görünmeyen sekme otomatik geçişi bekletir.

Azaltılmış harekette autoplay başlangıçta kapalıdır; slayt/özet anında değişir, 3D dönüş yoktur. Görünmeyen slaytlar JS ile `inert` ve `aria-hidden` olur. JS kapalıyken banner ve raflar doğal yatay scroll ile çalışır.

## Kaynaklar ve kontroller

- `src/content/writing/`: özgün metinler, çeviriler ve katalog metaverisi.
- `src/data/blog-catalog.ts`: dil seçimi, raflar ve dört öne çıkan yazı anahtarı.
- `src/lib/post-dates.ts`: görünür kaynak gününün saat diliminden bağımsız biçimlenmesi.
- `src/components/blog/CatalogCover.astro`: kaynak görsellerin kapak sunumu.
- `src/components/pages/WritingPage.astro`, `ArticlePage.astro`: katalog ve gerçek okuma sayfaları.
- `src/lib/blog-banner.ts`: ortak geçiş ve touchpad hareketleri.
- `archives/weebly/publication.json`: yayın kapsamı ve özgün gövdelerin kontrol hash’leri. İleride istenerek metin düzenlendiğinde bu kayıt da bilinçli güncellenmelidir.
- `scripts/check-blog-publication.mjs`: metinlerin korunması, tarihler, kapaklar, ekler, dil bağlantıları ve dışlanan yazı kontrolleri. `pnpm check:output` ve CI’da çalışır.

Gerçek tarayıcı yüzeyi bulunmadığından görsel kırpma ve fiziksel touchpad hissi cihaz üzerinde ayrıca değerlendirilmelidir. #10 makale okuma tasarımının ileri düzenlemelerini, #21 katalog görsel incelemesini izler.
