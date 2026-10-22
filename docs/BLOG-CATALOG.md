# Blog wireframe ve çalışan prototip

Güncel yön: **çerçevesiz, tam genişlikte öne çıkan yazı arka planı ve dönen görsel raf kartları**. [Masaüstü, mobil ve etkileşim wireframe’i](wireframes/blog.svg). Canlı prototip `/writing/` ve `/tr/writing/` adreslerindedir.

## Yerleşim

- İç sayfalardaki ortak toolbar korunur. Blogun ana alanı `.shell` genişlik sınırını kullanmaz; öne çıkan arka plan ekranın kenarlarına kadar uzanır.
- Banner’ın çerçevesi, köşe yuvarlatması veya ayrı kart zemini yoktur. Başlık, kısa açıklama ve yazıya gitme bağlantısı doğrudan arka plan üzerinde durur. Görsel, raflara doğru koyulaşarak sayfanın zeminine karışır.
- Dört sabit öne çıkan içerik 6,5 saniye arayla yumuşak geçiş yapar. Şimdilik kapaklar temsili SVG çizimleridir; gerçek fotoğraf seçimi bu yerleşimden bağımsızdır.
- Alt bölümde üç yatay raf ve toplam 12 görsel kart bulunur. Ön yüzde görsel ve kısa başlık vardır; kart altında ayrı kategori, başlık veya açıklama satırı yoktur.

## Etkileşim

- Hover veya klavye odağında kart Y ekseninde 180° döner; arka yüz kategori, kısa özet ve yazıyı açma ipucunu gösterir. Kart dışındaki odak çerçevesi dönmez.
- Dönüş 780 ms sürer; daha uzak perspektif ve yumuşak hızlanma/yavaşlama kullanır. Hover başlangıcındaki 50 ms bekleme, fare kartın üzerinden geçerken gereksiz dönüşleri azaltır; klavye odağı beklemez.
- Banner touchpad’de yatay iki parmak kaydırmayla, dokunmatikte sağa/sola swipe ile değişir. Tek hareket bir slayt ilerletir; touchpad atalet kuyruğu peş peşe geçiş yapmaz. Dikey kaydırma ve pinch zoom tarayıcıda kalır. Swipe sırasında otomatik geçiş bekler, ardından yeniden zamanlanır. Yazı bağlantısına dokunma korunur; bağlantıdan başlayan swipe yeni sekme açmaz.
- Banner ve kart bağlantıları `target="_blank"` ile yazı sayfasını yeni sekmede açar; popup/dialog kullanılmaz. Yeni sekme bilgisi erişilebilir ad/açıklamada yer alır.
- Dokunmatikte tek dokunuş yazıyı açar; kısa özet iki satır halinde görselin üzerinde görünür, hover veya ikinci dokunuş gerekmez. Raflar doğal yatay kaydırmayı kullanır.
- Azaltılmış hareket tercihinde otomatik geçiş başlangıçta kapalıdır, çapraz geçiş ve 3D dönüş animasyonu uygulanmaz; hover/odak özet yüzünü anında gösterir.
- Banner’ın yazı alanı üzerinde fare varken, banner içinde klavye odağı varken veya sekme görünmüyorken otomatik geçiş durur. Arka planın boş alanında imleç durması geçişi durdurmaz. Küçük duraklat/başlat, önceki/sonraki ve doğrudan slayt seçimi kontrolleri vardır.
- Görünmeyen slaytlar `inert` ve `aria-hidden` taşır; bağlantıları klavye sırasına girmez. Slaytlar aynı grid alanını paylaşır; uzun başlıklar için ayrılan yükseklik korunur.
- JavaScript olmadan ilk banner, kart dönüşü, standart yeni sekme bağlantıları ve dokunmatik raf kaydırması çalışır. Otomatik geçiş ve ok kontrolleri JavaScript ile etkinleşir.

## İçerik durumu

Bu bir yerleşim prototipidir. Kartlardaki 12 içerik tasarım örneğidir; gerçek blog yazısı olarak RSS’e eklenmez. Tıklama akışını deneyebilmek için `/writing/sample/<id>/` ve `/tr/writing/sample/<id>/` altında başlık/açıklama ve gövde yer tutucusu olan 24 örnek okuma sayfası üretilir. Bu sayfalar açıkça örnek olarak işaretlidir ve `noindex` taşır.

Weebly’den aktarılan dokuz yazı `draft: true` olarak korunur; wireframe çalışması bunları yayımlamaz. İçerik seçimi ve gerçek Markdown kataloğu #11/#25, son okuma tasarımı #10 üzerinden takip edilir. Katalog UI’si #21 kapsamındadır. Veritabanı, üyelik veya carousel kütüphanesi eklenmedi.

## Dosyalar ve doğrulama

- `src/data/blog-catalog.ts`: sabit örnek başlıklar, açıklamalar, raflar ve öne çıkan seçimleri.
- `src/components/pages/WritingPage.astro`: tam genişlikte banner ve iki yüzlü bağlantı kartları.
- `src/styles/blog-catalog.css`: arka plan geçişi, raflar, 3D dönüş, mobil ve azaltılmış hareket davranışları.
- `src/lib/blog-catalog.ts`: küçük carousel ve raf kaydırma kodu; kartlar JS gerektirmez.
- `src/lib/carousel-gestures.ts`: banner’ın yatay wheel ve dokunmatik pointer hareketleri; harici kütüphane kullanmaz.
- `scripts/test-carousel-gestures.mjs`: yön, atalet, dikey kaydırma/pinch, dokunma ve swipe sonrası bağlantı davranışı için yedi olay simülasyonu; `pnpm test:gestures` ile çalışır ve CI’da uygulanır.
- `src/components/pages/SampleArticlePage.astro`: örnek yazının ayrı sayfa iskeleti.
- `docs/wireframes/blog.svg`: şematik masaüstü/mobil görünüm ve hover → tıklama akışı. Tarayıcı ekran görüntüsü değildir.

Tip/build, yeni sayfa bağlantıları ve iki dilde semantik çıktı kontrolleri çalıştırılır. Gerçek tarayıcı envanteri boş olduğundan hover’ın görsel akıcılığı, mobil kırpma ve carousel zamanlaması henüz gerçek ekranda doğrulanmadı; çalışan prototipte ayrıca değerlendirilmelidir.
