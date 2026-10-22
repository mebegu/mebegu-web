# Blog banner görselleri

Banner, küçük arşiv kapaklarını genişlettiğinde pikselleşiyor ve ana objeleri kırpıyordu. Dört öne çıkan yazı için banner'a özel, metin alanı solda sakin kalan yeni sahneler hazırlandı. Kart kapakları, makale görselleri ve özgün yazı gövdeleri korunur.

## Dosyalar ve üretim

Görseller **built-in `image_gen`** ile üretildi; CLI/API kullanılmadı. Bunlar temayı anlatan dekoratif AI illüstrasyonlarıdır, arşiv fotoğrafı değildir. Her geniş sahneden ayrıca mobil kompozisyon üretildi; portre sürümü yalnızca dar bir kırpma değildir.

Seçilen nihai WebP dosyaları `public/media/blog-banners/` içindedir:

| Yazı                            | Geniş banner                      | Mobil banner                             |
| ------------------------------- | --------------------------------- | ---------------------------------------- |
| OK Glass...                     | `google-glass-1774.webp`          | `google-glass-mobile-1024.webp`          |
| Computer Virus Hoaxes           | `computer-virus-hoaxes-1774.webp` | `computer-virus-hoaxes-mobile-1024.webp` |
| İstanbul Traffic For Dummies... | `istanbul-traffic-1774.webp`      | `istanbul-traffic-mobile-1024.webp`      |
| The Walking Dead                | `walking-dead-1774.webp`          | `walking-dead-mobile-1024.webp`          |

Gerçek üretim boyutları geniş sahnede **1774 × 887**, mobilde **1024 × 1536** pikseldir. Prompt'taki hedef boyut gerçek çıktı boyutu olarak varsayılmaz. Dosyalar büyütülmedi; geniş sürümün 960/1440/1774, portrenin 480/768/1024 piksel enlerinde WebP seçenekleri bulunur. Tarayıcı uygun dosyayı seçer.

Kullanılan **tam prompt seti**, araç modu, her dosyanın nihai yolu, gerçek ölçüleri ve bayt boyutları [blog-banners.json](assets/blog-banners.json) içinde kayıtlıdır. Üretim PNG'leri sunulan dosyalar değildir; site bu dizindeki optimize WebP sürümlerini kullanır.

## Yerleşim

- `catalog.cover` yalnız kart kapağıdır. İsteğe bağlı `catalog.banner`, banner'ın bağımsız görselini ve mobil/masaüstü varyantlarını tutar; çeviriler aynı özgün kaydın görsellerini kullanır.
- `BlogBannerImage.astro`, `picture`/`source`/`srcset` kullanır. 650 piksel ve altında portre kompozisyon seçilir. İlk sahne öncelikli, diğerleri lazy yüklenir.
- Ana objeler sağda kalır; solda başlık/özet için boşluk ve mevcut okunabilirlik geçişleri korunur. Geniş görsel doğal ölçüsünün ötesine büyümez, büyük ekranda soldaki maske ile sayfa zeminine karışır.
- Kaydırma, autoplay ve geçiş süreleri değişmedi.

## Kontrol

24 WebP dosyası çözümlenerek gerçek ölçüleri kayıtla karşılaştırıldı. Dört sahnenin 1440 × 700, 800 × 680, 390 × 640 ve 320 × 640 alanlarındaki kadrajları bir tanı görselinde incelendi; ana objeler bu kadrajlara sığıyor. Bu çalışma tarayıcı ekran görüntüsü veya metin yerleşimi testi değildir.

`pnpm validate`, sekiz özgün gövdenin hash'lerini, eski kart kapaklarının korunmasını, iki katalogdaki dört ayrı banner'ı, tüm `srcset` dosyalarını ve yayın tarihlerini kontrol eder. Bu oturumda tarayıcı envanteri boş olduğundan gerçek cihazdaki görünüm ayrıca değerlendirilmelidir.
