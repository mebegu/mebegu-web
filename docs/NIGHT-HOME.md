# Dört dünyaya açılan gökyüzü

Bu sürüm kullanıcının iki görsel referansını birleştirir: yıldızlı gökyüzü önünde yalnız duran kişi ve alt merkezden yukarı doğru açılan bölünmüş kompozisyon. Soldan sağa **Profesyonel, Blog, Alamori, Projects**. Dilimlerin tonları sırasıyla mavi, bordo, yeşil ve kehribar. Teleskop, spot ışığı veya zorunlu giriş adımı bulunmaz.

## Parçalar

Güncel arka plan `art/night-sky-horizon.webp` dosyasıdır (yaklaşık 239 KB). Galaksi alt gökyüzünde, ufka neredeyse paralel uzanan çok sığ bir U/parabola şeklindedir. Parlak diyagonal vurgu kaldırıldı; tüm ufuk boyunca sıcak turuncu geçiş korunur. Başlıklar açık fırça izleri üzerinde, hover açıklamaları ise yalnız kendi alanlarında yumuşak koyu bir örtü ve metin gölgesiyle okunur tutulur. Dilim renkleri normal durumda önceki yoğunluğun %28’indedir; hover veya klavye odağındaki dilim 220ms içinde eski yoğunluğuna döner. Yırtık sınır ve lif grupları %55 opaklıkla gösterilir.

Her başlığın arkasında dilimin paletine uygun açık renk bir fırça izi, üzerinde koyu yazı bulunur. `public/art/brush-swipe.svg` düzensiz kenarlı ve lif aralıklı bir maske olarak kullanılır. Başlığın altındaki açıklama hover veya klavye odağından sonra açık renkle belirir; dokunmatik ekranda doğrudan görünür. On sekiz animasyonlu yıldız, %28–60 arasındaki yazı kuşağının dışında kalır.

Düz çizgiler yerine üç geniş yırtık kenarı vardır. Her sınır 43 noktadan ve düzensiz genişlikte kâğıt şeridinden oluşur; ince kıvrımlı lifler şeridin dışına taşar. Dört dilim üst kenar genişliğiyle değil gökyüzü dikdörtgeninin alanına göre eşittir. Tırtıkların toplam alan etkisi sıfırlanır. Renkli paneller ile bağlantıların tıklama bölgeleri aynı geometriden üretilir.

Etiketler tek satırda değil bir yay üzerinde yerleşir: dış dilimlerde daha aşağıda, iç dilimlerde daha yukarıdadır. Her grubun farklı yüksekliği ve -8°, -4°, +5°, +8° açısı vardır. Fırça izi başlığın doğal genişliğine oturur; eski tam genişlikte şerit kullanılmaz. Dilimin tamamı kırpılır, içerik ayrıca tırtıkların 1,1 yüzde puanı içinde kalan bir maskeye alınır. Böylece boya, yazı, odak çerçevesi ve hover hareketi komşu dilime geçmez. Yeni bitmap üretilmedi; renkler, kâğıt yırtıkları ve fırça izleri kod/SVG katmanlarıdır.

Karakterin zemine teması, arka planın `object-fit: cover` ölçeğinden hesaplanır. Yeni kayadaki destek düzlemi kaynak görselde yaklaşık y=914/992, görünen ayakların altı karakter görselinde y=1432/1536’dır. Alttaki şeffaf boşluk konuma dahil edilir. Bacaklar sabittir; üst gövdenin hareket pivotu bel, başın pivotu boyun bölgesindedir. Sahne boyutları CSS container birimleriyle kullanılır; ayrı ön kaya gerçek ayak tabanına bağlıdır.

Kaynak görsellerin %34–60 yükseklik bandı beş desktop/portrait kadrajına göre sayısal olarak karşılaştırıldı. Yeni görselde parlaklık ve parlak piksellerin yoğunluğu belirgin azaldı; bu yalnız görsel dosyası analizi, tarayıcıda kontrast veya WCAG uygunluk sonucu değildir. Koyu yazı bölgeleri dar kadrajda da sürdüğü için bu sürüm aynı görseli kullanır; ayrı mobil görsel gereksinimi görsel QA’da değerlendirilir.

| Parça            | Dosya                                     | Sorumluluk                                                  |
| ---------------- | ----------------------------------------- | ----------------------------------------------------------- |
| Bölüm kayıtları  | `src/data/sections.ts`                    | Kimlik, iki dilde başlık/açıklama, route                    |
| Dilim geometrisi | `src/lib/sky-layout.ts`                   | Kategori sayısına göre dilimler, etiket konumları, çizgiler |
| Ortak üst bar    | `src/components/SiteToolbar.astro`        | Tüm sayfalarda logo, bölüm menüsü ve dil seçimi             |
| Ana sahne        | `src/components/night/NightLanding.astro` | Dört gerçek bağlantı ve dekoratif sahne                     |
| Kâğıt gökyüzü    | `src/components/night/PaperSky.astro`     | Renkli paneller, yırtık kenarlar ve lifler                  |
| Yıldızlar        | `src/components/night/StarField.astro`    | Deterministik konumlar, yavaş parıltı                       |
| Karakter         | `src/components/night/Observer.astro`     | Ayrı transparan katman ve hafif idle hareketi               |
| Görünüm          | `src/styles/night.css`                    | Kompozisyon, responsive ölçekler, hareket                   |
| Sosyal kayıtlar  | `src/data/socials.ts`                     | Instagram, YouTube, Twitter, Facebook, LinkedIn, GitHub     |
| Sosyal şerit     | `src/components/SocialLinks.astro`        | Gerçek adresler geldiğinde etkinleşen bağlantılar           |

