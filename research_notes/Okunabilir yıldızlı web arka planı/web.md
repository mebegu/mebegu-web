# Atmosferik yıldızlı ana sayfanın web uygulaması

## Hangi teknik bu kişisel site için uygun?

### Takeaway
Bu iş için önerim statik, sakin hazırlanmış bir arka plan + seyrek CSS yıldızları + ayrı karakter + gerçek HTML navigasyonu. Canvas ve WebGL alternatifleri teknik olarak GitHub Pages'te çalışır; ancak bu sahnenin mevcut gereksinimi bunları gerektirmiyor. Bu bir değerlendirme, evrensel performans karşılaştırması değildir.

### Cited Findings
- GitHub Pages bir depodaki HTML, CSS ve JavaScript dosyalarını yayımlayan statik hosting hizmetidir; isteğe bağlı build süreci destekler. Dolayısıyla tarayıcı tarafındaki animasyon için backend şart değildir. — [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- MDN, Canvas optimizasyon rehberinde statik arka planı her karede Canvas'a çizmek yerine altta CSS arka planı olarak tutmayı; sık ve seyrek değişen katmanları ayırmayı önerir. — [Optimizing canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- Canvas kendi başına bir bitmaptir; içine çizilen nesnelerin anlamı erişilebilirlik araçlarına HTML gibi aktarılmaz. — [Canvas accessibility](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/canvas#accessibility)
- WebGL tarayıcıda donanım hızlandırmalı 2D/3D grafik üretir; ancak cihaz donanım desteğine de bağlıdır. Resmî optimizasyon rehberi GPU belleği, ekranın piksel sayısı, çizim çağrıları ve senkron API duraklamaları gibi ek yönetim konularını belgeler. — [WebGL API](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API), [WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
- Wallpaper Engine dokümanları görselden yapılan Scene Wallpaper, HTML/CSS/JS ile Web Wallpaper ve önceden render edilmiş Video Wallpaper türlerini ayırır. Web tabanlı duvar kâğıtlarına kendi uygulamasına özel arayüzler de ekler. — [Wallpaper Engine](https://docs.wallpaperengine.io/), [Web Wallpaper Reference](https://docs.wallpaperengine.io/en/web/overview.html)

### Inferences
- **Statik görsel + CSS:** İlk sürüm için seçim. Seyrek birkaç düzine yıldızda ve çok küçük idle hareketinde HTML/CSS yönetmesi kolay; durdurulabilir, JS kapalıyken navigasyon çalışır. Belirli bir yıldız sayısının her cihazda güvenli olduğu iddia edilmiyor.
- **Canvas 2D:** İleride gerçekten çok sayıda hareketli parçacık veya akıcı çizim gerekiyorsa düşünülebilir. Arka planı statik tutup yalnız parçacıkları Canvas'a taşımak mümkündür. Blog/Profesyonel/Alamori bağlantıları Canvas'a çizilmemeli, HTML olarak üstte kalmalı.
- **WebGL / shader:** Gerçek zamanda hacimli nebula, ışık simülasyonu, 3D kamera veya güçlü derinlik efekti istenirse anlamlı. Üç metin bağlantılı sakin sahnede ek program, kaynak ve hata durumlarını yönetmek ilk faydaya göre fazla iş olur. “WebGL her zaman daha ağırdır” gibi ölçülmemiş bir genelleme yapmıyoruz.
- **Video loop:** Önceden hazırlanmış hareketli bir tablo için mümkün; ama farklı ekran oranlarında kırpma, oynatma ve durdurma, video dosyası maliyeti gibi yeni kararlar getirir. Karakterin ve yıldızın küçük hareketi için başlangıçta gerekli değil.
- Masaüstü duvar kâğıdının görsel üretim mantığını kullanabiliriz; normal web sitesinin Wallpaper Engine'e ihtiyacı yok. Wallpaper Engine'e özel API veya proje çıktısı web sitesine otomatik taşınan bir standart değildir.
- Yerel kod gözlemi: `NightLanding.astro` zaten arka plan, karartma, SVG bölücüler, yıldızlar, HTML bağlantılar ve karakteri ayırıyor. `night.css` orta yazı bölgesinde yalnız yaklaşık %18–22 siyah örtü kullanıyor; görseldeki parlak nebula doğrudan metnin arkasında kalıyor. Yeni grafik motoru değil, daha sakin görsel kompozisyonu ve daha kontrollü örtü gerekiyor. Kaynak: repo `src/components/night/NightLanding.astro`, `src/styles/night.css`, `src/components/night/StarField.astro` (22 Ekim 2026, salt okunur inceleme).

### Gaps
- Gerçek cihazda GPU/CPU, kare süresi veya batarya ölçümü yapılmadı. Seçenekler arasında kesin MB, FPS veya güç tasarrufu farkı verilemez.
- Hedef mobil ekranlardaki kadraj ve Türkçe/İngilizce metin taşmaları tarayıcıda ayrıca görülmeli; bu araştırma görsel QA değildir.

## Katmanlar ve farklı ekran kadrajı nasıl kurulmalı?

### Takeaway
Resmi tek parça poster gibi düşünmek yerine sakin gökyüzü, hafif yıldız, zemin/karakter ve okunabilir metin katmanları olarak üretmek daha esnek. Masaüstü ile mobilin farklı oranları için sadece `cover` ile kırpmak yerine gerektiğinde ayrı kadraj kullanılmalı.

### Cited Findings
- MDN, aynı görselin farklı çözünürlüklerini sunmayı `srcset`/`sizes`; ekranın düzenine uygun farklı kadraj seçmeyi `picture` ile çözülen art direction problemi olarak ayırır. Böylece telefonun gereksiz büyük görsel indirmesi de azaltılabilir. — [Responsive images](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images)
- Astro yerel görsellerin mümkünse `src/` altında tutulmasını önerir. `public/` dosyaları olduğu gibi kopyalanır. `<Image>` ve `<Picture>` build sırasında görseli işleyebilir; responsive özellikler uygun boyutlar ve `srcset`/`sizes` üretebilir. `<Picture>` bir görsel için birden çok çıktı formatı sunar. — [Astro Images](https://docs.astro.build/en/guides/images/)

### Inferences
- Önerilen katman sırası: (1) koyu lacivert temel renk, (2) düşük detaylı gökyüzü/nebula görseli, (3) metin alanları çevresinde kontrollü koyu degrade, (4) seyrek dekoratif yıldızlar, (5) ince SVG bölüm çizgileri, (6) HTML başlık ve bağlantılar, (7) ayrı zemin/karakter, (8) sosyal alt şerit. Gerektiğinde bazı statik katmanlar tek dosyada birleştirilebilir.
- Üç metin kümesinin bulunduğu orta yatay kuşak, çizim sırasında bilinçli olarak boş bırakılmalı. En parlak nebula detayı alt ufukta veya metnin arasındaki alanlarda tutulmalı. Bu sanatsal öneridir; sayı veya standart olarak sunulmamalı.
- Metin, sosyal ikonlar ve bölüm çizgileri arka plan görseline gömülmemeli; diller, ekran boyutu ve kategori sayısı değiştiğinde yeniden resim üretmek gerekmemeli.
- İlk revizyonda mevcut katmanlar korunabilir. Yeni arka planın masaüstü ve mobil kompozisyonu onaylandıktan sonra `src/assets/` + build-time responsive çıktı ya da önceden üretilmiş `<picture>` kaynakları seçilebilir. Bir format fallback'i ile bir art-direction kaynağı aynı problem değildir; ayrı kadraj isteniyorsa HTML `picture` kaynakları media koşullarına göre tanımlanmalı.
- Performans için önerilen başlangıç hedefi: mobilde arka plan + karakter görsellerini toplam yaklaşık 300–500 KB içinde, masaüstünde yaklaşık 500–800 KB içinde tutmayı denemek. Bunlar resmî limit veya ölçülmüş gereklilik değildir; sakin görselin sıkıştırma kalitesi, retina çözünürlük ve gerçek ağ testiyle ayarlanmalıdır. Az yıldızlı/az gürültülü görsel sıkıştırma denemesi özellikle anlamlıdır.
- Yerel dosya ölçümünde arka plan 390.216 byte, karakter 94.328 byte; toplam 484.544 byte (yaklaşık 485 KB). Mevcut okunabilirlik sorununun birincil nedeninin dosya boyutundan çok görsel yoğunluk olduğu değerlendirmesi bu ölçüm ve ekran görüntüsüne dayanır. Kaynak: repo `public/art/night-sky.webp` ve `public/art/observer.webp`, PowerShell `Get-Item Length`, 22 Ekim 2026.

### Gaps
- Yeni resmin optimum WebP/AVIF kalite değeri kaynak dosya olmadan belirlenemez. “4K” veya çok yüksek piksel boyutu otomatik olarak daha iyi web görseli değildir; karar hedef kadraj ve görsel kontrol gerektirir.

## Hareket nasıl hafif ve kullanılabilir tutulmalı?

### Takeaway
Yıldızlarda yavaş opaklık değişimi, karakterde çok küçük transform yeterli. Hareket dekorasyon olarak kalmalı; kullanıcı durdurabilmeli ve azaltılmış hareket tercihi desteklenmeli. İlk sürüm için mouse parallax şart değil.

### Cited Findings
- web.dev, hareket için `transform`, görünürlük değişimi için `opacity` önerir; layout/paint tetikleyen animasyonlardan kaçınmayı ve `will-change` kullanımını ancak gözlenen sorunda, ölçülü yapmayı söyler. — [High-performance CSS animations](https://web.dev/articles/animations-guide)
- `prefers-reduced-motion`, kullanıcının işletim sisteminde gereksiz hareketi azaltma isteğini algılayan CSS özelliğidir. Büyük nesnelerin ölçeklenmesi veya kaydırılması bazı kullanıcılarda rahatsızlık tetikleyebilir. — [MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- WCAG 2.2.2 açıklamasına göre otomatik başlayan, beş saniyeden uzun süren ve başka içerikle birlikte sunulan hareket/yanıp sönme/kaydırma için, esas olmadığı sürece duraklatma, durdurma veya gizleme mekanizması sağlanır. — [W3C Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- `requestAnimationFrame` tarayıcının bir sonraki çizim öncesine animasyon işi planlar; çoğu tarayıcı arka plandaki sekmelerde bunu duraklatır. Animasyon ilerlemesi kare sayısına değil zamana bağlanmalıdır. — [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
- Page Visibility API görünür/gizli sayfa değişimlerini algılar; arka plan görevlerini yönetmek için kullanılabilir. — [MDN Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)

### Inferences
- Yeni görselde binlerce parlak sabit yıldız yerine seyrek noktalar; bunların yalnız küçük bir alt grubunda yavaş ve düşük genlikli parlama kullanılmalı. Göz kırpma fikri stroboskop gibi hızlı aç/kapa yerine yumuşak parlaklık nefesi olarak yorumlanmalı.
- Karakter idle hareketi tüm resmi çok hafif çevirmek/ölçeklemek ile başlayabilir; daha doğal nefes/ceket hareketi istenirse sonradan küçük sprite veya ayrı parçalara ayrılmış rig gerekir. CSS ile tek bitmap sallamak gerçek anatomik animasyon sayılmaz.
- Hover/focus göstergeleri metnin okunabilirliğini artırmalı. İçerik ancak hover sırasında ortaya çıkmamalı. Mevcut HTML bağlantıları, focus ve pause/reduced-motion altyapısı korunmalı.
- Parallax sonradan eklenirse metin ve tıklama alanları sabit kalmalı; hareket yalnız çok küçük uzak arka plan katmanına uygulanmalı, dokunmatik ve reduced-motion durumlarında kapatılmalı. Sürekli bütün sahneyi mouse ile sürüklemek okunabilirlik sorununu büyütebilir; bu tasarım değerlendirmesidir.
- Canvas/WebGL'e geçişte reduced-motion ve kullanıcı pause kontrolü render döngüsüne de bağlanmalı; CSS'i durdurmak JS çizim döngüsünü kendiliğinden durdurmaz. Görünür olmayan sahnede uygulamanın kendi ağır işlerini de durdurması önerilir.

### Gaps
- Kullanıcının mevcut ekran görüntüsünden gerçek kontrast oranları veya animasyon güvenliği hesaplanamaz. Son görsel ve her ekran kadrajı üzerinde ölçüm gerekir.
