# Doğrulama

## Alamori aynası hızlı fade-in — 23 Ekim 2026

- Bir anda beliren başlangıç örtüsü kaldırıldı. Ayna ilk açılışta ve yeniden oynatmada sıfır opaklıktan 240 ms içinde belirir; toplam 4,4 saniyelik geçiş değişmez.
- İzole Chrome: otomatik açılışta kademeli opaklık kareleri ve yaklaşık 240 ms fade-in doğrulandı; mobil yeniden oynatma sıfır opaklıkla başlar. Fade sırasında atlama odağı geri yükler; azaltılmış hareket doğrudan sayfayı açar. JavaScript modülü engellenirse sayfa görünür kalır. Çalışma zamanı hatası yok.
- Astro check 82 dosyada sıfır hata/uyarı/ipucu; üretim çıktısı 35 HTML / 1027 yerel referans kontrolünü geçti.

## Alamori metin ve Blog temizliği — 23 Ekim 2026

- Kaynak yayın revizyonu 3, `articles: []` ile iki üretilmiş yazıyı ve iki çevirisini importer üzerinden kaldırdı. Kaynağa gerçek ve yazar onaylı yazı olmadan örnek Blog metni üretilmemesi kuralı eklendi. Webdeki başlıklar, PDF yönlendirmeleri, tanıtım ve iletişim metni sadeleştirildi; slogan ve hayali yazım günlüğü kaldırıldı.
- Blog testleri kendi açık fixture kayıtlarını kullanır. Yeni revizyonda makale listesi boşaltıldığında dört sahiplik işaretli dosyanın silindiği doğrulandı; sayfa tipi boş makale listesini destekler. 28 test geçti. Astro: 82 dosyada sıfır hata/uyarı/ipucu. Build: 35 HTML / 1027 yerel referans; PDF, içerik ve eski Blog bütünlük kontrolleri geçti.
- İzole Chrome TR 320 / EN 1280: kitap ve Blog listelerinde üretilmiş yazılar ve bağlantıları yok; boş Blog bölümü gösterilmiyor, iki PDF bağlantısı korunuyor, yatay taşma ve çalışma zamanı hatası yok.
- `work/wireframes/alamori-borderless.html` iki öneri içerir: Künye ve Metin akışı. Gerçek kapak ve mevcut public PDF bağlantıları kullanılır. Mobil/masaüstü düzenleri incelendi. Bu öneriler canlı yerleşime uygulanmadı; mevcut ayna açılışı korundu.

## Alamori buzlu ayna düzeltmesi — 23 Ekim 2026

- Oda ve orman sahneleri, iki görsel preload'u ve yaklaşık 406 kB giriş medyası kaldırıldı. Gerçek sayfanın üzerinde CSS buzlu cam, üç sıraya hizalanan soyut altın işaretler, merkezde spiral ve ince çizgiye çekilip doğrudan sayfayı açan geçiş var. Kamera API'si veya izin isteği yok; özel bölüm metinleri public dosyalara eklenmedi.
- İzole Chrome EN 1280, TR 320/390: cam/hizalanma/spiral/sıkışma kareleri incelendi. Otomatik bitiş, yeniden oynatma, gerçek Tab/Escape, atlama, odak/inert/scroll geri yükleme, yatay taşma olmaması ve giriş sahnesi indirilmemesi doğrulandı. Kamera çağrısını hata veren bir stub ile devre dışı bırakan koşuda da geçiş tamamlandı. Çalışma zamanı hatası yok.
- Azaltılmış hareket, oynatma sırasında tercih değişikliği, PDF hash bağlantısı, geri navigasyon, JavaScript kapalı ve script engelli durumlar geçti. Modül yüklenmezse başlangıç örtüsü 1,8 saniyede kalkıyor.
- 28/28 test, Astro check 82 dosyada sıfır hata/uyarı/ipucu; build 39 HTML / 1137 yerel referans. PDF/Blog ve yayın bütünlüğü kontrolleri geçti. Aşağıdaki oda/orman kaydı önceki sürümü anlatır.

