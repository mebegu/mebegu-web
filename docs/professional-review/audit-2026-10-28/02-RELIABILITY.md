# Professional: işlev ve güvenilirlik incelemesi

28 Ekim 2026. Tasarım ve recruiter incelemesi tamamlandıktan sonra aynı ajan tarafından yürütüldü. Uygulamaya düzeltme yapılmadı. HEAD `d7c309a`; üretim build'i `http://127.0.0.1:4325` üzerinden gerçek headless Edge ile incelendi. Bu, production sunucusunun uptime, CDN, TLS veya gerçek kullanıcı performans raporu değildir.

## Sonuç

Temel içerik ve ana yollar çalışıyor. En belirgin arızalar ilk yüklemede değil, etkileşim durumlarının birlikte kullanımında. Yayın/build kontrolleri iyi bir temel sağlıyor; ancak görünüm, kaynak gizliliği ve yeni oracle kontrolleri henüz CI'da zorunlu bir bütün olarak çalışmıyor.

Kanıt: [ham test sonuçları](evidence/testing.json), [gerçek ziyaret akışı](evidence/recruiter.json), [üst üste açılan paneller](evidence/overlapping-panels.png), [Edge A4 çıktısı](evidence/print.pdf).

## Başarılı kontroller

| Kontrol | Gözlenen sonuç |
| --- | --- |
| EN/TR, 1280 / 768 / 390 / 360 / 320px | On ölçümde yatay sayfa taşması ve dışarı çıkan öğe bulunmadı. Contact açıkken ve 12 proje genişletilmişken de sınırlar korundu. Bu sonuç, panellerin birbirini örtmediği anlamına gelmez. |
| Proje seçimi | Yıldız seçimi tek önizlemeyi gösteriyor. View project ilgili ayrıntıyı açıyor, fragment'i değiştiriyor ve summary'ye odak veriyor. Geri gezinme denenen akışta açılışa dönüyor. |
| Expand all | On görünümün tamamında 12 proje açıldı. |
| Klavye | Proje yıldızı Enter ile seçilebildi. Ölçülen focus outline 2px sıcak vurgu renginde. Download sonrasındaki Tab, Print'e ulaşıyor. Bu tam ekran okuyucu veya bütün tab sırası sertifikası değil. |
| Dokunma alanı | Ölçülen harita bağlantı ve düğmeleri 44px yüksekliğinde. Contact ve Profile da 44px yüksekliğinde; genişlikleri daha dar. Görünür metnin küçük olması ile tıklama alanını ayrı değerlendirmek gerekiyor. |
| Yerel bağlantılar | Professional üzerindeki yedi benzersiz mutlak yerel hedef HTTP 200 döndü; eksik fragment hedefi bulunmadı. Uzak LinkedIn/GitHub hesaplarının erişilebilirliği test edilmedi; e-posta gönderilmedi. |
| Görseller | Kontrollü eager yükleme ve decode sonrasında 132 img öğesinde kırık görsel, bu kontrol sayfasında JS pageerror bulunmadı. Tekrarlanan logo/img öğeleri ayrı özgün dosyalar demek değil. |
| JavaScript kapalı | 12 proje HTML'de mevcut. Yıldız gerçek fragment hedefine gidiyor; kayıt otomatik açılmıyor, summary'ye fiziksel tıklama ile açılabiliyor. Profile, temiz sayfada fiziksel tıklama ile açıldı. |
| PDF indirme | Tarayıcı download işlemi tamamlandı, hata dönmedi; indirilen dosya üç sayfa ve üçünde de çıkarılabilir metin var. İlk sayfa görsel olarak incelendi. Diğer iki indirme sayfası metin açısından incelendi; görsel incelemesi yapılmadı. |
| Web baskısı | Edge A4, arka planlar kapalı: iki dolu sayfa. İki sayfa da görsel olarak incelendi; yalnız CV, siyah metin/beyaz zemin, araç çubuğu/sahne/proje eki yok. Print sonrasında disclosure durumları geri yüklendi. Native Windows print-dialog ayarları incelenmedi. |
| Kaynak ve gizlilik | check-public-cv.py her iki build rotasında tüm kaynak ifadeleri, 12 projeyi ve özel politikayı doğruladı. İndirilen PDF metninde aynı politikanın tam sözcük kontrolüyle yasak müşteri adı ve telefon öneki bulunmadı. Bu, dolaylı yeniden tanımlamanın imkânsız olduğu iddiası değil. |
| Çıktı bütünlüğü | check-output.mjs: 35 HTML, 1.365 yerel referans ve karşılıklı dil/canonical yolları doğrulandı. Önceki geliştirme adımının pnpm validate sonucu 33 başarılı testti; bu salt inceleme için tüm validate yeniden çalıştırılmadı. |

## Bulgular ve yeniden üretim

Öncelikler: P1 temel okuma/erişim sorunu, P2 davranış veya bakım kalitesi, P3 ikincil iyileştirme. Bunlar kesinti veya güvenlik açığı dereceleri değildir.

### T1 · P1 · Profile ve Contact birbirini kapatıyor

1. Professional'ı aç.
2. Contact'a tıkla.
3. Profile'a tıkla.

İkisi de açık kalıyor. Masaüstünde paneller yaklaşık 58.326px² alanda çakışıyor; iletişim paneli özetin metnini örtüyor. Aynı durum mobilde de gözlendi. Escape kapatmıyor. Native details için Escape zorunlu bir davranış değil; burada popup gibi göründükleri için kullanıcı beklentisini de karşılamıyorlar.

