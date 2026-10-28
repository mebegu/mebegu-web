# Professional action items ve görevler

## Güncel ilerleme: onaylı 02 yönü

- A01 tamamlandı: Contact/Profile birbirini kapatıyor; Escape ve dış tıklama çalışıyor.
- D01/D02 yeniden kararlaştırıldı: minimal giriş, bağlantısız doğal küme ve tıklanınca kariyer bilgisi. Önceki üç-gerçek/özet wireframe'leri reddedilmişti.
- A02 tamamlandı: bağımsız yetenek filtresi kaldırıldı; tek yıldız seçimi tek bilgi alanını yönetiyor.
- A03'ün yerine onaylı minimal giriş uygulandı; A06 için odak bilgi başlığına taşınıyor ve Escape ile yıldızına dönüyor. Native ekran okuyucu testi hâlâ NOT CHECKED.
- Q01'in scope kontrolleri ve yeni kariyer-yıldızı regresyonları mevcut. Q02 CI bağlantısı henüz yapılmadı.
- A04'ün giriş kısayolları ve A05'in ilave görsel düzenlemeleri yeni onay olmadan uygulanmadı. S01–S03 ve V02/V03 açık.
- [Güncel uygulama ve kanıt](../natural-cluster/REVIEW.md). Sonuç owner'ın görsel değerlendirmesini bekliyor.

Aşağıdaki ilk görev tanımları tarihsel bağlamı korur; güncel owner kararıyla çatışan bilgi yoğunluğu önerileri uygulanmamalı.

Kaynak: [tasarım/recruiter incelemesi](01-DESIGN-RECRUITER.md) ve [test/güvenilirlik incelemesi](02-RELIABILITY.md).

Durum: ilk iş grubu başlatıldı. A01 tamamlandı; Q01'in eksik seçici kontrolü ve A01 regresyonu tamamlandı. A02 durum modeli testi tasarım kararından sonra yapılacak. İlk [wireframe alternatiflerinin](../decisions-2026-10-28/README.md) ikisi de reddedildi. D01–D03 ve A03–A05 aşağıda tarihsel öneriler olarak kalıyor; yeni minimal giriş yönüne göre yeniden tanımlanmalı. Owner'ın son tercihi, üç gerçeği veya tam özeti açılışa eklemek değil, çok daha az içerik ve organik bir yıldız kümesi. Ayrıntı PDF'den okunabilir; mevcut CV verisi henüz silinmeyecek. P1: ilk ele alınacak okuma/kullanım sorunları. P2: davranış, erişilebilirlik ve bakım. P3: ikincil iyileştirmeler. Bunlar güvenlik açığı dereceleri değildir.

Takımyıldızı korunur. CV metni ve üretilmiş veri elle değiştirilmez; müşteri eşlemesi gizli kalır. PDF ana eylem ve Print korunur. İçerik İngilizce, navigasyon iki dilde kalır. Mantıksal okuma sırası korunur. Görev listesi tasarım tercihlerinin onaylandığı anlamına gelmez.

## Önce netleştirilecek tasarım kararları

- [ ] **D01 · P1 · Açılıştaki bilgi önceliğini seç.** Rolün yanında hemen görünmesi gereken en fazla üç mevcut gerçek belirlensin. Öneri: deneyim yılı, Münih ve ekip liderliği kanıtı. Bunların mevcut kaynak ifadeleriyle sunulması değerlendirilsin; yeni kısa metin gerekiyorsa S01'e aktarılsın. **Çıktı:** seçilmiş bilgiler ve iki küçük masaüstü/mobil wireframe alternatifi; owner seçimi kaydedilmiş olmalı. Dayanak: D1, recruiter bulguları.
- [ ] **D02 · P1 · Haritanın kullanım modelini seç.** Yetenek vurgusu ve proje seçimi birlikte mi kalacak, daha sade bir proje keşif modeli mi kullanılacak? Sol/sağ etiket grupları ve seçili durumların anlamı netleştirilsin. **Çıktı:** tıklama → durum → önizleme davranışı kısa biçimde tanımlansın; owner seçimi alınsın. Dayanak: D2, T2.
- [ ] **D03 · P2 · Gövde ve görsel ritmini seç.** Bölüm kısayolları, teknoloji logolarının yoğunluğu ve temsili görsellerin hangi projelerde kullanılacağı tek bir küçük düzen önerisinde gösterilsin. Contact/Profile için daha büyük bir yerleşim değişikliği isteniyorsa burada gösterilsin. **Çıktı:** onaylı örnek bölüm ve görsel kullanım kuralı. Yeni resim üretimi varsayılan iş değildir. Dayanak: D3–D6.

