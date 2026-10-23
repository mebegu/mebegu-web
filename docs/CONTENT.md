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

Öne çıkan yazılarda isteğe bağlı `catalog.banner`, kart kapağından bağımsız görsel tanımlar. `src`, `alt`, gerçek `width`/`height`, `position`, farklı enlerde `sources: [{ src, width }]` ve aynı alanları içeren `mobile` kompozisyonu kullanır. Mevcut dört kaydı örnek alın; dosya ölçüleri ve prompt kaydı [BLOG-BANNERS.md](BLOG-BANNERS.md) içindedir. Küçük bir kart görselini banner'a büyütmeyin.

Arşiv yazılarındaki `source.visibleDate`, eski sitede görünen gün/ay/yıl tarihidir. `published` özgün zaman kaydını korur. Öne çıkan dört yazının anahtarları `src/data/blog-catalog.ts` içindedir. Özgün gövdeyi bilinçli değiştirirken `archives/weebly/publication.json` koruma hash’i de gözden geçirilmelidir.

## Atlantis güncellemesi

Aynı klasöre `category: Atlantis` yazısı ekleyin. Yazı Atlantis sayfasında otomatik görünür; ayrıca kataloğa almak için yukarıdaki metaveriyi ekleyin. Tek metni iki yerde düzenlemek gerekmez. Kitap şablonu `src/components/pages/AtlantisPage.astro`, iki dildeki tanıtım metinleri `src/lib/i18n.ts` içindedir.

## Alamori şablonu

`src/components/pages/AlamoriPage.astro` iki dilde ortak kitap vitrini. Gerçek kapak, spoiler içermeyen tanıtım, ilk 20 sayfanın Türkçe/İngilizce PDF önizlemesi, yazım durumu, seçilmiş güncellemeler, yol haritası, Blog yazıları ve okur notu bağlantısı içerir. Para toplama veya mesaj saklama formu yoktur.

`src/data/alamori.ts`, şemadan doğrulanan `src/data/alamori.json` public snapshot'ını yükler. İçeriğin otoritesi kitap reposundaki ayrı yayın paketidir; web reposu private kaynağı okumaz. Kitap reposu isteğe bağlı CI ile yalnız seçilmiş JSON, kapaklar ve kısıtlı PDF'leri bu repoya gönderir. Blog yazıları da paketteki açıkça seçilen paragraflardan üretilebilir.

- `synopsis`, `statusNote`, `currentFocus`, `updates` ve `roadmap`: yalnız public olarak seçilen iki dilli içerik.
- `covers` ve `previews`: importer tarafından hash'li yerel yollara dönüştürülen seçili dosyalar. Önizleme sayfa sayısı kapak ve açılış sayfalarını da içerir.
- `articles`: public Blog referansları veya kaynak paketten üretilen iki dilli yazılar; üretilmiş dosyalar elle düzenlenmez.
- `feedback`: gerçek okur iletişim bağlantısı; backend veya gönderim formu oluşturmaz.

Ayrıntılar ve gizlilik sınırı: [Alamori yayın rehberi](ALAMORI-PUBLICATION.md).

## Projeler

`src/components/pages/ProjectsPage.astro`, **Atölye / Workshop** için iki dilli workbench düzenidir. `/projects/` ve `/tr/projects/` rotaları korunur. Masaüstünde kısa proje dizini ve seçili proje paneli, mobilde seçilen satırın altında açılan tek panel vardır. Tür, durum ve metin araması birlikte çalışır. JavaScript kapalıyken tüm projeler ve bölümler okunur.

`src/data/projects.ts`, `src/data/projects/<id>.json` yayın kayıtlarını yükler. Tek kayıt, çalışan Cep Arşivi aracını tanıtan `pocket-archive.json` dosyasıdır. Kayıt yoksa otomatik örnek üretilmez. Profesyonel müşteri işleri bu koleksiyona dahil değildir. Durum, yayın bağlantısı ve proje türü birbirinden bağımsızdır. Fikir aşamasındaki, geliştirilmekte olan, yayındaki, tamamlanmış, ara verilmiş ve arşivlenmiş işler aynı modelle sunulur.

Ekran görüntüleri, kullanıcı başlatmalı GIF ve videolar; serbest yayın bağlantıları; mevcut çalışma odağı; tarihli güncellemeler; yol haritası; blog yazıları; geri bildirim, hata bildirimi, özellik isteği ve katkı kanalları desteklenir. Bölümler yalnız ilgili içerik varsa görünür. Gerçek bağlantı verilmeden aktif düğme veya sahte form oluşturulmaz.

Alanlar, medya ve bağlantı örnekleri için [Atölye içerik rehberine](WORKSHOP.md) bakın. Tam örnek kaynak `examples/workshop/project.json`, içe aktarılmış karşılığı `src/data/projects/pocket-archive.json` dosyasındadır. Görsellerin üretim promptları `docs/assets/workshop-images.json` içinde kayıtlıdır.

Private projeler kendi CI'larından yalnız `.workshop/public/` altında seçtikleri bilgileri ve referanslı medyayı aktarabilir. Ortak workflow, artan revizyon kontrolü ve diğer projeye verilecek prompt için [Atölye entegrasyon rehberi](WORKSHOP-INTEGRATION.md).

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
