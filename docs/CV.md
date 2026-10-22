# Profesyonel sayfa ve yazdırılabilir CV

İngilizce `/professional/`, Türkçe `/tr/professional/`. Ortak bileşen `src/components/pages/ProfessionalPage.astro`, içerik `src/data/resume.ts`, ekran ve baskı stilleri `src/styles/professional.css` içindedir.

## İçerik ve tasarım kararları

- Kısa profil, deneyim, teknik yetkinlikler, eğitim ve diller. Bölümler gerçek içerik geldikçe açılır; `ready` durumunda boş bölümler gösterilmez.
- Tek sütunlu belge, belirgin başlıklar, gerçek HTML metni ve tutarlı tarih biçimi. Yetenek yüzdeleri, dekoratif grafikler ve fotoğraf eklenmedi. Bu tasarımın herhangi bir ATS ile uyumluluk garantisi yoktur.
- Deneyim ve eğitim kayıtları en yeniden eskiye girilir. Deneyim maddeleri yapılan iş, kullanılan yöntem ve doğrulanabilir sonuç üzerinden yazılır. Ölçüm yoksa sayı uydurulmaz.
- Web portföyü CV’den sonra gelir; her çalışma problem, kişisel katkı ve sonuç olarak anlatılır. Ayrıntılı vaka incelemeleri CV baskısına girmez.
- Başvuru için hedef role uygun deneyim ve kelimeler seçilir. Bir sayfa başlangıç hedefidir; ilgili deneyim uzunsa okunabilirlik korunarak ikinci sayfaya geçilebilir.
- Ülke ve başvuru kuralları farklılaşabilir. Fotoğraf konusunda Europass ile Harvard önerileri aynı değildir; bu sürüm fotoğrafsızdır.

Bu kararların dayanakları: [Harvard MCS](https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/) (somut anlatım, sonuçlar, ters kronoloji), [MIT CAPD](https://capd.mit.edu/resources/resumes/) (hedef role göre içerik, okunabilir ölçüler), [Berkeley School of Information](https://www.ischool.berkeley.edu/careers/guides/resume) (tek sütun ve tipografik hiyerarşi), [Europass](https://europass.europa.eu/en/create-europass-cv) (başvuruya uyarlama). Erişim: 22 Ekim 2026.

## İçeriği doldurma

`resume.ts` içinde yalnız isim ve yazılım geliştirici rolü doğrulanmıştır. Diğer alanlar `null` veya boş dizidir; bunlar gerçek kariyer iddiaları üretmez. `status: 'draft'` iken köşeli parantezli rehber alanlar ve belirgin taslak notu hem ekranda hem çıktıda görünür.

1. `summary`, `location`, `role` gibi metinleri `{ tr: '…', en: '…' }` olarak girin. Türkçe ve İngilizce deneyim ifadeleri aynı bilgileri aktarmalıdır.
2. `email`, `phone`, `linkedin`, `github`, `website` için gerçek değerleri ekleyin. `null` adresler sahte bağlantı oluşturmaz. Bunlar sosyal şeridin bağımsız, bilinçli olarak boş bırakılmış kayıtlarını değiştirmez.
3. `experience`: `role`, `organization`, `period`, isteğe bağlı `location`, `highlights`. `period` için iki dilde tutarlı ay/yıl aralığı; her katkı için kısa, somut bir madde yazın.
4. `skills`: her grupta iki dilde `label` ve gerçek teknoloji isimlerinden `skills` dizisi. `education`: `degree`, `institution`, `period`, isteğe bağlı `detail`. `languages`: dil ve seviye metinleri.
5. `work`: `title`, `context`, `contribution`, `outcome`, `technologies`, isteğe bağlı gerçek `url`. Gizli iş bilgilerini paylaşmayın; paylaşılabilir katkıyı anlatın.
6. İçeriği kontrol ettikten sonra `status: 'ready'` yapın. Taslak etiketleri kalkar. Tekrar build edin ve iki dilin baskı önizlemesini kontrol edin.

## Yazdırma

Sayfadaki **CV’yi yazdır / PDF** düğmesi tarayıcının yerel yazdırma penceresini açar. `Ctrl+P` / `Cmd+P` de aynı baskı stilini kullanır. JavaScript kapalıysa düğme gösterilmez, tarayıcıdan yazdırma çalışmaya devam eder. Yeni pencere, harici PDF servisi veya sunucu gerekmez.

`@media print` yalnız CV’yi bırakır; ortak üst bar, alt bilgi, sayfa kontrolleri ve portföy gizlenir. A4 dikey, üst/alt 14 mm ve yanlarda 16 mm boşluk; ana metin Arial 10,5 pt. Beyaz zemin ve koyu metin arka plan grafikleri kapalıyken de okunur. Sabit sayfa yüksekliği ve içerik kırpma yoktur. Başlıkların içerikten ayrılmasını ve kısa iş kayıtlarının bölünmesini azaltan sayfa kırılma kuralları vardır; sayfadan uzun bir kayıt gerektiğinde bölünebilir. Teknik temel: [MDN yazdırma stilleri](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Printing), [MDN @page](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@page).

PDF için hedefi **PDF olarak kaydet**, kâğıdı **A4**, ölçeği **%100** seçin. Tarayıcının kendi **üstbilgi ve altbilgilerini** kapatın; tarih/URL/sayfa numarası tarayıcı ayarıdır ve sayfa CSS’iyle her tarayıcıda kapatılamaz. İçerik arttığında daha küçük puntoya zorlamak yerine bölüm uzunluğunu düzenleyin.

## Doğrulama sınırı ve manuel kontrol

Bu değişiklik sırasında tarayıcı yüzeyi erişilebilir değildi. Build ve bağlantı kontrolleri gerçek tarayıcı PDF çıktısının görsel doğrulaması değildir; henüz oluşturulmuş ve doğrulanmış bir PDF dosyası sunulmuyor.

- İki dilde yazdırma önizlemesini açın; yalnız CV’nin kaldığını ve boş fazladan sayfa olmadığını kontrol edin.
- Uzun e-posta/URL, uzun şirket adı ve çok sayıda deneyimle satır taşması ve sayfa geçişlerini kontrol edin.
- PDF’te Türkçe harfleri ve metnin seçilip kopyalanabildiğini kontrol edin. Kopyalanan sıra isim → iletişim → profil → deneyim → yetkinlikler → eğitim → diller olmalı.
- JavaScript kapalıyken `Ctrl+P`, dar ekran ve siyah beyaz baskıyı ayrıca kontrol edin.
