# Temel tasarım belgesi

Durum: **v0.1 / ilk temel tasarımın kaydı**. Ana sayfanın güncel yönü üç bölümlü yıldızlı gökyüzüdür; güncel kompozisyon ve bileşen kararları [NIGHT-HOME.md](NIGHT-HOME.md) belgesindedir. Aşağıdaki hero ve ana sayfa düzeni önceki taslağı anlatır. Bu belge tamamlanmış marka kimliği veya nihai arayüz onayı değildir.

## Site neyi anlatmalı?

Mehmet Berk Gürçay’ın yazılımcı kimliği, yazıları, Atlantis kitabı ve kişisel merakları tek bir yerde buluşur. Ziyaretçi ilk ekranda kimin sitesinde olduğunu, temel uğraşlarını ve nereye devam edebileceğini anlamalı.

Öncelikli ziyaretçiler: mesleki profilini merak edenler, yazı okuyucuları, Atlantis’i takip etmek isteyenler ve seni tanıyan kişiler. Eski projeler otomatik taşınmaz; güncel profili temsil edecek örnekler seçilir.

## İlk kapsam

- Ana sayfa: tanıtım, üç içerik kapısı, Atlantis vurgusu, son yazılar.
- Hakkımda: kısa ve doğru tanıtım; gerçek CV için genişleme alanı.
- Yazılar: liste, okunabilir detay sayfası, RSS.
- Atlantis: tanıtım ve tarihli süreç notlarına giriş.
- Alt bölüm: doğrulanmış sosyal bağlantılar ve site içi yollar.

CV’nin detayları, seçilmiş işler ve albüm sonraki içerik aşamasında gelecek. Sahte iş, unvan, müşteri, istatistik, kitap özeti veya ilerleme yüzdesi kullanılmaz.

## Görsel yön

**Grafit yüzey, büyük tipografi, sıcak vurgu, açık çizgiler.** Teknik ve yaratıcı tarafı aynı ritim içinde taşıyan editoryal bir düzen. Ana sayfa daha geniş ve görsel; makale sayfası dar ve sakin.

| Token         | İlk değer     | Kullanım                 |
| ------------- | ------------- | ------------------------ |
| Arka plan     | `#141719`     | Ana yüzey                |
| Yüzey         | `#1c2023`     | Kod ve ikincil alanlar   |
| Ana metin     | `#ecebe7`     | Başlık ve önemli metin   |
| İkincil metin | `#a3aaa9`     | Açıklamalar              |
| Vurgu         | `#d9ae78`     | Link, küçük işaretler    |
| Çizgi         | `#343a3b`     | Bölüm ayrımları          |
| Başlık        | Space Grotesk | Büyük başlık ve wordmark |
| Gövde         | DM Sans       | Uzun ve kısa metin       |

Google Fonts ilk taslakta dış kaynaktan yüklenir; sistem fontları fallback’tir. Nihai yönde fontları lisanslarıyla birlikte yerel sunma kararı verilebilir. İlk taslak yalnızca koyu temadır.

## Düzen ve bileşenler

Desktop’ta ana içerik en fazla 1280px; genişliğe göre 56px dış boşluk. Mobilde 20px dış boşluk. Kırılımlar 1000 ve 700px. Metin satırları makalede en fazla yaklaşık 780px bir kapsayıcıda tutulur.

- Header: wordmark, kısa menü, GitHub. Mobilde menü görünür kalır; gereksiz hamburger yok.
- Hero: isim, kısa rol tanımı, büyük başlık, ikincil tanıtım, profil bağlantısı ve soyut SVG.
- İçerik kapıları: Build / Think / Imagine. Her biri çalışan bir hedefe gider.
- Atlantis alanı: temsili tipografik görsel ve eser sayfası bağlantısı. Görsel gerçek kapak değildir, kullanımı gözden geçirilecek.
- Yazı satırı: kategori, başlık, açıklama, tarih, yön oku.
- Makale: geri bağlantısı, kategori/tarih, başlık, açıklama, gövde.
- Footer: kimlik, RSS ve doğrulanmış sosyal adresler.
- Dil geçişi: Her sayfada EN / TR; çevrilmiş yazılarda aynı içeriğin karşılığına gider.

## Hareket

İlk sürümde hero SVG’sinin yavaş hareketi ve hover tepkileri var. Ziyaretçiyi bekleten zorunlu splash veya giriş butonu yok. Başlıklar ve navigasyon animasyon bitmeden erişilir. JavaScript kapalıyken bütün içerik görünürdür.

`prefers-reduced-motion: reduce` animasyonu ve yumuşak kaydırmayı kaldırır. Daha zengin splash/scroll koreografisi, tasarım yönü netleştikten ve mobil performans ölçüldükten sonra eklenir.

## Erişilebilirlik ve kalite hedefleri

Semantik başlık düzeni, tek h1, skip link, görünür klavye odağı, aktif navigasyon ve dar ekrana uygun akış. Dekoratif grafikler ekran okuyucudan gizlenir. Bilgi yalnızca hareket veya renkle aktarılmaz. Gövde metninde AA kontrast hedeflenir; kontrast ve dokunma alanları ayrıca QA’da kontrol edilir.

Hedefler: tüm ana içerik JS’siz okunur; yatay taşma yok; mobilde rahat yazı; açılışı engelleyen büyük video/3D dosyası yok. Performans puanı henüz ölçülmüş bir sonuç değildir.

## Sonraki tasarım oturumu

1. Görsel yön: grafit mi, daha açık editoryal bir alternatif mi?
2. Türkçe/İngilizce gerçek metinlerin tonu ve uzunluğu; iki dilde satır kırılımları.
3. Gerçek mesleki tanıtım ve ana sayfa cümlesi.
4. Desktop/mobile wireframe üzerinde bölüm öncelikleri.
5. Fotoğraf veya kişisel işaret kullanımına karar.
6. Atlantis’in kamuya açık tanıtımı ve görsel kimliği.
7. Yüksek ayrıntılı ekranlar ve hareket prototipi.

İlk [wireframe](wireframes/README.md) yerleşim ve hiyerarşi çalışmasıdır. Çalışan site, bu iskeletin ilk görsel yorumudur; ikisi sonraki tasarım oturumunda birlikte güncellenir.