Ayırıcılar arka plan bitmap’inde bulunmaz: SVG ve bağlantı bölgeleri kayıt sayısından hesaplanır. Yeni bölüm eklemek için sayfa ve bölüm kaydı eklenir. Kategori sayısı arttığında özellikle mobil etiket ölçüleri ayrıca kontrol edilir; geometrinin otomatik olması her sayıda iyi tipografi garantisi değildir.

## İçerik ve gezinme

- `/writing/` ve `/tr/writing/`: mevcut blog.
- `/professional/` ve `/tr/professional/`: CV ve portföy için ortak giriş, `#cv` ve `#portfolio` bölümleri.
- `/alamori/` ve `/tr/alamori/`: yeni hikâye sayfası.
- `/projects/` ve `/tr/projects/`: kişisel projeler ve denemeler; henüz gerçek proje eklenmedi.
- Güncel CV ve gerçek iş örnekleri henüz verilmediği için profesyonel sayfada bu durum açıkça belirtilir. Şirket, unvan, tarih veya proje sonucu uydurulmaz.
- Önceki `/atlantis/` ve `/about/` adresleri korunur. Alamori’nin Atlantis ile aynı eser olduğu varsayılmadı.
- İlk aşamada altı sosyal adresin tamamı, kullanıcı isteğiyle `null`. Placeholder’lar navigasyon yapmaz, `href="#"` kullanmaz, klavye sırasına girmez. Gerçek URL eklenince standart bağlantıya dönüşür.

## Erişilebilirlik ve hareket

Hover veya klavye odağı dilimin alan ağırlığını 1’den 1,18’e çıkarır. `night-interactions.ts` 520ms boyunca aynı geometriyi renkli panellere, yırtıklara, tıklama bölgelerine ve içerik maskelerine uygular. Alt açıklama 60ms gecikmeyle görünür; dokunmatik cihazlarda hover gerektirmeden açık kalır. Keşfet/Explore yazısı kaldırılmıştır. Azaltılmış hareket tercihinde geometri anında güncellenir, CSS hareketleri kapalıdır. Üst slogan ve hareketi durdur düğmesi kullanıcının isteğiyle kaldırılmıştır.

Sosyal şeritte yalnız gerçek SVG marka logoları vardır; görünür ad, kısaltma veya çevreleyen daire yoktur. Ana sayfada logo opaklığı %38’dir; şerit alttan desktop’ta 3px, mobilde 2px konumlandırılır (44px dokunma alanı korunur). Erişilebilir adlar `aria-label` ile korunur. Kaynak ve lisans [THIRD-PARTY.md](THIRD-PARTY.md) belgesindedir.

Karakterin başı tek bir şeffaf atlasta dokuz yönlü pozdan oluşur. Önceki çapraz opaklık geçişi çift kontur ürettiği için kaldırıldı; aynı anda yalnız bir kare görünür. Kareler boyun noktasına hizalıdır ve seçim sınırlarındaki küçük eşik titreşimi önler. Gövde eğimi en çok 1,8°, perspektif dönüşü 8°’dir. `observer-tracking.ts` baş ve gövde için ayrı kritik sönümlü yaylar kullanır; baş normalize koordinatta saniyede en çok 2, gövde 1,1 birim ilerler. Gövdenin hedefi doğrudan fare değil, başın yumuşatılmış konumudur. Beldeki üst/alt katman çakışması kaldırıldı; ayaklar ve kaya sabittir. İmleç sahneden çıkınca ortaya döner. Dokunmatik cihazda ve azaltılmış hareket tercihinde takip kapalıdır. RAF hedefte durur. Ayrıntılar ve alternatifler [CHARACTER-ANIMATION.md](CHARACTER-ANIMATION.md) belgesindedir.

Dört kategori adı daima görünür; kısa açıklamalar hover veya klavye odağında, dokunmatik cihazlarda ise doğrudan görünür. Her dilim tek bir gerçek `<a>` öğesidir; yıldız bulma veya imleç hareketi gerekmez. `BaseLayout` bütün sayfalarda aynı `SiteToolbar` bileşenini gösterir: logo ana sayfaya döner, dört bölüm bağlantısı ortak kayıtlardan gelir, dil seçimi mevcut sayfanın çevirisini açar. Üst bar opak koyu bir zemin ve ince sıcak ayırıcıyla gökyüzünden ayrılır; kaydırırken üstte kalır. Mobilde menü ikinci satıra geçer. Sahne yüksekliği ortak `--site-toolbar-height` değerini çıkararak hesaplanır; karakterin zemine bağlı konumu sahne boyutlarına göre hesaplanmaya devam eder. Tüm yollar repo alt yolunu ve dil seçimini kullanır.

Parıltılar 6,4–10,8 saniyelik yavaş opaklık/ölçek döngüleridir. İşletim sisteminde azaltılmış hareket seçiliyse dekoratif animasyonlar devre dışıdır. JavaScript çalışmazsa dilimler geometrik olarak genişlemez; CSS hover/odak geri bildirimi, açıklamalar ve standart sayfa bağlantıları çalışır.

## Görseller ve doğrulama

WebP görseller `public/art/` içindedir; şeffaf karakterin alfa kanalı korunur. Kaynak PNG’ler ve üretim bilgileri [ART.md](ART.md) ile `docs/art-source/` altında bulunur. Kaynak dosyalar yayına kopyalanmaz.

Bu oturumda tarayıcı yüzeyi erişilebilir olmadığı için gerçek mobil/desktop ekran görüntüsü, clip-path hit alanları, klavye odağının görünümü ve animasyon estetiği görsel olarak doğrulanamadı. Build ve üretilmiş dosya/link kontrolleri görsel QA’nın yerine geçmez; çalışan önizlemede bunlar kontrol edilmeli.