Bu kararlar tek kısa tasarım turunda birlikte ele alınabilir. Her bileşen için ayrı prompt veya ayrı ajan gerekmez.

## Uygulama görevleri

### A01 · P1 · Contact/Profile çakışmasını gider

- [x] Mevcut kompozisyonu koruyan en küçük düzeltme olarak panellerin aynı anda metni örtememesini sağla.
- [x] Popup modeli korunuyorsa Escape ile kapanma ve uygun odağa dönüş davranışını tanımla; native disclosure ve JS-off erişimi koru.
- **Bağımlılık:** yok; daha büyük yerleşim değişikliği D03'e bağlıdır.
- **Kabul:** Contact → Profile ve ters sırada, klavye/touch ile, 390 ve 360px'de metin örtülmez. Etkin kontrol ve açık panel ilişkisi anlaşılır; kişi iletişim bağlantılarına ulaşabilir.
- **Dayanak:** T1. **Durum:** tamamlandı. EN/TR, dört genişlik; native JS-off exclusivity, Escape, dış tıklama ve print state regresyonu geçti.

### A02 · P2 · Harita durumlarını tutarlı yap

- [ ] D02'de seçilen modeli uygula; yetenek filtresi, related vurgusu, aria-pressed, aria-current ve görünen önizleme çelişmesin.
- [ ] İlişkisiz bir proje seçildiğinde önceki filtreye ne olacağını açıkça uygula; aynı yeteneğe ikinci tıklamayla temizleme yolunu koru veya seçilen modele göre değiştir.
- **Bağımlılık:** D02.
- **Kabul:** IoT Platforms → CRM KG, cloud → Battery Quality ve filtreyi temizleme akışlarında görünen durumlar tanımlanan modele uyar; tek önizleme görünür. JS-off yıldızlar gerçek hedefe gider.
- **Dayanak:** T2.

### A03 · P1 · Onaylı açılış hiyerarşisini uygula

- [ ] D01'de seçilen bilgileri takımyıldızı, küçük siluet ve ana PDF eylemi korunarak görünür yap.
- [ ] İsim/rol/bilgi hiyerarşisini ve mobil yazı ölçeğini düzelt; bilgi eklemek için okunabilirliği küçülterek feda etme.
- **Bağımlılık:** D01; yeni kaynak alanı gerekiyorsa S01.
- **Kabul:** 1280 ve 390px görüntülerinde seçilen bilgiler panel açmadan bulunabilir; 360px'de kırpılma yoktur. Owner gerçek görüntüleri değerlendirir. CV içeriği eksilmez.
- **Dayanak:** D1, D4, recruiter ilk izlenimi.

### A04 · P2 · Proje kanıtına ve bölümlere erişimi hızlandır

- [ ] Onaylı, küçük bir bölüm erişim düzeni ekle; Experience, Project Details ve Skills gibi hedefleri erişilir kıl.
- [ ] Doğru anchor offset, klavye odağı, proje açılması ve geri dönüş davranışını koru.
- **Bağımlılık:** D03.
- **Kabul:** ziyaretçi ilk bölümden tüm CV'yi kaydırmadan deneyime ve proje listesine ulaşabilir. Mantıksal HTML okuma sırası değiştirilmez; sticky toolbar hedef başlığını örtmez.
- **Dayanak:** D3, recruiter proje listesine erişim bulgusu.

### A05 · P2 · Logo ve illüstrasyon yoğunluğunu düzenle

