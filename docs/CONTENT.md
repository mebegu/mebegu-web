# İçerik ekleme rehberi

## Yeni yazı

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

Kategoriler: `Notes`, `Software`, `Personal`, `Atlantis`. `draft: true` olanlar siteye ve RSS’ye çıkmaz. Yayımlamak için `false` yapın, yerelde kontrol edin ve push yapın. Gelecek tarih otomatik zamanlama değildir.

`lang: tr` Türkçe listede ve RSS’de, `lang: en` İngilizce listede ve RSS’de görünür. Aynı yazının çevirisine ayrı bir Markdown dosyası ekleyin ve aynı `translationKey` değerini verin. Dosya adı her dilde farklı olabilir. Aynı anahtar ve dilde yalnızca bir kayıt bulunmalı. Çeviriler otomatik üretilmez; her dilde kendi metnini düzenlersin. Tek dilde yazı yayımlamak mümkündür.

## Atlantis güncellemesi

Aynı klasöre `category: Atlantis` yazısı ekleyin. Yazı, kendi dilindeki Yazılar listesi ve RSS yanında Atlantis sayfasında da otomatik görünür. Tek metni iki yerde düzenlemek gerekmez. Kitap şablonu `src/components/pages/AtlantisPage.astro`, iki dildeki tanıtım metinleri `src/lib/i18n.ts` içindedir.

## Alamori şablonu

`src/components/pages/AlamoriPage.astro` iki dilde ortak kitap şablonudur. Kısa tanıtım, geçici tipografik kapak, PDF indirme alanı, geri bildirim önizlemesi ve yazım notları içerir. Kitabın konusu veya içeriği uydurulmadı; Atlantis ile aynı eser olduğu varsayılmaz.

`src/data/alamori.ts` içinde:

- `synopsis`: gerçek tanıtım için `{ tr: '…', en: '…' }`; boşsa açık placeholder metni.
- `pdfPath`: `public/` altındaki gerçek dosyanın yolu, örneğin `books/alamori.pdf`. Baştaki `public/` yazılmaz. `null` iken indirme düğmesi pasiftir; dosya eklenince repo alt yolunu kullanan yerel indirme bağlantısı oluşur.
- `feedbackUrl`: ileride bağlanacak gerçek geri bildirim sayfasının adresi. `null` iken alanlar devre dışıdır; veri gönderilmez veya kaydedilmez. URL eklendiğinde önizlemenin yerini bağlantı alır. Bu aşamada mesaj saklayan bir backend kurulmadı.

Son görsel tasarım daha sonra bu iskelet üzerinde ayrıca yapılacak.

## Projeler

`src/components/pages/ProjectsPage.astro` proje vitrininin iki dilde ortak şablonudur. İlk kart büyük bir Unity oyunu alanı, diğerleri iki sütunlu kartlardır; mobilde tek sütuna geçer. Blogdaki yatay katalogdan bağımsız bir yerleşimdir. Kategoriler oyunlar, yazılımlar ve deneylerdir. Küçük bir istemci filtresi kartları süzer; JavaScript kapalıysa bütün kartlar görünür.

`src/data/projects.ts` şimdilik beş açıkça etiketlenmiş örnek proje içerir. Gerçek oyun, bitmiş proje veya kullanılan teknoloji iddiası değildir. Her kayıt için iki dilde `title` ve `description`, `kind`, `technologies`, `visual`, `image`, `demoUrl`, `codeUrl`, `placeholder` alanları vardır.

- Gerçek proje eklendiğinde metin ve teknoloji listesini değiştirip `placeholder: false` yapın.
- `image` için `public/` altındaki ekran görüntüsünün yolunu kullanın; örneğin `projects/my-game.webp`. `public/` öneki yazılmaz. `null` ise `ProjectVisual.astro` içindeki temsili SVG gösterilir.
- `demoUrl` ve `codeUrl` gerçek bağlantılardır; boş (`null`) değerler sahte bağlantı oluşturmaz, yalnız “eklenmedi” metni gösterilir.
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