## Alamori aynadan geçiş açılışı — 23 Ekim 2026

- Kitap sayfasının normal açılışına 4,4 saniyelik sessiz bir geçiş eklendi: kehribar ışıklı çalışma odası, aynada üç sıraya hizalanan soyut işaretler, odanın ince bir çizgiye sıkışması, kısa karanlık ve durgun sisli orman. İki yeni imagegen sahnesi toplam yaklaşık 406 kB WebP olarak servis edilir; ham görseller ve tam promptlar ayrıca kayıtlıdır. Özel bölüm metinleri kopyalanmadı.
- İzole Chrome’da EN 1280 ve TR 320/390 piksel: sahne kareleri görsel olarak incelendi; otomatik bitiş, yeniden oynatma, gerçek Tab/Escape, atlama düğmesi, odak/scroll/inert geri yükleme ve yatay taşma olmaması doğrulandı. Canvas tamponu bitişte bırakılıyor; arka planda süren animasyon yok.
- Azaltılmış hareket, doğrudan `#preview`, geri navigasyon ve JavaScript kapalı durumunda kitap doğrudan kullanılabiliyor. Görsel engelleme ve modül engelleme sayfayı kapalı bırakmıyor; modül hatasında başlangıç örtüsü 1,8 saniyede kalkıyor. Oynatma sırasında hareket tercihi değişimi de anında çıkıyor. Çalışma zamanı hatası yok.
- Testler 28/28, Astro check 82 dosyada sıfır hata/uyarı/ipucu. Üretim çıktısı 39 HTML / 1141 yerel referans; Alamori revizyon 2 PDF/Blog bütünlüğü ve eski blog kontrolleri geçti. [Uygulama ayrıntıları](ALAMORI-ENTRY.md).

## Alamori kitap vitrini ve kaynak kontrollü yayın — 23 Ekim 2026

- Eski pasif şablon; gerçek kapak, spoiler içermeyen tanıtım, yazım durumu, iki dilde ilk 20 sayfalık PDF, güncellemeler, yol haritası, iki Blog yazısı ve gerçek okur iletişim bağlantısıyla değiştirildi. Para toplama veya backend formu yok.
- İçerik şeması bilinmeyen alanları reddeder; importer yalnız seçili public JSON, referanslı kapak/PDF ve sahiplik işaretli Blog metinlerini yazar. Private depo URL'si, kaynak dosyalar veya commit kimliği public snapshot'a eklenmedi. Normal kitap düzeninden üretilen önizlemeler yeni PDF belgesine yalnız ilk 20 sayfa alınarak temizlendi; kaynak metadata, notlar, ekler ve belge yapıları taşınmadı.
- Kaynakta yalnız manuel çalışan, 20 sayfa varsayılanlı yayın işi ve web reposuna özel deploy key bağlantısı hazırlandı. Kaynak testleri; seçilmeyen sayfa/ek/metadata sentinel'lerinin taşınmadığını, sayfa sınırlarını ve deterministik PDF temizlemeyi doğruladı. Her iki PDF'in kapak, iç sayfa ve 20. sayfası render edilip incelendi.
- Web testleri: 28/28. Astro: 78 dosyada sıfır hata/uyarı/ipucu. Çıktı: 39 HTML / 1135 yerel referans; eski blog metni ve banner kontrolleri geçti. Public snapshot, dört hash'li varlık ve dört üretilmiş Blog dosyası doğrulandı.
- İzole Chrome: TR 320/390 ve EN 1280 pikselde kapak yükleniyor, iki gerçek PDF indirme ve iki ilgili Blog hedefi açılıyor; üç yol haritası durumu, sayfa içi navigasyon, boş/fake form bulunmaması ve yatay taşma olmaması doğrulandı. Çalışma zamanı hatası yok.

## Cep Arşivi ve görsel önizlemeli galeri — 23 Ekim 2026