- [ ] D03'te seçilen kurala göre logo zeminlerini, tekrarları ve resim yerleşimini sakinleştir.
- [ ] Teknoloji adlarını gerçek metin olarak koru; temsili görsellerin niteliği açık kalsın.
- **Bağımlılık:** D03.
- **Kabul:** teknoloji ve katkı metni görsellerden önce taranabilir; logo azaltımı metin veya kaynak bilgisini silmez. Mobil ve JS-off içerik kaybı yoktur. Yeni görseller gerekiyorsa önce örnek owner'a gösterilir.
- **Dayanak:** D5, D6.

### A06 · P2 · Önizlemenin erişilebilir geri bildirimini doğrula

- [ ] Seçili proje değişimini native ekran okuyucu ve klavyeyle dene; eksik geri bildirimi kanıtla.
- [ ] Gerekiyorsa kısa duyuru veya uygun focus stratejisini uygula; tüm proje metnini tekrar tekrar okutma.
- **Bağımlılık:** A02; teşhis daha önce yapılabilir.
- **Kabul:** kullanıcı değişen projenin hangisi olduğunu ve detayına nasıl ulaşacağını anlayabilir; gereksiz focus sıçraması yoktur. Kullanılan ekran okuyucu ve sonuç kaydedilir; araç yoksa NOT CHECKED kalır.
- **Dayanak:** T3; henüz doğrulanmış WCAG ihlali değildir.

## Kaynak repo ve yayın sözleşmesi

### S01 · P2 · Gerekli public kaynak alanlarını tanımla

- [ ] Kalıcı public proje ID'leri ve highlight → project ilişkilerini career-docs kaynağında tanımla.
- [ ] D01 gerektiriyorsa onaylı kısa profil/öne çıkan gerçek alanlarını ekle. Sektör tanımları kullanılacaksa yalnız doğrulanmış, anonim public etiketler sağla.
- [ ] İş arama durumu/tercih edilen rol bilgisi yalnız owner istiyorsa kaynakta tanımlansın; zorunlu kapsam değildir.
- **Bağımlılık:** içerik kararları owner'dan; kaynak değişikliği kaynak repoda yapılır.
- **Kabul:** üretilmiş site dosyaları elle düzenlenmez; özel müşteri eşlemesi public veri veya Git'e girmez; kaynak revizyonu kaydedilir.
- **Dayanak:** T6, D1, recruiter içerik doğallığı.

### S02 · P2 · Web/print yönlendirmesini kaynakta düzelt

- [ ] “Sonraki sayfalarda proje detayları” ifadesi için web ve print bağlamına uygun kaynak alanı/yayın varyantı sağla; ardından normal import sürecini kullan.
- **Bağımlılık:** upstream kaynak değişikliği.
- **Kabul:** web baskısı içermediği bir eki vaat etmez; indirilen tam PDF'nin anlatımı kendi içeriğiyle tutarlıdır. Korunan metin yerelde sessizce değiştirilmez.
- **Dayanak:** T4.

### S03 · P2 · Import/şema hatalarını anlaşılır hale getir

- [ ] Kaynak alanları, ID'ler ve ilişkiler için doğrulama ekle; sunum kodundaki kırılgan etiket eşlemelerini azalt.
- [ ] Eksik ilişki ve hatalı format senaryolarını küçük, anonim fixture'larla test et.
- **Bağımlılık:** S01'in ID/ilişki sözleşmesi.
- **Kabul:** eksik proje veya bozuk kayıt, hangi alanın hatalı olduğunu söyleyen bir hata üretir; içerik sessizce kaybolmaz. Testler gerçek protected CV verisini değiştirmez.
- **Dayanak:** T6; mevcut risk kod incelemesine dayanır.

## Oracle ve CI görevleri

### Q01 · P1 · Oracle'ın yanlış PASS ihtimalini kapat

- [x] Eski `.projects-shell` seçicilerini gerçek bölümle eşleştir; gerekli scope/selector bulunmadığında kontrolü başarısız yap.
- [ ] A01 ve A02'nin birleşik etkileşim durumlarını küçük regresyon senaryolarına ekle. Boş NodeList, başarılı bir kontrol sayılmasın.
- **Bağımlılık:** selector düzeltmesi yok; yeni davranış beklentileri A01/A02 ile netleşir.
- **Kabul:** eksik bölüm, çakışan paneller ve çelişen seçim fixture'ları FAIL verir; sağlıklı örnek PASS verir. Otomatik PASS, görsel veya owner onayına dönüşmez.
- **Dayanak:** T1, T2, T5.

