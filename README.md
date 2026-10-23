# mebegu.github.io

Mehmet Berk Gürçay’ın Türkçe ve İngilizce kişisel sitesi. Yazılım, yazılar, Alamori ve zamanla büyüyecek kişisel bir arşiv için GitHub Pages üzerinde çalışan statik temel.

**Durum:** Çalışan prototip. Mesleki geçmiş, gerçek projeler, blog yazıları ve kitap içeriği henüz tamamlanmadı. Repo belgeleri Türkçe.

- Repo: [mebegu/mebegu.github.io](https://github.com/mebegu/mebegu.github.io)
- Pages adresi: [mebegu.github.io](https://mebegu.github.io/)
- Türkçe giriş: [mebegu.github.io/tr/](https://mebegu.github.io/tr/)
- SSH remote: `git@github.com:mebegu/mebegu.github.io.git`

## Hızlı başlangıç

Gerekenler: Node.js 24 ve pnpm 11.25.0. Node ve pnpm normal terminal PATH’inde erişilebilir olmalı.

```sh
npm install --global pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm dev
```

Yerel adres: `http://127.0.0.1:4321/`. Üretim çıktısı için:

```sh
pnpm check
pnpm build
pnpm check:output
pnpm preview
```

`pnpm validate` bu üç kontrolü sırayla çalıştırır. `dist/` üretilir; kaynak dosyaları düzenleyin. `pnpm-lock.yaml` repoya dahil edilir, `node_modules/` ve `dist/` edilmez.

Bu çalışma klasöründe üretilmiş `dist/` dosyalarını yalnızca görüntülemek için, Python varsa `python -m http.server 4321 --bind 127.0.0.1 --directory dist` kullanılabilir. Ardından İngilizce için `http://127.0.0.1:4321/`, Türkçe için `http://127.0.0.1:4321/tr/` açılır. Bu yöntem kaynak değişikliklerini yeniden build etmez. Yeni bir klonda önce Node ile kurulum ve build gerekir.

## Şu anda neler var?

Ana sayfa: aşağıda yalnız karakter ve zemin, yukarıda **Profesyonel / Blog / Alamori / Atölye** dilimleri. Yıldız parıltısı, hover genişlemesi, dokuz baş pozu ile yumuşak imleç takibi ve azaltılmış hareket desteği içerir. Kapak tam ekran gökyüzüdür; logo sol üstte, sade `EN / TR` seçimi sağ üstte doğrudan sahnenin üzerinde durur. İç sayfalarda logo, bölüm menüsü ve dil seçimi ortak üst bardadır. Tasarım/modül haritası: [NIGHT-HOME](docs/NIGHT-HOME.md). Sosyal hesaplar kullanıcı isteğiyle placeholder; gerçek adresler `src/data/socials.ts` üzerinden eklenir.

- Profesyonel sayfa: paylaşılan güncel CV’den hazırlanmış İngilizce özgeçmiş, yalnız CV’yi yazdıran A4 baskı stili ve on bir profesyonel çalışma özeti (Selected work).
- Blog: tam genişlikte dört yazılık banner ve üç rafta sekiz gerçek yazı kartı; hover/odakta 180° dönerek özet/tarih gösterir, tam metni yeni sekmede açar. Altı Türkçe yazının İngilizce çevirileri de vardır.
- Atölye / Workshop: uygulama, araç, kütüphane, oyun ve deneyler için seçilebilir workbench. Durum, küçük görsel önizlemeli galeri, yayın bağlantıları, geliştirme günlüğü, yol haritası, blog yazıları ve katkı kanalları desteklenir. Yalnız JSON kayıtları yüklenir; tek kayıt çalışan **Cep Arşivi** okuma aracıdır. Profesyonel müşteri işleri burada yer almaz. [İçerik rehberi](docs/WORKSHOP.md), [private repo CI bağlantısı](docs/WORKSHOP-INTEGRATION.md), [diğer projeye verilecek prompt](docs/prompts/connect-workshop.md).
- Alamori: kapak, hikâye, iki dilde 20 sayfalık PDF önizlemesi, yazım durumu, güncellemeler ve yol haritası. Gerçek Blog yazıları yayımlandığında referans eklenebilir; örnek yazılar kaldırıldı. İçerik kitap reposunun isteğe bağlı yayın paketinden gelir; web yalnız statik frontend'dir. [Yayın ve gizlilik sınırı](docs/ALAMORI-PUBLICATION.md).

Alamori açılışında sayfanın üzerini kaplayan temsili buzlu aynada altın işaretler üç sıraya hizalanır, merkezde bir spiral oluşur ve yüzey ince çizgiye çekilerek kitap sayfasını açar. Kamera veya sahne görseli kullanılmaz. Atla/Escape, yeniden oynatma, azaltılmış hareket ve doğrudan PDF bağlantıları desteklenir. [Açılış animasyonu](docs/ALAMORI-ENTRY.md).

- Önceki Hakkımda ve Atlantis sayfaları ile ortak 404 adresi korunur.
- İngilizce `/`, Türkçe `/tr/`; sayfa karşılığına giden dil geçişi. CV ve portföy içeriği kullanıcı tercihiyle her iki rotada İngilizce kalır.
- Markdown yazı koleksiyonu ve gerçek katalog: Weebly’den sekiz özgün yazı, altı İngilizce çeviri, özgün görseller/tarihler ve kart özetleri. Taslaklar yayımlanmaz.
- Atlantis etiketli yazıların eser sayfasında otomatik listelenmesi.
- Canonical/hreflang adresleri, temel paylaşım metaverileri ve favicon. RSS kullanıcı tercihiyle kaldırıldı.
- Erişilebilir navigasyon, klavye odakları ve hareket azaltma tercihine uyum.
- Kök domain ve `/repo-adı/` altında çalışan yerel bağlantılar.
- GitHub Actions üzerinde kontrol, build ve Pages dağıtım akışı.

CV ve portföyün ilk içerik iskeleti hazırdır; görseller, gerçek proje bağlantıları ve ayrıntılı vaka incelemeleri sonraki aşamalardır. Fotoğraf albümü, arama ve çalışan geri bildirim formu da ileride eklenebilir. Kitabın konusu, yayın tarihi, ilerleme yüzdesi veya kariyer bilgileri uydurulmadı. Temsili proje görselleri ve geçici kitap kapağı açıkça etiketlidir.

## Klasör yapısı

```text
.
├── .github/workflows/deploy.yml  # Kontrol ve GitHub Pages yayını
├── docs/                        # Tasarım, mimari ve geliştirme planı
│   ├── DESIGN.md
│   ├── ARCHITECTURE.md
│   ├── CONTENT.md
│   ├── ROADMAP.md
│   └── wireframes/              # Desktop/mobile ilk wireframe
├── public/                      # Kopyalanacak sabit dosyalar
├── scripts/check-output.mjs     # Üretilmiş site bağlantı kontrolü
├── src/
│   ├── components/              # Ortak parçalar ve iki dilin sayfa şablonları
│   ├── content/writing/         # Markdown yazılar
│   ├── data/site.ts             # Kimlik ve navigasyon
│   ├── layouts/                 # Ortak sayfa kabuğu
│   ├── lib/                     # URL, çeviri sözlüğü, tarih ve etkileşim yardımcıları
│   ├── pages/                   # Dosya tabanlı route’lar
│   ├── styles/                  # Tasarım token’ları ve responsive CSS
│   └── content.config.ts        # İçerik şeması
├── reports/                     # Önceki içerik araştırması; siteye çıkmaz
├── research_notes/              # Araştırma kaynakları; siteye çıkmaz
├── astro.config.mjs
├── package.json
└── pnpm-lock.yaml
```

## İçerik ve tasarım nereden değişir?

- İsim ve GitHub: `src/data/site.ts`
- Türkçe/İngilizce arayüz metinleri ve menü: `src/lib/i18n.ts`
- Renkler, tipografi, responsive düzen: `src/styles/global.css`
- Ana sayfa: `src/components/night/NightLanding.astro`; route dosyaları `src/pages/` içinde.
- Ortak üst bar: `src/components/SiteToolbar.astro`.
- CV: `src/data/resume.ts`; İngilizce profesyonel çalışmalar: `src/data/portfolio.ts`; kitap: `src/data/alamori.ts`; bağımsız hobi/atölye kartları: `src/data/projects.ts`.
- Yeni yazı: `src/content/writing/` içine `.md` ekleyin; [içerik rehberi](docs/CONTENT.md).
- Eski Weebly blog arşivi: [9 yazılık aktarım envanteri](docs/WEEBLY-IMPORT.md); Markdown’lar inceleme için taslaktır.
- Tasarım kararları: [DESIGN](docs/DESIGN.md)
- Teknik kararlar: [ARCHITECTURE](docs/ARCHITECTURE.md)
- Sonraki adımlar: [ROADMAP](docs/ROADMAP.md)
- İlk yerleşim: [wireframe rehberi](docs/wireframes/README.md)
- Yapılan kontroller ve sınırlar: [doğrulama kaydı](docs/VALIDATION.md)
- Dört renkli gökyüzü, yırtık kâğıt ve fırça katmanları: [NIGHT-HOME](docs/NIGHT-HOME.md)
- Profesyonel sayfa, CV içeriği ve tarayıcıdan PDF/yazdırma: [CV rehberi](docs/CV.md); içerik `src/data/resume.ts` içinde.
- Blog: [BLOG-CATALOG](docs/BLOG-CATALOG.md), [masaüstü/mobil wireframe](docs/wireframes/blog.svg); gerçek içerik `src/content/writing/`, yayın/koruma kaydı `archives/weebly/publication.json` içinde.
- Görsel kaynakları ve üretim prompt’ları: [ART](docs/ART.md)

## GitHub Pages’e yayınlama

1. GitHub → repo **Settings → Pages → Source → GitHub Actions** seçili olmalı.
2. `main` branch’ine push yapın veya **Actions → Validate and deploy to GitHub Pages → Run workflow** kullanın.
3. Başarılı `deploy` adımındaki URL’yi açın. Ana giriş `https://mebegu.github.io/`, Türkçe giriş `/tr/` adresidir.

Repo `mebegu.github.io` adını taşıdığı için bu bir kullanıcı sitesidir; yayın kök `/` yolundadır. Workflow, domain ve base yolunu GitHub Pages ayarlarından otomatik alır. Pull request’lerde tip kontrolü, build ve çıktı kontrolü yapılır; yalnız `main` dalı yayımlanır. Build salt okuma yetkisiyle çalışır; deploy için Pages ve OIDC yetkileri ayrı işte verilir. Action’lar doğrulanmış commit SHA’larına sabitlenmiştir. Dependabot ayda bir Actions ve npm güncellemeleri için PR açar; otomatik merge yoktur.

Kendi domainini daha sonra Pages ayarlarından bağlayabilirsin. Yerel üretim build’inde `SITE_URL` ve `BASE_PATH` ortam değişkenlerini kullan; `.env.example` yalnızca örnektir, kopyalamak gerekmez. Değişkenler verilmezse build kök dizin için `https://mebegu.github.io` adresini varsayar. Bu varsayılan bir canlı yayın doğrulaması değildir.

## Teknoloji

Astro’nun statik çıktısı, TypeScript, sade CSS ve küçük bir SVG animasyonu. Tarayıcıda React veya ek bir UI framework’ü çalıştırılmıyor. Google Fonts erişilemezse sistem fontları kullanılır. Form, yorum ve bülten için ileride gerekirse dış servis eklenebilir.

Resmî kaynaklar: [Astro kurulumu](https://docs.astro.build/en/install-and-setup/), [Astro ile GitHub Pages](https://docs.astro.build/en/guides/deploy/github/), [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).