- Empty Page ve boş beyaz medya kaldırıldı. Tek proje artık çalışan Cep Arşivi: bağlantı/not/etiket ekleme, metin araması, okunacak/okunmuş filtreleri, okuma durumu, kaldırma, yerel tarayıcı kaydı ve JSON indirme içerir. İki dilde araç sayfası ve ilgili yapım yazısı vardır; proje metinleri bu işlevleri ve mevcut sınırlarını anlatır.
- İki yeni illüstrasyon yerleşik imagegen ile üretildi; kaynaklar `examples/workshop/media/`, tam promptlar `docs/assets/workshop-images.json` altında. Gerçek uygulama ekranı ve arama/filtre kullanım kaydı GIF/MP4 olarak alındı. Yedi referanslı varlık gerçek importer ile `pocket-archive.json` kaydına aktarıldı; tekrar aktarım `unchanged` döndü.
- Galerinin yazılı seçimleri beş küçük görsel önizlemesine dönüştü. Erişilebilir ad, seçili durum, klavye odağı ve GIF/video için durağan poster ile oynatma simgesi korunur. Önizlemeler kendiliğinden oynatılmaz.
- İzole headless Chrome: ekleme, güvenli metin gösterimi, okundu işaretleme, sayfa yenilemesinde kalıcılık, kaldırma ve gerçek JSON dışa aktarma doğrulandı. TR 320/390 ve EN 1280 pikselde araç ve galeri taşmıyor. Beş sekme, beş thumbnail, üç medya türü, dört katılım bağlantısı, GIF başlatma/durdurma, MP4 oynatma ve medya değişiminde durma kontrolleri geçti; çalışma zamanı hatası yok.
- Astro check: 75 dosyada sıfır hata/uyarı/ipucu. Testler: 24/24. Yayın ve medya bütünlüğü: 1 kayıt. Build: 35 HTML / 1015 yerel referans; eski blog yazılarının metin, tarih, görsel ve çeviri kontrolleri geçti.
- Değişiklikler yereldir; canlı GitHub yayını yapılmadı. Aşağıdaki Empty Page notları önceki aşamanın kaydıdır.

## Tek JSON örneği: Empty Page — 23 Ekim 2026

- Yedi temsili proje ve bunlara ait statik görseller kaldırıldı. Atölye yalnız JSON yayın kayıtlarını okur; tek kayıt tam alanlı `empty-page.json` dosyasıdır.
- `examples/workshop/project.json` tüm proje alanlarını doldurur. PNG, GIF, MP4 ve iki VTT dosyası gerçek yerel importer üzerinden hash’li hedeflere aktarıldı; aynı paket tekrar çalıştırıldığında `unchanged` döndü. Kopyalanabilir kaynak şablonunda yayın kapalı kalır.
- İki dilde boş sayfa deneyi, çalışan proje/blog bağlantıları, üç yol haritası durumu ve dört katılım kanalı vardır. Blog bağlantısı yazı listesine gider; ayrı bir yapım yazısı yayımlandığı iddia edilmez.
- Astro check: 74 dosya, sıfır hata/uyarı/ipucu. Importer/API testleri: 11/11 geçti. Yayın/medya bütünlüğü: 1 kayıt doğrulandı. Üretim çıktısı: 33 HTML / 951 yerel referans; mevcut blog içerik kontrolleri geçti.
- İzole headless Chrome’da TR 320/390 ve EN 1280 piksel: tek kayıt, beş sekme, üç medya türü, dört katılım bağlantısı, GIF başlatma/durdurma, gerçek yerel MP4 oynatma, iki altyazı ve panel değişiminde durdurma doğrulandı. Yatay taşma ve çalışma zamanı hatası yok.
- Canlı GitHub yayını yapılmadı. Aşağıdaki eski doğrulama notları önceki aşamaları kaydeder; güncel örnek sayısı birdir.

## Private projeden public Atölye yayını — 23 Ekim 2026

