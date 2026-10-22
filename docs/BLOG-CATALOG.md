# Blog katalog prototipi

`/writing/` ve `/tr/writing/` aynı iki dilli şablonu kullanır. Ortak site üst barı korunur. Koyu bir katalogda dört öne çıkan banner, üç yatay raf ve 12 örnek kart vardır.

## Parçalar

- `src/data/blog-catalog.ts`: örnek başlıklar, açıklamalar, kategoriler, renkler ve sabit banner seçimi.
- `src/components/pages/WritingPage.astro`: katalog HTML’i, küçük carousel/önizleme/kaydırma davranışları.
- `src/components/blog/CatalogArtwork.astro`: dört tekrar kullanılabilir SVG kapak motifi. Harici görsel isteği yoktur.
- `src/styles/blog-catalog.css`: responsive katalog ve kapak stilleri.

Veritabanı, yeni paket veya harici carousel kütüphanesi eklenmedi. İlk sürümde rastgele seçim yerine dört sabit kimlik kullanılır; `featuredPostIds` listesini değiştirerek seçim yapılır.

## Etkileşimler

- Banner 6,5 saniyede bir değişir. Oklar, seçim noktaları ve duraklat/devam et düğmesi vardır.
- Fare banner üzerindeyken, klavye odağı içindeyken, önizleme açıkken veya sekme görünmezken otomatik geçiş durur. Azaltılmış hareket tercihinde başlangıçta otomatik geçiş kapalıdır.
- Görünmeyen slaytlar yerleşimde yükseklik ayırır; başlık uzunluğu değiştiğinde alt raflar zıplamaz. `visibility: hidden` ile odak ve erişilebilirlik ağacından çıkarılırlar.
- Raflar doğal yatay kaydırma ve CSS scroll snap kullanır. Desktop okları kaydırır; dar ekranda parmakla kaydırılır. Klavyeden kartlara ilerlemek de ilgili kartı görünür alana getirir.
- Kart ve banner düğmeleri tek bir yerel `<dialog>` açar. Bu yalnızca başlık/açıklama ve örnek içerik notudur; sahte yayımlanmış yazı sayfası oluşturulmaz. Escape, kapatma düğmesi ve dış alana tıklama ile kapanır.
- JavaScript olmadan ilk banner ve bütün raflar görünür; kategori bağlantıları ve yatay kaydırma çalışır. Kullanılamayan önizleme düğmeleri devre dışıdır; carousel kontrolleri gösterilmez.

## Gerçek yazılar geldiğinde

Katalog verileri şu an yalnız tasarım örnekleridir; Astro `writing` koleksiyonuna, RSS’e ve yazı route’larına eklenmezler. Önceki başlangıç yazısının route’u ve RSS davranışı değiştirilmedi.

Gerçek içerik geldiğinde mevcut Markdown koleksiyonundan kartları üretip örnek önizlemeyi gerçek yazı bağlantısına çevirmek yeterlidir. İlk aşamada veri tabanı veya CMS gerekmez. Kapak görseli ve banner seçimi için gerekirse koleksiyona birkaç alan eklenebilir; şu anda bu altyapı kurulmadı.

## Kontrol sınırı

Bu değişiklik sırasında bağlı tarayıcı bulunmadığından gerçek ekranda carousel, dialog, kaydırma ve mobil kırpma görsel olarak kontrol edilemedi. Tip/build ve üretilmiş HTML/bağlantı kontrolleri bu etkileşimlerin tarayıcıda görsel doğrulaması değildir.
