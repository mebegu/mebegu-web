# Doğrulama

## Touchpad’de ikinci swipe düzeltmesi — 22 Ekim 2026

- Kullanıcı sorunun touchpad’de iki parmakla kaydırmada olduğunu doğruladı. Kaynakta animasyon sırasında tanınan hareketin kilitlenip atıldığı, devam eden ataletin de yeni hareketi engelleyebildiği görüldü. İkinci swipe, aynı yönde yeni kuvvetli hareket ve atalet bitmeden ters yöne dönüş için üç regresyon testi önce başarısız oldu.
- Yeni touchpad hareketi animasyon bitişinde uygulanır; yalnızca en son yön isteği tutulur. Atalet azalması sonrası yeni güçlenme veya yön değişimi yeni hareketi açar. Tek swipe’ın hızlanması ve sabit atalet kuyruğu yeni geçiş oluşturmaz. Normal 850 ms animasyon korunur; dokunmatik yolu değiştirilmedi.
- 13 olay/zaman testi geçti. Astro kontrolünde 63 kaynak dosyada sıfır hata/uyarı/ipucu; statik çıktıda 41 HTML, 998 yerel referans ve iki RSS doğrulandı. Bunlar fiziksel touchpad veya görsel tarayıcı doğrulaması değildir; cihaz üzerinde tekrar deneme halen gerekir.

## Swipe için normal banner animasyonu — 22 Ekim 2026

- Kullanıcı doğal scroll sürümünün fazla hızlı geçtiğini bildirdi. Swipe artık yalnızca önceki/sonraki slaydı seçer; oklar ve otomatik geçişle aynı 850 ms çapraz geçişi başlatır. Hızlı hareket animasyonu kısaltmaz; animasyon sürerken ek geçişler biriktirilmez ve atalet kuyruğu yutulur. JS olmadan doğal yatay scroll alternatifi korunur.
- Sekiz olay/zaman simülasyonu geçti: 850 ms kilit, uzun momentum kuyruğu, küçük/shift/line/page wheel hareketleri, iki yönde dokunmatik swipe, dikey scroll/pinch/tıklama, iptal/çoklu parmak, autoplay/kontroller ve azaltılmış hareket. Fiziksel cihaz veya görsel tarayıcı testi değildir.
- `pnpm validate`: 63 kaynak dosyada sıfır hata/uyarı/ipucu, 41 HTML ve 998 yerel referans, iki RSS. Gerçek tarayıcı yüzeyi bulunmadığından görsel tempo ve fiziksel swipe ayrıca değerlendirilmelidir.

## Banner’da gerçek yatay scroll düzeltmesi — 22 Ekim 2026

- Kullanıcı önceki swipe uygulamasının çalışmadığını bildirdi. Özel wheel/pointer eşikleri kaldırıldı; banner yan yana duran dört slaytla gerçek `overflow-x: auto` / CSS scroll snap alanına çevrildi. `touch-action: pan-y` kısıtı kaldırıldı. Kontroller/otomatik geçiş `scrollTo` kullanır, aktif nokta doğal scroll konumunu takip eder.
- Sekiz Node simülasyonu geçti: iki yönde scroll durumu, autoplay bekleme/scrollend alternatifi, kontrol hedefleri/sarma, programatik geçişi kesme, wheel/dikey scroll/pinch/tıklamayı engellememe, azaltılmış hareket ve yeniden boyutlandırma, taşma/gizli alan durumu. Bu testler tarayıcının fiziksel swipe/scroll uygulamasını doğrulamaz.
- `pnpm validate`: 63 kaynak dosyada sıfır hata/uyarı/ipucu, 41 HTML ve 998 yerel referans, iki RSS. Tarayıcı envanteri halen boş (`apps: [], browsers: []`); fiziksel touchpad ve dokunmatik doğrulaması yapılamadı. Önceki yedi gesture testinin geçmesi gerçek kullanıcı davranışının çalıştığını kanıtlamadı; aşağıdaki eski kayıt bu kapsamda değerlendirilmelidir.

