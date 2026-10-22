# Modern kişisel site için teknik yöntemler — 22 Ekim 2026

## Hangi yapım yöntemi bu siteye uyuyor?

### Takeaway
Önerim mevcut Astro temelini korumak, kapsamını iki dilli tek ana sayfaya indirmek. Bu bir teknoloji trendi iddiası değil: içerik, statik yayın ve ileride seçici etkileşim gereksinimlerine dayanan mimari tercih.

### Cited Findings
- **Derlemesiz HTML/CSS/JS:** GitHub Pages doğrudan HTML, CSS ve JavaScript yayımlar; derleme zorunlu değildir. Dolayısıyla bir kişisel ana sayfa için framework teknik şart değildir. Kullanıcı sitesi `owner.github.io`, proje sitesi `owner.github.io/repositoryname` altında olur; özel domain desteklenir. — [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- **Astro:** `.astro` bileşenleri istemci çalışma zamanı olmadan HTML üretir. UI framework bileşenleri de varsayılan olarak statik render edilir; `client:*` ile işaretlenirse etkileşim için JavaScript gönderilir. `client:visible` ve `client:idle` ile yükleme ertelenebilir. Bu nedenle Astro kullanmak React kullanmayı veya her sayfayı uygulama olarak hydrate etmeyi gerektirmez. — [Astro islands](https://docs.astro.build/en/concepts/islands/)
- **Eleventy:** HTML, Markdown, Nunjucks, Liquid gibi farklı şablonları destekler; istemci framework'ü ve varsayılan istemci JavaScript'i gerektirmez. Belirli bir `app`/`pages` dizinini dayatmaz ve kademeli benimsenebilir. — [Eleventy](https://www.11ty.dev/)
- **Next.js statik export:** `output: 'export'`, her rota için HTML ve statik varlıklar üretir; App Router Server Components derleme sırasında çalışır. İstemci bileşenleri ve istemci navigasyonu kullanılabilir. Ancak Server Actions, cookie okuma, ISR, istek tabanlı Route Handlers, varsayılan sunucu resim optimizasyonu, Proxy, sunucu redirect/rewrite gibi özellikler desteklenmez; dinamik URL'ler önceden üretilmelidir. — [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)

### Inferences
- **HTML/CSS:** En az araç bağımlılığıyla küçük bir sayfa çıkarır. İki dil, ortak menüler ve onlarca yazı büyüdüğünde manuel tekrarları veya kendi şablonlama sistemimizi yönetmemiz gerekir. Bir sayfalık kartvizit için makul; mevcut Astro'yu silmenin kullanıcıya somut kazancı henüz yok.
- **Astro:** Aynı tasarım ve layout'u paylaşan iki dil, ileride blog/Atlantis/albüm ve küçük etkileşimler için dengeli seçim. Başlangıçta React, MDX, CMS, WebGL veya animasyon kütüphanesi eklemek gerekmiyor.
- **Eleventy:** Yazı arşivi ağırlıklı ve HTML/şablon kontrolünü seven biri için eşit derecede ciddi alternatif. Astro'ya göre daha eski görünüm üretmek zorunda değil; görsel tasarım generator'den bağımsız.
- **Next:** React odaklı bir deneyim veya ileride uygulama gereksinimi varsa geçerli. Bu kullanıcı için şu anda export kısıtlarıyla uğraşmak karşılığında belirgin ihtiyaç karşılamıyor. “Next her zaman yavaş” veya “Astro her zaman hızlı” sonucu çıkarılamaz; gerçek varlıklar ve istemci kodu ölçülmelidir.

### Gaps
- Bu repo özelinde JS boyutu, LCP veya INP ölçülmedi; resmi framework açıklamaları gerçek site performansının garantisi değildir. Bakım maliyetlerini sayısal olarak sıralayan karşılaştırılabilir bağımsız veri toplanmadı.

## İçerik ve Türkçe/İngilizce nasıl sürdürülebilir?

### Takeaway
Kaynak dosyalarıyla büyüyen, derleme sırasında HTML üreten içerik hattı yeterli. İki dili baştan açık URL'lerle ayırmak sonradan taşıma ihtiyacını azaltır.

### Cited Findings
- Astro content collections, yerel Markdown/MDX/YAML/JSON gibi dosyaları derleme sırasında okuyabilir; ortak veri şemaları, sorgulama ve doğrulama sağlar. Canlı içerik koleksiyonları ayrı bir çalışma modeli; statik kişisel blog için zorunlu değil. — [Content collections](https://docs.astro.build/en/guides/content-collections/)
- Astro i18n yapılandırmasında varsayılan dili kökte bırakmak veya `prefixDefaultLocale: true` ile bütün dillerin URL'lerini öneklemek mümkün. Dosya ve URL yapısı eşleşir. — [Astro i18n](https://docs.astro.build/en/guides/internationalization/)

### Inferences
- Önerilen küçük başlangıç: `/tr/` ve `/en/`; ortak layout, küçük bir arayüz çeviri sözlüğü. `/` varsayılan içeriğe erişim sağlar; sırf dil seçimi için ziyaretçiyi bekleten splash gerekmez.
- İlk aşamada yalnızca ana sayfanın iki sürümü; ardından gerçekten yayınlanacak bir içerik geldiğinde blog veya Atlantis rotası. Boş bölümlerden oluşan menü kurmayalım.
- Blog geldiğinde Markdown başlık/tarih/dil/çeviri ilişkisi gibi metadata ile yönetilebilir. Her yazının iki dilde yayımlanması zorunlu tutulmamalı; çevirisi yoksa açıkça göstermek, ziyaretçiyi farklı bir yazıya taşımaktan daha öngörülebilir.
- CMS'yi ihtiyaç doğunca eklemek mümkün; şimdiden bir içerik yönetim hizmeti, veritabanı veya üyelik sistemi seçmek gereksiz bakım alanı açar.

### Gaps
- İngilizce mi Türkçe mi varsayılan olacak kesinleşmedi. İki URL modeli de teknik olarak geçerli; bu bir hedef kitle kararı.

## Statik site nasıl çağdaş biçimde hareket eder?

### Takeaway
Statik, sunucunun dosya sunması demektir; ziyaretçinin tarayıcısındaki etkileşimi yasaklamaz. Önerilen ilke: önce okunabilir HTML, üzerine destekleyen cihazda hareket; gerekli içeriği animasyonun tamamlanmasına bağlamamak.

### Cited Findings
- `@view-transition`, aynı origin'deki iki belge arasında yerleşik animasyonlu navigasyonu açar; kaynak ve hedef belgeler katılmalıdır. İncelenen güncel MDN sayfası **Limited availability / not Baseline** diyor. SPA içi API desteğiyle çok sayfalı geçiş desteği birbirine karıştırılmamalı. — [MDN @view-transition](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@view-transition)
- CSS `animation-timeline`, zaman yerine kaydırma veya görünürlük ilerlemesine bağlı animasyon sağlar (`scroll()` / `view()`). Bu özellik de incelenen MDN kaydında **Limited availability / not Baseline**; tüm ziyaretçiler için garanti edilemez. — [MDN animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline)
- `prefers-reduced-motion` kullanıcının azaltılmış hareket tercihini algılar; MDN bunu yaygın desteklenen özellik olarak sınıflıyor. — [MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)

### Inferences
- İlk sürüm: tipografi, responsive düzen, kısa CSS giriş hareketi ve bağlantı geri bildirimleri. View Transitions veya scroll animasyonları sonradan progressive enhancement olarak eklenebilir; destek yoksa normal sayfa veya hareketsiz içerik kalır.
- WebGL/3D düşünülüyorsa kendi başına bir tasarım amacı olmalı; ilk sürüme sırf modern görünmek için koymayı önermiyorum. Hareket kapsamını mobilde ve azaltılmış hareket tercihinde küçültelim; okunurluk, klavye odağı ve ana bağlantılar temel sürümde çalışsın.

### Gaps
- Tarayıcı sürümleri tek tek listelenmedi; destek alt özelliklere ve sürüme göre farklılaşıyor. Uygulama anında hedef cihazlarda doğrulama gerekir. Bu notlar bir animasyonun erişilebilirlik uygunluk denetimi değildir.
