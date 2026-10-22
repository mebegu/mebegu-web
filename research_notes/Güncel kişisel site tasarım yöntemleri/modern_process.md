# Küçük kişisel site için güncel tasarım ve üretim yöntemi

Araştırma tarihi: 22 Ekim 2026. Kaynaklar yaratıcılara ait yeniden tasarım yazıları ve birincil web standardı belgeleridir. Aşağıdaki süreç önerileri çıkarımdır; bütün kişisel siteler için deneyle kanıtlanmış tek bir reçete olduğu iddia edilmez.

## 1. Güncel görünmek için nereden başlamalı?

### Takeaway
Önce kişinin kimliği ve gerçek içerik; sonra tipografi, kompozisyon ve tek bir ayırt edici ayrıntı. Güncel teknoloji kullanmak ile o yılın görsel modasını kopyalamak ayrı kararlardır.

### Cited Findings
- James Zhan, Haziran 2026 yeniden tasarımında ana sayfayı kitap kapağı/biyografi sayfası gibi ele alıp yazı sayfalarını daha sakin kuruyor. Sürekli yan menüyü, metin okurken gereksiz yer kapladığı için değiştiriyor. Yazı karakteri tercihini de yayımladığı metinlerin karakteri geliştikçe gözden geçirdiğini anlatıyor. Bu bir tasarımcının gerekçeli kişisel tercihidir; evrensel kural değildir. — [Blog Redesign V4](https://journal.james-zhan.com/redesign-v4/)
- Remy Sharp'ın Eylül 2026 hedefleri; bilinçli font seçimi, geniş ekran alanını daha iyi kullanmak, eski kimliğinden bir motif korumak, az yapısal değişiklik ve daha az modern CSS. Kendi tercihinde tek koyu tema kullanıyor. Kaynak, karanlık mod anahtarı, üç boyutlu sahne veya karmaşık uygulama kabuğunun güncel site için zorunlu olmadığını gösteren bir örnektir. — [Redesign '26](https://remysharp.com/2026/09/14/redesign-26)

### Inferences
- Önerilen sıra: **kısa içerik brifi → açıklamalı 5–8 referans → iki küçük görsel yön → gri kutulu mobil/masaüstü wireframe → gerçek metinle tipografi → tek çalışan ana sayfa → kalite kontrolü → içerik geldikçe genişleme**. Bu, yukarıdaki yaratıcı kararlarının bu projeye uyarlanmasıdır; sektör çapında ölçülmüş tek standart iş akışı değildir. — [Zhan](https://journal.james-zhan.com/redesign-v4/), [Sharp](https://remysharp.com/2026/09/14/redesign-26)
- Referanslardan tüm siteyi kopyalamak yerine “başlık ölçeği”, “satır düzeni”, “fotoğrafın konumu”, “bağlantının hareketi” gibi belirli kararlar çıkaralım. Moodboard'un çıktısı bir sıfat listesi ve seçilmiş örnekler; wireframe'in çıktısı ise hangi bilginin hangi sırada görüleceği olmalı. Koyu zemin, bento kutular, dev başlıklar, brutalist çizgiler ve terminal görüntüsü kimlik denemesidir; profesyonelliğin nesnel şartları olarak sunulmamalı. — [Gerekçeli görsel tercihler örneği](https://remysharp.com/2026/09/14/redesign-26)
- İlk sürüm için önerim: her dilde aynı tek ana sayfa; ad ve somut mesleki tanım, kısa hakkımda, şu an ilgilenilen iki/üç şey, doğrulanmış sosyal/iletişim bağlantıları, gerçek ve güncelse CV. Atlantis gerçek içerikle tek kısa giriş olarak bulunabilir. Boş proje/blog/albüm sayfalarının menüsünü önceden kurmaya ihtiyaç yok. Bu proje kapsamı önerisidir. — [Ana sayfa ile içerik sayfalarını ayrı tasarlama örneği](https://journal.james-zhan.com/redesign-v4/)

### Gaps
- Bu örnekler belirli bir estetiğin işe alım veya ziyaretçi etkileşiminde üstün olduğunu kanıtlamıyor. Hedef kitle ve güncel mesleki tanım netleşmeden nihai görsel kimlik seçilemez.

## 2. Splash, animasyon ve yeni tarayıcı yetenekleri nasıl ele alınmalı?

### Takeaway
Hareket bir görsel imza veya anlamlı etkileşim olabilir; içeriğe erişimi onun tamamlanmasına bağlamak ayrı bir maliyettir. Önce hareket olmadan çalışan düzen, ardından ölçülerek eklenen bir deney öneriliyor.

### Cited Findings
- W3C, etkileşimin tetiklediği gereksiz hareketin kapatılabilmesini WCAG 2.3.3'te tanımlar; bu **AAA** düzeyindedir. Parallax ve kaydırmaya eklenen hareket bazı kişilerde ciddi vestibüler belirtiler yaratabilir; `prefers-reduced-motion` desteklenen tekniklerdendir. — [Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- Kendiliğinden başlayan, beş saniyeden uzun süren ve diğer içerikle birlikte sunulan hareketli bilgi için duraklatma/durdurma/gizleme koşulu vardır; temel işlev için gerekli hareket istisnadır. Bu **A** düzeyindeki koşul, tüm animasyonların yasak olduğu anlamına gelmez. — [Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- Aynı belge içindeki View Transitions, Ekim 2025'te Baseline Newly Available oldu. Buna karşılık farklı HTML belgeleri arasındaki `@view-transition`, kontrol edilen MDN sayfasında hâlâ Limited Availability olarak işaretleniyor. İki mekanizma aynı destek iddiasıyla anlatılmamalı. — [web.dev](https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available), [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@view-transition)

### Inferences
- İlk görsel deney: aynı ana sayfayı bir kez tamamen sabit, bir kez kısa bir başlık/motif girişiyle karşılaştırmak. İsim, açıklama ve bağlantılar hemen kullanılabilmeli. Tam ekran bekleten splash ve yapay yükleme yüzdesi ilk sürümde haklı çıkarılması gereken ek tasarımlardır. — [Hareket kontrolü](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html), [Yükleme hedefleri](https://web.dev/articles/defining-core-web-vitals-thresholds)
- Scroll-jacking, özel cursor veya 3D bütünüyle “eski/yeni” diye sınıflandırılamaz. Anlatı, oyun veya etkileşim tasarımını göstermek için anlamlı olabilir; kısa profesyonel profil için varsayılan ihtiyaç değildir. İsteğe bağlı bir deney olarak ele alıp doğal kaydırma, dokunma, klavye ve sakin sürümle karşılaştırmak gerekir. Bu bağlama özgü öneridir. — [Etkileşim hareketinin etkileri](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html), [Temel etkileşim kontrolleri](https://www.w3.org/WAI/test-evaluate/easy-checks/)

### Gaps
- Kişisel sitelerde belirli splash süresi veya özel cursor'un başarıyı artırdığına ilişkin güvenilir karşılaştırmalı kanıt bulunmadı. Kaynaklar erişilebilirlik ve performans maliyetlerini açıklıyor; estetik başarıyı sıralamıyor.

## 3. Prototip hangi kontrollerden geçmeli?

### Takeaway
Kontrol, yalnızca masaüstü ekran görüntüsü ve Lighthouse puanından oluşmamalı. Gerçek iki dil, dar ekran, dokunma, klavye, hareket tercihi ve yavaş cihaz/ağ birlikte değerlendirilmelidir.

### Cited Findings
- Core Web Vitals iyi eşikleri: **LCP ≤2,5 saniye; INP ≤200 ms; CLS ≤0,1**. Değerlendirme gerçek sayfa görüntülemelerinin 75. yüzdelik dilimine dayanır. Bunlar kişisel siteye özel dönüşüm garantileri değildir. — [Eşiklerin yöntemi](https://web.dev/articles/defining-core-web-vitals-thresholds)
- Laboratuvar ölçümü kontrollü cihaz/ağ ayarlarıyla, saha ölçümü gerçek ziyaretçilerden elde edilir; aralarında farklı sonuçlar olabilir. Bu nedenle yeni yerel prototipte iyi Lighthouse sonucu, gerçek ziyaretçiler için Core Web Vitals geçtiğinin kanıtı sayılamaz. — [Lab ve saha verisi](https://web.dev/articles/lab-and-field-data-differences)
- WAI'nin ilk kontrol listesi; anlamlı başlık yapısı, kontrast, görünür klavye odağı, yakınlaştırma, alternatif metin ve sayfa dilini kapsar; bu listeyi geçmek tam erişilebilirlik garantisi vermez. — [Easy Checks](https://www.w3.org/WAI/test-evaluate/easy-checks/)
- Çokdilli tasarımda fontun gerekli karakterleri içermesi, farklı sözcük uzunlukları ve aksanlara uygun satır yüksekliği önemlidir. `lang` ve `hreflang` farklı amaçlara sahiptir. — [Internationalization](https://web.dev/learn/design/internationalization)

### Inferences
- Wireframe'i lorem ipsum ile onaylamayalım: gerçek Türkçe ve İngilizce başlıkları beraber yerleştirelim; `İ ı Ş ş Ğ ğ Ç ç Ö ö Ü ü` karakterlerini kontrol edelim. İngilizce tasarımdaki zorlanmış satır kırılmalarını Türkçeye aynen taşımayalım. — [Çokdilli tasarım ilkeleri](https://web.dev/learn/design/internationalization)
- Birinci kapsamın kabulü: iki dilde okunabilir tek sayfa, çalışan gerçek bağlantılar, görünür odak, mobilde taşma olmaması, hareket azaltma desteği ve açıklanmış laboratuvar ölçümleri. Sonraki adım ancak içerik hazır olduğunda tek bir yazı veya Atlantis sayfası; ardından albüm. — [Temel kontroller](https://www.w3.org/WAI/test-evaluate/easy-checks/), [Hareket](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)

### Gaps
- Gerçek cihaz ve yayımlanmış URL ölçümleri yapılmadı. Bu not mevcut kodun kalite değerlendirmesi değil, sonraki küçük prototipin üretim ve inceleme yöntemidir.