### Q02 · P2 · Ucuz kontrolleri CI'a bağla

- [ ] Oracle unit testlerini deploy workflow'una ekle.
- [ ] Browser smoke ve CV gizlilik kontrolünün tetikleme kapsamını tanımla; özel politika için güvenli erişim veya kaynak tarafı doğrulama yaklaşımını seç.
- **Bağımlılık:** unit test adımı yok; browser Q01'e, gizlilik adımı politika erişim kararına bağlıdır.
- **Kabul:** zorunlu kontrol başarısızsa yayın ilerlemez. Ayrı LLM çağrısı yoktur; rutin değişiklikte tüm site screenshot'ları üretilmez. Gizli eşlemeler repoya veya CI log'una yazılmaz.
- **Dayanak:** T5. Agent talimatı ile gerçekten çalışan CI kontrolü ayrı raporlanır.

## Doğrulama ve sonraki işler

### V01 · P2 · Değişikliklerin son kontrolünü yap

- [ ] EN/TR: 1280, 768, 390, 360px ölçümleri; önceki 320px kontrolünü de regresyon için koru.
- [ ] İki varsayılan görüntü: masaüstü ve mobil. Ek görüntü yalnız değişen durum/arıza için.
- [ ] Recruiter yolculuğu: ana sayfa → Professional → kanıt → iletişim/PDF. Klavye, JS-off ve reduced-motion ilgili yolları.
- [ ] `pnpm validate`, kaynak/gizlilik kontrolü; print etkilenmişse A4'ün bütün sayfaları. İndirilen PDF'nin önceki incelemede görsel olarak bakılmayan 2–3. sayfalarını da tamamla.
- **Bağımlılık:** ilgili uygulama işleri tamamlandıktan sonra.
- **Kabul:** otomatik, ajan görsel değerlendirmesi ve owner onayı ayrı kaydedilir. Eksik testler NOT CHECKED kalır; rapor güncel değişikliklere ait olur.

### V02 · P3 · Tarayıcı ve canlı ortam kapsamını tamamla

- [ ] Firefox/Safari ve gerçek mobil cihazda temel yolculuğu dene; yavaş ağda ilk yüklemeyi ölç.
- [ ] Yayın sonrası gerçek sürümü, PDF adresini, HTTPS ve cache davranışını kontrol et. Uptime takibi gerekiyorsa sıklık ve sağlayıcıyı ayrıca seç.
- **Bağımlılık:** araç/cihaz erişimi; canlı kontroller için yetkilendirilmiş yayın. Bu görev publish/push izni değildir.
- **Kabul:** ölçüm ortamı ve sınırları açık; yerel değerler production Core Web Vitals diye sunulmaz. Yeni ücretli servis kendiliğinden eklenmez.

### V03 · P3 · Sosyal paylaşım görselini belirle

- [ ] Mevcut onaylı sanat dilinden uygun paylaşım görseli seç ve og:image metadata'sını ekle.
- **Bağımlılık:** owner görsel seçimi.
- **Kabul:** public mutlak URL, erişilebilir dosya ve uygun metadata; özel bilgi yok. Platform önizlemesi gerçekten denenmediyse denenmiş gibi raporlanmaz.
- **Dayanak:** T7.

## Önerilen çalışma sırası

1. A01 ve Q01'in hazır kısımları: çakışma ve güvenilmez kontrol sonuçları.
2. D01–D03: tek kısa wireframe/karar turu.
3. A02–A06: onaylı modelin uygulanması; S01/S02 gereken yerlerde kaynak bağımlılığı çözülür.
4. S03 ve Q02: veri sözleşmesi ve ucuz CI güvenceleri.
5. V01: son doğrulama ve owner incelemesi. V02/V03 ayrı takip işleri olabilir.

Varsayılan uygulama: tek ajan, sırayla ve küçük iş gruplarıyla. Her görev için ayrı prompt veya ayrı rapor gerekmez; ID, durum, kısa sonuç ve kanıt yeterlidir.