## Blog banner swipe ve kart dönüşü — 22 Ekim 2026

- Kartın 180° dönüşü 780 ms, daha uzak perspektif ve yumuşak hızlanma/yavaşlama kullanır. Azaltılmış hareket tercihi dönüşü kapatmayı sürdürür.
- Banner’a touchpad yatay wheel ve dokunmatik swipe eklendi. Her hareket bir slayt değiştirir; atalet kuyruğu yutulur. Dikey kaydırma/pinch korunur; swipe sırasında autoplay bekler. Bağlantıya dokunmak yeni sekme açar, bağlantıdan swipe yapmak açmaz.
- Yedi Node olay simülasyonu geçti: küçük delta birikimi, atalet, ters yön, wheel birimleri, dikey/çapraz hareket/pinch, dokunma/swipe/iptal/çoklu parmak, klavye tıklaması ve mouse ayrımı. Bunlar fiziksel cihaz veya tarayıcı testleri değildir. CI aynı testleri çalıştırır.
- `pnpm validate`: 63 kaynak dosyada sıfır hata/uyarı/ipucu, 41 HTML ve 998 yerel referans; iki RSS doğrulandı. Tarayıcı envanteri yine boş (`apps: [], browsers: []`); gerçek touchpad/dokunmatik hissi ve görsel akıcılık canlı sayfada değerlendirilmelidir.

## Minimal blog wireframe’i — 22 Ekim 2026

- Tam genişlikte öne çıkan arka plan, dört otomatik slayt, üç rafta 12 dönen kart ve popup yerine yeni sekmede örnek okuma sayfaları eklendi. Masaüstü/mobil/etkileşim çizimi `docs/wireframes/blog.svg` içinde; SVG PNG’ye çevrilerek çizimin yerleşimi incelendi.
- `pnpm validate`: 61 kaynak dosyada sıfır hata/uyarı/ipucu, 41 HTML sayfası ve 998 yerel referans. İki dilde her kart/banner’ın yeni sekme hedefi ve hedef sayfanın varlığı; 24 örnek yazıda `noindex`; popup ve kart altı metinlerin kaldırılması kontrol edildi.
- Görünmeyen üç slayt `inert` taşır. Azaltılmış hareket ve dokunmatik davranışları CSS/JS’de tanımlı; gerçek tarayıcı envanteri boş olduğundan görsel dönüş, zamanlama ve mobil kırpma gerçek ekranda doğrulanamadı.
- Örnek sayfalar RSS’e girmez. Weebly’den gelen dokuz yazı taslak olarak korundu; bu çalışma onları yayımlamadı.

## Weebly blog arşivinin ilk aktarımı — 22 Ekim 2026

- RSS, sitemap ve 15 kategori/ay arşivi sayfasından bulunan 9 yazının tamamı Markdown taslağına dönüştürüldü: 2 İngilizce, 7 Türkçe.
- 61 görsel ve 1 PDF’nin SHA-256/format kontrolleri geçti. 4 video gömmesi bağlantıya çevrildi. Tek ham permalink HTML istisnası Windows Defender karantinasıdır; ilgili yazı RSS gövdesi ve blog-listesi verisiyle korundu, dosya geri yüklenmedi.
- Altı dönüşüm testi ve ağsız tekrar çalıştırma geçti; mevcut taslaklar ve ekler bayt düzeyinde değişmedi. Kaynak URL/yayın zamanı/kategoriler ve eski → önerilen yeni adres eşleştirmesi saklandı.
- `pnpm validate`: 57 kaynak dosyada sıfır hata/uyarı/ipucu, 17 HTML ve 414 yerel referans. Dokuz taslağın yazı route’u/RSS’e çıkmadığı ve ham arşivin `dist/` içine kopyalanmadığı ayrıca doğrulandı.
- Envanter, kaynak dosyaları, ham HTML istisnası ve editoryal inceleme adımları: [WEEBLY-IMPORT.md](WEEBLY-IMPORT.md). Katalog entegrasyonu ve yayımlanacak yazı seçimi henüz yapılmadı.

