# İçerik ekleme rehberi

## Yeni yazı

Weebly’den sekiz özgün yazı ve altı İngilizce çeviri katalogda yayımlanır. Berkin Elvan yazısı dışarıda tutulur. Envanter ve özgün metin koruma kaydı [WEEBLY-IMPORT.md](WEEBLY-IMPORT.md) içindedir. RSS kullanıcı isteğiyle kaldırıldı.

`src/content/writing/` içine küçük harf ve tirelerden oluşan bir dosya adıyla Markdown ekleyin. Dosya adı URL olur; yayımdan sonra değiştirirseniz eski adres için yönlendirme planlayın.

```md
---
title: Yazının başlığı
description: Liste ve paylaşım için kısa açıklama.
published: 2026-10-22
category: Notes
draft: true
lang: tr
translationKey: yazinin-ortak-kimligi
---

Yazının gövdesi burada.
```

Kategoriler: `Notes`, `Software`, `Personal`, `Atlantis`. `draft: true` olanlar siteye çıkmaz. Yayımlamak için `false` yapın, yerelde kontrol edin ve push yapın. Gelecek tarih otomatik zamanlama değildir.

`lang` yazının ve route’un dilidir. Çeviriye ayrı Markdown dosyası ekleyin ve aynı `translationKey` değerini verin; `translatedFrom` özgün dosyanın uzantısız adını gösterebilir. Aynı anahtar ve dilde yalnızca bir kayıt bulunmalı. Tek dilde yazı yayımlamak mümkündür; katalog, karşı dilde sürüm yoksa özgün yazıya gider.

Katalogda görünmesi için yalnız özgün kayda `catalog` metaverisi ekleyin; çeviriye kopyalamayın. Örnek:

```yaml
catalog:
  shelf: technology # technology, culture veya society
  tone: blue # blue, green, amber veya violet
  summary:
    tr: Kartın arka yüzünde görünen kısa özet.
    en: A short summary for the back of the card.
  cover:
    src: /media/my-cover.jpg
    alt:
      tr: Görselin kısa açıklaması.
      en: A short description of the image.
    width: 1200
    height: 800
    position: center
```

Arşiv yazılarındaki `source.visibleDate`, eski sitede görünen gün/ay/yıl tarihidir. `published` özgün zaman kaydını korur. Öne çıkan dört yazının anahtarları `src/data/blog-catalog.ts` içindedir. Özgün gövdeyi bilinçli değiştirirken `archives/weebly/publication.json` koruma hash’i de gözden geçirilmelidir.

## Atlantis güncellemesi

Aynı klasöre `category: Atlantis` yazısı ekleyin. Yazı Atlantis sayfasında otomatik görünür; ayrıca kataloğa almak için yukarıdaki metaveriyi ekleyin. Tek metni iki yerde düzenlemek gerekmez. Kitap şablonu `src/components/pages/AtlantisPage.astro`, iki dildeki tanıtım metinleri `src/lib/i18n.ts` içindedir.

## Alamori şablonu

`src/components/pages/AlamoriPage.astro` iki dilde ortak kitap şablonudur. Kısa tanıtım, geçici tipografik kapak, PDF indirme alanı, geri bildirim önizlemesi ve yazım notları içerir. Kitabın konusu veya içeriği uydurulmadı; Atlantis ile aynı eser olduğu varsayılmaz.

`src/data/alamori.ts` içinde:

- `synopsis`: gerçek tanıtım için `{ tr: '…', en: '…' }`; boşsa açık placeholder metni.
- `pdfPath`: `public/` altındaki gerçek dosyanın yolu, örneğin `books/alamori.pdf`. Baştaki `public/` yazılmaz. `null` iken indirme düğmesi pasiftir; dosya eklenince repo alt yolunu kullanan yerel indirme bağlantısı oluşur.
- `feedbackUrl`: ileride bağlanacak gerçek geri bildirim sayfasının adresi. `null` iken alanlar devre dışıdır; veri gönderilmez veya kaydedilmez. URL eklendiğinde önizlemenin yerini bağlantı alır. Bu aşamada mesaj saklayan bir backend kurulmadı.

Son görsel tasarım daha sonra bu iskelet üzerinde ayrıca yapılacak.

## Projeler

`src/components/pages/ProjectsPage.astro`, **Atölye / Workshop** hobi vitrininin iki dilde ortak şablonudur. Mevcut `/projects/` ve `/tr/projects/` rotaları korunur. Hobi oyunları, kişisel yazılım ve deneylere ayrılır; CV’deki profesyonel işler burada yer almaz. İlk kart büyük, diğerleri iki sütunludur; mobilde tek sütuna geçer. Küçük bir istemci filtresi oyun/yazılım/deney kategorilerini süzer; JavaScript kapalıysa bütün kartlar görünür.

`src/data/projects.ts` bağımsız beş temsili hobi kartı içerir. Gerçek hobi işleri sağlandıkça değiştirilir; tamamlanmış kişisel proje iddiası değildir. İki dilde `title`/`description`, `kind`, `technologies`, `visual`, `image`, `demoUrl`, `codeUrl` ve `placeholder` alanları vardır.

- Atölye içeriklerini `projects.ts` içinde düzenleyin. Gerçek hobi işi eklenince `placeholder: false` yapın. İngilizce CV ve Selected work yalnız `resume.ts`/`portfolio.ts` üzerinden düzenlenir; iki koleksiyon birbirinden bağımsızdır.
- `image` için `public/` altındaki ekran görüntüsünün yolunu kullanın; örneğin `projects/my-game.webp`. `public/` öneki yazılmaz. `null` ise `ProjectVisual.astro` içindeki temsili SVG gösterilir.
- `demoUrl` ve `codeUrl` gerçek bağlantılardır; boş (`null`) değerler sahte bağlantı oluşturmaz, “eklenmedi” metni gösterilir. Görseller henüz temsili olarak işaretlidir.
- İlk kayıt büyük kart olarak gösterilir. Sıralamayı veri dosyasında değiştirebilirsiniz.

Gerçek proje detay sayfası, oyun çalıştırıcısı veya video oynatıcısı bu prototipe eklenmedi; görsel ve bağlantı alanları hazır bırakıldı. Tarayıcı yüzeyi erişilemediği için bu yerleşim görsel olarak doğrulanamadı; build ve yerel bağlantı kontrolleri görsel QA yerine geçmez.

## Profil ve sosyal hesaplar

`src/data/site.ts` ortak kimlik ve GitHub adresini tutar. Hakkımda metinleri `src/lib/i18n.ts`, sayfa şablonu `src/components/pages/AboutPage.astro` içindedir. E-posta, LinkedIn ve CV bağlantısı gerçek adresler verilince eklenir. Eski Weebly CV’si güncel sürüm olarak kullanılmaz.

## Görseller

İlk sürümün çizimleri kodla üretilen SVG/CSS’tir. Fotoğraflar eklendiğinde açıklayıcı dosya adı, alt metin, gerçek en/boy bilgisi ve optimize edilmiş boyut kullanın. Yalnızca sunulacak dosyalar `public/` içine konur; bu klasördeki her şey yayına çıkar.

## Yayından önce

- Tanıtım metinlerini ve ilk örnek yazıyı kendi üslubuna göre gözden geçir.
- İsim, linkler ve tarihler doğru mu?
- Paylaşılacak yazıda `draft: false` mı?
- Yerel bağlantılar `href()` yardımcısını kullanıyor mu?
- `pnpm validate` geçiyor mu?
- Desktop ve mobil görünümde sayfa okunuyor mu?