- Ortak `publish-workshop.yml` workflow'u, public manifest şeması, yalnız referanslı medya aktaran importer, atomik Git Database API publisher ve başka projeye verilecek bağlantı promptu eklendi. Kimlik yöntemi olarak hedef repo ile sınırlı fine-grained PAT veya kısa ömürlü GitHub App token'ı desteklenir. Bu oturumda canlı secret/App oluşturulmadı ve uzak repoya yayın yapılmadı.
- 11 yeni aktarım testi geçti: public kapsam, bilinmeyen alanlar/hatalı yerelleştirme/tarih/URL, dosya sınırları, symlink/junction reddi, dry-run, tekrar/eski/çakışan revizyon, bozuk medya özeti, yalnız public Git commit'i, eşzamanlı güncelleme ve izin hataları. Gerçek GitHub API çağrıları yerine yerel API simülasyonu kullanıldı.
- Mevcut 13 banner testiyle toplam **24 test**, sıfır başarısız/atlanan test. Astro/TypeScript: **71 kaynak dosyası**, sıfır hata/uyarı/ipucu. Format ve Git whitespace kontrolü geçti.
- Geçici bir public proje paketi gerçek importer ile siteye aktarıldı. İki dilde gerçek Astro çıktısında proje kaydı, hash'li medya yolu, yayın bağlantısı ve temsili örneklerin gizlenmesi doğrulandı; 31 HTML / 893 yerel referans kontrolü geçti. Geçici kayıt ve medyası kaldırılıp normal build geri üretildi.
- Son normal çıktı: **31 HTML / 909 yerel referans**. Özgün blog metinleri, çeviriler ve banner kontrolleri geçti. Gerçek yayın kaydı henüz yok; örnekler gösterilmeye devam eder. Gerçek hesapta uçtan uca yayın, entegrasyon hedef `main`'e gönderilip kaynak projede App/PAT ayarı yapıldığında denenmelidir.

## Atölye workbench — 23 Ekim 2026

- Atölye iki dilde workbench düzenine geçti. Tür ve durum bağımsız; uygulama, araç, kütüphane, oyun ve deneyler için yedi açıkça işaretlenmiş örnek kayıt var. Medya, yayın bağlantıları, güncel çalışma odağı, güncellemeler, yol haritası, blog yazıları ve katılım kanalları ayrı alanlar.
- Astro kontrolü: 65 kaynak dosyada sıfır hata/uyarı/ipucu. Üretim build'i 31 sayfa üretir. Kök dağıtımda 909 yerel referans, karşılıklı dil/canonical bağlantıları ve özgün blog gövdeleri kontrol edildi; 13 mevcut banner testi geçti.
- Ayrı profilli headless Chrome'da Türkçe 320/390 px ve İngilizce 1280 px görünümleri incelendi. Tür/durum/arama birleşimi, Türkçe büyük-küçük harf araması, boş sonuç/sıfırlama, proje seçimi, ekran görüntüsü galerisi, sekmelerin klavye kullanımı, arşiv/deep link ve mobil açma/kapama geçti. Yatay taşma veya tarayıcı çalışma zamanı istisnası görülmedi. Azaltılmış hareket tercihiyle de çalıştırıldı.
- Mobil ilk görünümde paneller kapalı; ziyaretçi listeyi tarayıp istediği projeyi açabilir. JavaScript devre dışıyken yedi projenin tüm içerikleri okunur. 22 kayıtlık geçici tarayıcı örneğinde ilk sekizden sonraki doğrudan proje bağlantısı ve bunu izleyen “diğer projeleri göster” adımı doğrulandı; yinelenen HTML id'si yok.
- `/mebegu-web/` alt yolunda **Atölye'nin iki sayfasındaki** yerel bağlantı, medya, stil ve script hedefleri doğru öneki kullanıp mevcut dosyalara çözümlendi. Site geneli alt yol kontrolü, değiştirilmemiş eski seçim analizi yazısındaki `/media/weebly/1407690500-d98b1cb07d.png` adresinde takılır. Özgün blog metinleri korunmuş, bu bağımsız sorun bu kapsamda değiştirilmemiştir. Son `dist/` çıktısı kök dağıtım için üretildi.
- Gerçek proje, mağaza, blog ilişkisi ve katılım adresleri henüz sağlanmadı; örneklerde sahte aktif bağlantı yok. GIF/video oynatma desteği mevcut, fakat gerçek proje GIF/video dosyaları ve servis gönderim akışları doğrulanmış değildir. Geri bildirim ve özellik istekleri yapılandırılacak dış kanallara yönlenir; backend/form gönderimi eklenmedi. Headless görünüm kontrolü fiziksel cihaz testi değildir.