## Kapakta toolbar yerine sahne üstü kimlik — 22 Ekim 2026

- Yalnız iki ana sayfada toolbar kaldırıldı; `CoverHeader.astro` logo ve dil seçimini doğrudan gökyüzünün üzerine yerleştirir. İç sayfaların ortak toolbar’ı korunur.
- Sahne `100svh`; üstte ayrılmış toolbar yüksekliği yoktur. Mobil boşluklar, 44px bağlantı alanları ve klavye odağı korunur.
- `pnpm validate`: 57 kaynak dosyada sıfır hata/uyarı, 17 HTML sayfası ve 414 yerel referans. İki dilde kapak/toolbar ayrımı ve dil bağlantıları çıktı üzerinden kontrol edilir.
- Tarayıcı envanteri boş olduğu için gerçek ekran görüntüsü ve mobil görsel kontrol yapılamadı; canlı görünüm ayrıca değerlendirilmelidir.

## Kullanıcı sitesi kök adresine geçiş — 22 Ekim 2026

- Mevcut repo `mebegu/mebegu.github.io` olarak yeniden adlandırıldı; repo kimliği, Git geçmişi ve 24 issue korundu. Yerel origin `git@github.com:mebegu/mebegu.github.io.git` olarak güncellendi.
- GitHub Pages API artık `https://mebegu.github.io/` adresini döndürür; yayın yöntemi GitHub Actions, HTTPS etkin. `.env.example` base değeri `/`; CI base/origin değerlerini mevcut Pages ayarından otomatik alır.
- Ana giriş `/`, Türkçe giriş `/tr/`. Eski `/mebegu-web/` yolları önceki sürüm kayıtlarında tarihsel bağlamdır; güncel yayın yolu değildir.
- Kaynak kontrolü, statik build ve çıktı kontrolleri kök adresle çalıştırılır; linkler, görseller, canonical/hreflang ve iki RSS bu yol üzerinden doğrulanır.

## Profesyonel çalışmalar ve hobi atölyesi ayrımı — 22 Ekim 2026

- On bir CV/iş kaydının tamamı yalnız profesyonel sayfanın İngilizce Selected work bölümündedir; CV baskısına dahil edilmez.
- Atölye / Workshop ayrı `projects.ts` verisini kullanır; hobi oyunları, kişisel araçlar ve deneyler için beş temsili kartı vardır. Ana sayfa/üst menü etiketi ortak kayıttan değişir; `/projects/` adresleri korunur.
- Önceki aktarım notundaki profesyonel işlerin Projects’e taşınması bu düzeltmeyle kaldırıldı. Atölye iki dilli kalır; CV ve Selected work yalnız İngilizcedir.
- `pnpm validate`: 56 kaynak dosyada sıfır hata/uyarı, 17 HTML ve 422 yerel referans. Üretilen her iki rotada on bir profesyonel özetin Selected work içinde olduğu, beş hobi placeholder’ına müşteri içeriğinin girmediği ve ana sayfa/üst menü etiketleri doğrulandı. Gerçek tarayıcı görsel kontrolü ve PDF sayfa akışı halen bekliyor.

## CV ve portföy içerik aktarımı — 22 Ekim 2026

