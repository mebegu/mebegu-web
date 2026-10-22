# Profesyonel sayfa ve yazdırılabilir CV

İngilizce `/professional/`, Türkçe `/tr/professional/`. Ortak bileşen `src/components/pages/ProfessionalPage.astro`, içerik `src/data/resume.ts`, ekran ve baskı stilleri `src/styles/professional.css` içindedir.

## İçerik ve tasarım kararları

- Kısa profil, deneyim, teknik yetkinlikler, eğitim ve diller. Güncel CV’den alınan içerik, kullanıcının tercihiyle yalnız İngilizce sunulur.
- Tek sütunlu belge, belirgin başlıklar, gerçek HTML metni ve tutarlı tarih biçimi. Yetenek yüzdeleri, dekoratif grafikler ve fotoğraf eklenmedi. Bu tasarımın herhangi bir ATS ile uyumluluk garantisi yoktur.
- Deneyim ve eğitim kayıtları en yeniden eskiye girilir. Deneyim maddeleri yapılan iş, kullanılan yöntem ve doğrulanabilir sonuç üzerinden yazılır. Ölçüm yoksa sayı uydurulmaz.
- Web portföyü CV’den sonra gelir; her çalışma problem, kişisel katkı ve sonuç olarak anlatılır. Ayrıntılı vaka incelemeleri CV baskısına girmez.
- Başvuru için hedef role uygun deneyim ve kelimeler seçilir. Bir sayfa başlangıç hedefidir; ilgili deneyim uzunsa okunabilirlik korunarak ikinci sayfaya geçilebilir.
- Ülke ve başvuru kuralları farklılaşabilir. Fotoğraf konusunda Europass ile Harvard önerileri aynı değildir; bu sürüm fotoğrafsızdır.

Bu kararların dayanakları: [Harvard MCS](https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/) (somut anlatım, sonuçlar, ters kronoloji), [MIT CAPD](https://capd.mit.edu/resources/resumes/) (hedef role göre içerik, okunabilir ölçüler), [Berkeley School of Information](https://www.ischool.berkeley.edu/careers/guides/resume) (tek sütun ve tipografik hiyerarşi), [Europass](https://europass.europa.eu/en/create-europass-cv) (başvuruya uyarlama). Erişim: 22 Ekim 2026.

## İçeriği doldurma

22 Ekim 2026’da kullanıcı tarafından verilen güncel CV (`mehmetgurcay_cv_.pdf`) üzerinden profil, üç iş deneyimi, teknik yetkinlikler, iki eğitim ve diller eklendi. Eski belge (`mehmetgurcaycv (14).pdf`) portföy ayrıntılarını tamamlar. Kullanıcının tercihiyle **CV ve portföy yalnız İngilizcedir; çevrilmez**. Türkçe rotalarda ortak gezinme Türkçe kalır, içerik kapsayıcısında `lang="en"` bulunur.

1. `resume.ts` İngilizce metinler kullanır: `summary`, `role`, `experience`, `skills`, `education`, `languages`. Boş CV şablonu kaldırıldı.
2. `portfolio.ts` on bir projenin ortak kaynağıdır. `resume.work` bunlardan altısını profesyonel sayfada gösterir; `projects.ts` tamamını Projects vitrinine taşır. Aynı projeyi iki yerde ayrı ayrı düzenlemeyin.
3. Her portföy kaydı `context`, `contribution`, `outcome`, `technologies` ve `organization` içerir. `period` varsa kaynak belgedeki süredir; takvim tarihi tahmin edilmez.
4. E-posta, şehir ve önceden bilinen GitHub adresi kullanılır. Tam sokak adresi, telefon ve kaynak PDF dosyaları public dizine/repo içeriğine eklenmedi. Sosyal şeridin placeholder kayıtları korunur.
5. Gerçek proje görselleri ve demo/kod adresleri henüz yoktur. Görseller açıkça temsili olarak etiketlenir; var olmayan bağlantılar gösterilmez. İlk portföy sürümü bir içerik iskeletidir.
6. Kaynak öncelikleri, dışarıda bırakılan eski aktiviteler ve sonraki düzenlemeler için [CV-IMPORT.md](CV-IMPORT.md) dosyasına bakın. Güncel tarihler ve kişisel tanıtım metni son kullanıcı incelemesinden geçirilebilir.

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