## Banner'a özel görseller — 22 Ekim 2026

- Dört öne çıkan yazı için ayrı geniş (1774 × 887) ve mobil (1024 × 1536) kompozisyonlar eklendi. Üçer boyda toplam 24 WebP dosyasının gerçek ölçüleri çözümlenerek doğrulandı; dosyalar büyütülmedi. Dört sahne, dört farklı alan ölçüsünde kadraj tanı görseliyle incelendi. Üretim ve dosya kaydı [BLOG-BANNERS.md](BLOG-BANNERS.md) içindedir.
- `pnpm validate` geçti: 13 carousel testi; 61 kaynak dosyada sıfır hata/uyarı/ipucu; 31 HTML ve 883 yerel referans. Yeni `srcset` kontrolleri her varyantın dosyasını doğrular. Yayın kontrolü iki katalogda dört bağımsız banner setini, eski kart kapaklarını ve sekiz özgün gövdenin değişmediğini de denetler.
- Gerçek tarayıcı envanteri boş olduğundan bu kadraj incelemesi tarayıcı ekran görüntüsü veya fiziksel cihaz doğrulaması değildir. Swipe kodu ve süreleri değiştirilmedi.

## Weebly yazılarının kataloğa alınması — 22 Ekim 2026

- Sekiz özgün yazı ve altı ayrı İngilizce çeviri yayımlanır. İki katalogda sekiz kart, dört gerçek yazılık banner, üç içerik rafı ve kaynak görseller kullanılır. Özgün başlıklar ve gövdeler değişmedi; gövde SHA-256 değerleri yayın kaydıyla doğrulandı. Kısa iki dilli özetler ayrı katalog metaverisidir.
- Ekrandaki tarihler kaynakta görünen takvim gününü kullanır; seçim analizi 10 Ağustos 2014 gösterir, özgün 11 Ağustos RSS zamanı metaveride korunur. Çeviriler yayın gününü değiştirmez; dil düğmeleri ve karşılıklı hreflang kontrol edildi.
- Kullanıcı isteğiyle Berkin Elvan yazısı dışarıda bırakıldı; ilgili özgün/çeviri route’ları üretilmez ve katalogda yer almaz. Arşiv taslağı değişmeden korunur.
- RSS route’ları, HTML keşif/footer bağlantıları ve `@astrojs/rss` bağımlılığı kaldırıldı. Çıktı kontrolü artık feed bulunmadığını doğrular. Eski 24 örnek yazı sayfası da gerçek yazılarla yer değiştirdi.
- Node 24/pnpm ile 13 banner testi, Astro kontrolü (60 kaynak dosyada sıfır hata/uyarı/ipucu), build (31 HTML), 835 yerel referans ve özel yayın kontrolleri geçti. Yayın kontrolü özgün gövdeleri, sekiz kapak dosyasını, altı çevirinin görsel/ek/kaynak bağlantılarını, tarihleri ve dışlanan yazıyı kapsar. Yerel kurulumdaki eski bağımlılık ağacını değiştirmeden kontrol çalıştırmak için bu oturumda pnpm’in `verify-deps-before-run=false` seçeneği kullanıldı; CI temiz lockfile kurulumu yapar.
- Tarayıcı envanteri yine boş (`apps: [], browsers: []`); gerçek masaüstü/mobil kırpma, kart metinlerinin görsel yerleşimi ve fiziksel swipe hissi burada doğrulanamadı. Kaynak kapaklar görsel olarak incelendi. Aşağıdaki eski kayıtların RSS/prototip açıklamaları önceki sürümlere aittir.

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