- Güncel CV’den üç iş deneyimi, beş yetkinlik grubu, iki eğitim ve üç dil seviyesi; iki belgeden on bir ortak portföy özeti eklendi. Bunların altısı profesyonel sayfada seçilmiş çalışma olarak gösterilir.
- `pnpm validate`: 56 kaynak dosyada sıfır hata/uyarı, 17 HTML sayfası ve 424 yerel referans; üretim `/mebegu-web` alt yolu, canonical, dil geçişleri ve RSS kontrolleri geçti.
- Üretilen İngilizce/Türkçe rotaların CV ve proje içerik metinleri aynı İngilizce metni kullanır; içerik kapsayıcıları `lang="en"` taşır. Ortak gezinme seçilen dilde kalır.
- Kaynak PDF’ler, tam sokak adresi ve telefon yayımlanmaz. Proje görselleri temsili olarak etiketlidir; var olmayan demo/kod bağlantıları oluşturulmaz.
- Tarayıcı envanteri boş: gerçek masaüstü/mobil görünüm, filtre etkileşimi ve A4 PDF sayfa akışı görsel olarak doğrulanamadı. CV’yi portföyden ayıran mevcut baskı stilleri korunur.

## GitHub Pages teslimi — 22 Ekim 2026

- Güncel sürüm: ortak üst bar, yazdırılabilir CV, blog katalog prototipi, Alamori şablonu, proje vitrini ve dokuz pozlu karakter atlası.
- Astro kontrolü: 55 kaynak dosyada sıfır hata/uyarı. Statik çıktı: 17 HTML sayfası, 422 yerel referans ve iki RSS.
- Kök yol ve `https://mebegu.github.io` + `/mebegu-web` üretim yolu için çıktı kontrolü kullanılır; anchor, asset, canonical ve karşılıklı çeviri hedefleri doğrulanır.
- Remote: `git@github.com:mebegu/mebegu-web.git`. Hedef site: `https://mebegu.github.io/mebegu-web/`.
- CI: PR ve `main` değişikliklerinde kilit dosyasıyla kurulum, tip kontrolü, build ve çıktı kontrolü. Yalnız `main` Pages’e yayımlanır. Action sürümleri tam SHA ile sabittir; yayın OIDC kullanır.
- Canlı run sonucu [Actions](https://github.com/mebegu/mebegu-web/actions) üzerinden takip edilir. Yerel build’in geçmesi tek başına başarılı canlı yayın anlamına gelmez.
- Gerçek tarayıcı yüzeyi erişilemediği için canlı animasyon estetiği, mobil kırpma ve tarayıcı PDF çıktısı görsel olarak doğrulanmış değildir.

## Önceki sürümlerin kontrol kaydı

22 Ekim 2026 tarihli dört renkli kâğıt dilimi sürümü için:

- Astro/TypeScript kontrolü: **0 hata, 0 uyarı, 0 ipucu**.
- Astro/TypeScript kontrolünde **48 kaynak dosyası** kontrol edildi.
- Üretim build’i: **17 HTML sayfası** ve iki dilde RSS üretildi.
- Kök yol: **406 yerel referans**, anchor’lar, canonical adresler, karşılıklı hreflang bağlantıları ve RSS hedefleri doğrulandı.
- Örnek özel origin + `/mebegu-web` alt yolu: aynı çıktı kontrolleri geçti. Bu, repo alt yolundaki asset ve dil bağlantılarını kapsar.
- Yerel HTTP sunucusunda iki ana sayfa, iki dilde Blog/Profesyonel/Alamori hedefleri ve iki WebP görseli **HTTP 200** döndürdü.
- Her iki ana sayfada dört kategori bağlantısının sırası/hedefleri, dört renkli panel, üç yırtık sınır, dört fırça etiketi ve on sekiz yıldız kontrol edildi. Projects’in iki dili ve fırça SVG’si HTTP 200 döndü.
- Son `dist/` çıktısı kök yol için yeniden üretildi; yerel görüntülemeye uygun.

## Henüz doğrulanmayanlar

Üç baş pozu ve yaylı takip düzenlemesinde anlık sıçrama olmaması, gövdenin başı gecikmeli izlemesi, hız sınırları ve 30/60/120 FPS tutarlılığı geçti. 10 Hz sağ/sol hedef değişiminde maksimum baş hareketi normalize aralıkta 0,089, gövde 0,035 kaldı; tam sağ/sol dönüşlere sıçramadı. Dokunmatik giriş, azaltılmış hareket ve merkezde RAF’ın durması kontrolleri de geçti. Bunlar birim simülasyonlarıdır; canlı tarayıcı görsel QA’sı değildir.

İmleç takibi birim simülasyonunda sağ/sol dönüş, açıların sınırlandırılması, ortaya dönüş, hedefte RAF’ın durması, dokunmatik girişin dışlanması ve azaltılmış harekette sıfırlama geçti. Bu test bir tarayıcı veya ekran görüntüsü testi değildir. Yeni gökyüzü kaynak görsel olarak incelendi; son sayfanın kompozisyonu ve baş/boyun katmanlarının optik sürekliliği gerçek tarayıcıda henüz doğrulanmadı.

Hover genişlemesinin 124 ara geometrisi kontrol edildi: alanlar ağırlık oranlarıyla eşleşir, dört etiket merkezi kendi içerik maskesinde kalır, maskeler dilim içinde bulunur ve üç yırtık sınır korunur. Kontrol salt geometri içindir; gerçek tarayıcıda pointer/focus davranışı, zamanlama, FPS veya karakterin optik zemine teması doğrulanmış değildir. Tarayıcı envanteri boş olduğu için bu sınırlama sürmektedir.

Radial yerleşim düzenlemesinde dört dilimin alanları 2275,002 / 2275,004 / 2274,991 / 2275,002 olarak hesaplandı (toplam gökyüzü alanı 9100). Yuvarlama dışında her biri %25’tir. Dört farklı etiket yüksekliği, masaüstü/mobil etiket merkezlerinin kendi maskelerinde kalması ve içerik maskelerinin tüm köşelerinin kendi dilimi içinde bulunması sayısal olarak kontrol edildi. Bu geometri kontrolü gerçek tarayıcıdaki font, kırpma ve odak görünümü testinin yerine geçmez.

Okunabilirlik düzenlemesinden sonra `pnpm validate` yeniden geçti: 42 kaynak dosyada sıfır hata/uyarı, 15 HTML sayfası ve 245 yerel referans. Yerel HTTP üzerinden iki ana sayfanın yeni gökyüzünü kullandığı, on animasyonlu yıldızın yazı kuşağı dışında kaldığı, üç kategori ve altı sosyal placeholder bulunduğu doğrulandı. Yeni WebP HTTP 200 ile 81.188 bayt olarak sunulur. Görsel kaynak dosyasının beş kadrajdaki parlaklık analizi, gerçek sayfanın WCAG kontrast testi değildir.

Bu oturumda kullanılabilir tarayıcı yüzeyi bulunmadığından desktop/mobile görsel kontrolü, klavye etkileşimi ve azaltılmış hareket tercihi gerçek tarayıcıda denenemedi. Bunların uygulama desteği kaynakta bulunur; görsel QA tamamlanmış sayılmaz. Lighthouse veya WCAG uygunluk puanı ölçülmedi.

Bu önceki kontrol sırasında GitHub remote’u tanımlı değildi ve canlı yayın yapılmamıştı. Güncel remote ve CI hazırlığı üstteki teslim bölümünde kayıtlıdır; canlı durum Actions sonucundan doğrulanmalıdır.

Yerel terminal PATH’inde Node/pnpm bulunmadı; kontroller oturumun mevcut Node.js 24 ve pnpm çalışma ortamıyla yürütüldü. Normal terminalden geliştirme için README’deki Node/pnpm kurulumu gerekir. Üretilmiş siteyi Python ile görüntüleme seçeneği de README’de bulunur.

## Yeniden çalıştırma

```sh
pnpm validate
```

Alt yol kontrolünde build ve çıktı kontrolüne **aynı** `SITE_URL` ve `BASE_PATH` ortam değişkenlerini geçirin. Örnek değerler `https://example.com` ve `/mebegu-web`. Normal yerel geliştirmede bu değişkenleri ayarlamak gerekmez.