Kaynak: `ProfessionalPage.astro` Contact/Profile markup'ı ve `professional.css` mutlak konumlu paneller. Çözüm yönü: panel davranışını karşılıklı kapatma ile düzenlemek veya normal akışa almak. Görsel yaklaşımı owner ile seçilmeli. Bu, mevcut bounds oracle'ının kaçırdığı bir durum: her iki panel ekran içinde olsa da okunabilirlik bozuluyor.

### T2 · P2 · Filtre ve seçili proje çelişiyor

1. IoT Platforms yeteneğini seç.
2. CRM KG yıldızına tıkla.

IoT Platforms pressed kalıyor, ilişkili proje vurgusu IoT Platform'da kalıyor; önizleme ve aria-current ise CRM KG oluyor. Sonuç bozuk veri değil, tutarsız durum sunumu. `selectProject` önizleme/aria-current'i değiştiriyor ama filtre durumunu uzlaştırmıyor. Çözüm yönü: proje seçiminin filtreyi temizlemesi veya iki durumun bağımsızlığının açıkça tasarlanması.

### T3 · P2 · Dinamik önizleme değişiminin erişilebilir geri bildirimi zayıf

Proje seçildiğinde focus yıldızda kalıyor; panelde live region veya başka bir duyuru düzeni yok. aria-controls ve aria-current mevcut, fakat değişen içeriğin ekran okuyucuyla ne kadar anlaşılır olduğu doğrulanmadı. Bu, doğrulanmış bir WCAG ihlali veya ekran okuyucunun hiç çalışmadığı iddiası değil. Native ekran okuyucu testi yapılıp uygun duyuru/focus stratejisi seçilmeli.

### T4 · P2 · Web baskısının metni içerdiği ek hakkında yanlış beklenti oluşturuyor

Experience altındaki kaynak cümle, rollerin ve tam stack'lerin sonraki sayfalarda olduğunu söylüyor. Web baskısı projeleri dışladığı için iki sayfalık çıktıda bu bilgi gelmiyor. Basılı sayfalar görsel olarak düzgün olsa da bu ifade bağlam açısından yanlış. Kaynak-owned CV metni sessizce değiştirilmemeli; upstream web/print yönlendirme alanı veya uygun yayın varyantı gerekiyor.

### T5 · P2 · Oracle'lar henüz zorunlu CI kapısı değil

`.github/workflows/deploy.yml` mevcut test, içerik, Astro, build ve output kontrollerini çalıştırıyor. Yeni oracle test komutu, tarayıcı ölçümleri ve özel CV politika kontrolü workflow'a bağlı değil. AGENTS.md'de tanımlanmış olmaları CI güvencesi sağlamaz. Token maliyeti olmadan oracle unit testini CI'a almak mümkün; browser ve gizlilik kontrolü kapsamı ayrıca seçilmeli. Özel müşteri eşlemesini repoya koymak çözüm değildir.

Ayrıca mevcut geniş `visual-oracle.mjs` içinde `.projects-shell` gibi artık bu sayfada bulunmayan seçiciler var. Boş eşleşmenin `.every()` ile geçmesi bazı kontrolleri yanıltabilir. Genel oracle kullanılırken gerekli seçicilerin gerçekten eşleştiği doğrulanmalı. Gerçek mevcut proje bölümü `.professional-projects` / `#project-details`.

### T6 · P2 · Kaynak güncelleme sözleşmesi kırılgan

Professional bileşeni bazı proje/kanıt etiketlerini elle eşliyor ve beklenen Markdown hücre biçimlerini non-null varsayımlarıyla çözümlüyor. Upstream ad veya format değişikliği anlaşılır bir şema hatası yerine build hatasına dönüşebilir. Bu risk kaynak koddan çıkarımdır; protected kaynak değiştirilerek arıza üretilmedi. Kalıcı public ID ve açık ilişki alanları kaynakta sağlanmalı, şema hataları açıklayıcı olmalı.

### T7 · P3 · Sosyal paylaşım için bilinçli görsel yok

Başlık, açıklama, canonical ve EN/TR alternate var; og:image yok. Link paylaşımında sayfanın görsel kimliği için atanmış bir resim bulunmuyor. Platformun nasıl fallback üreteceği test edilmedi.

## Güvenilirlik sınırları

- Test ortamı yerel üretim build'i ve tek Chromium tabanlı tarayıcı. Safari, Firefox, gerçek dokunmatik cihaz ve native ekran okuyucu incelenmedi.
- Production deployment farkı, CDN/cache davranışı, TLS, uptime, hata oranı, yavaş ağ ve Core Web Vitals ölçülmedi. Yerel milisaniye değerlerini gerçek kullanıcı performansı diye sunmuyorum.
- Resource snapshot'ında yaklaşık 466KB encoded kaynak görüldü; oturum cache'i ve lazy loading nedeniyle bunu tam cold-load bütçesi saymıyorum. Ağ ve CPU profili olmadan performans notu verilmedi.
- JavaScript kapalıyken fragment sonrası Profile için otomasyonun stability kontrolü timeout verdi. Temiz sayfada fiziksel tıklama ve hedef projeyi elle açma çalıştı. Bu otomasyon sınırı kanıt olmadan “Profile bozuk” diye sınıflandırılmadı.
- İndirilen CV'nin ilk kontrolündeki substring eşleşmesi kısa bir token için yanlış pozitifti; politikanın tam sözcük sınırıyla kontrol edildiğinde sıfır eşleşme kaldı. Gizlilik sonucu bu son kontrole dayanıyor.

Bu inceleme temel görevlerde kullanılabilir bir sayfa gösteriyor; “sorunsuz” veya üretimde yüksek erişilebilirlik garantisi vermiyor. Öncelikle birleşik etkileşim durumları, ardından kaynak/yayın sözleşmesi ve CI kapsamı ele alınmalı.
