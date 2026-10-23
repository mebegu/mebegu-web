# Atölye içerik rehberi

Atölye, uygulama, araç, yazılım kütüphanesi, oyun ve deneylerin ortak vitrini. `src/data/projects/<id>.json` dosyaları yayın kayıtlarıdır; `src/data/projects.ts` bunları yükler. Otomatik temsili kayıt üretilmez. Şu anda yalnız **Cep Arşivi** aracı vardır: kaynak `examples/workshop/project.json`, yerel importer çıktısı `src/data/projects/pocket-archive.json`. Tanıtım, medya, çalışan araç bağlantısı ve ilgili blog yazısı bu JSON’dan gelir. Profesyonel işler ayrı `portfolio.ts` koleksiyonunda kalır.

Private veya public başka projeden CI ile bağlanmak için [entegrasyon rehberini](WORKSHOP-INTEGRATION.md) ve [diğer projeye verilecek promptu](prompts/connect-workshop.md) kullanın. JSON şeması, ortak workflow ve çağıran proje şablonları hazırdır. Gerçek kayıtlar, şema ve medya bütünlüğü kontrolünden geçer.

## Bir projenin temel bilgileri

- `id`: benzersiz ve kalıcı; paylaşım bağlantısı `#project-id` olur.
- `kind`: `apps`, `tools`, `libraries`, `games`, `experiments`.
- `status`: `idea`, `in-progress`, `released`, `completed`, `paused`, `archived`.
- `title`, `hook`, `description`: `{ tr: '…', en: '…' }`. Hook, teknolojiden önce ziyaretçinin neden ilgilenebileceğini anlatır.
- `visual`: gerçek medya olmadığında mevcut temsili SVG ailesinden seçim.
- `technologies`, isteğe bağlı `platforms`, `version`, `updatedAt` (`YYYY-MM-DD`).
- `placeholder`: yayın şemasında yalnız `false` kabul edilir; eski temsili kart sistemi kaldırılmıştır.

Tür ve durum ayrıdır. Geliştirilmekte olan bir uygulamanın test sürümü erişilebilir olabilir; yayındaki bir araç hâlâ geliştirilebilir. `completed`, yayın gerektirmeden tamamlanan bir çalışma içindir. Durumdan otomatik yayın veya bakım varsayımı türetilmez.

## Yayın ve kaynak bağlantıları

`links` sabit bir servise bağlı değildir. GitHub, Google Play, App Store, itch.io, npm, web uygulaması, indirme ve dokümantasyon için aynı yapı kullanılır:

```ts
links: [
  {
    label: { tr: 'Google Play', en: 'Google Play' },
    url: 'https://play.google.com/store/apps/details?id=REAL_ID',
    primary: true,
  },
  {
    label: { tr: 'GitHub', en: 'GitHub' },
    url: 'https://github.com/OWNER/REPO',
  },
];
```

Bu adresler şema örneğidir; gerçek adreslerle değiştirilmelidir. `primary` ana eylemi vurgular. `url: null` aktif bağlantı üretmez. İlgisiz bir yayın kanalı için hiç kayıt eklemeyin. Yerel yollar dağıtım alt yoluna göre çözülür; dış HTTP(S) adresleri yeni sekmede açılır. Çalıştırılabilir URL protokolleri kabul edilmez.

## Görsel, GIF ve video

`media` sıralı galeridir. Gerçek dosyalar `public/` altına yerleştirilir; yola `public/` öneki eklenmez. Dış HTTPS medya adresleri de kullanılabilir.

```ts
media: [
  {
    type: 'screenshot',
    src: 'media/projects/example/overview.webp',
    width: 1200,
    height: 800,
    alt: { tr: 'Ana ekran', en: 'Main screen' },
  },
  {
    type: 'gif',
    src: 'media/projects/example/flow.gif',
    poster: 'media/projects/example/flow-still.webp',
    width: 1200,
    height: 800,
    alt: { tr: 'Kullanım akışı', en: 'Usage flow' },
  },
  {
    type: 'video',
    src: 'media/projects/example/demo.mp4',
    poster: 'media/projects/example/demo.webp',
    alt: { tr: 'Kısa tanıtım', en: 'Short introduction' },
    captions: [
      { src: 'media/projects/example/tr.vtt', lang: 'tr', label: 'Türkçe' },
    ],
  },
];
```

Her öğeye isteğe bağlı iki dilli `caption` eklenebilir. Galeri seçimleri yazılı butonlar yerine küçük durağan önizlemeler gösterir; erişilebilir adları ve klavye odağı korunur. GIF/video önizlemeleri poster kullanır ve küçük oynatma simgesi taşır. Posteri olmayan videonun önizlemesi metadata yükleyen, oynatılmayan video öğesidir. GIF için durağan `poster` zorunludur; kullanıcı oynatana kadar hareket etmez. Videolar otomatik başlamaz, yerel oynatıcı kontrollerini kullanır. Konuşma içeren videolara altyazı ekleyin. Başka proje/görsele geçildiğinde ve sekme gizlendiğinde oynatma durur. JavaScript kapalıyken ekran görüntüleri ve video kontrolleri erişilir, GIF durağan kalır. Ana görseller kırpılmaz; farklı ekran oranları korunur.

## Geliştirme süreci

- `currentFocus`: şu an yapılan işi anlatan kısa, iki dilli metin. Yapay tamamlanma yüzdesi kullanılmaz.
- `notice`: test sürümü, ara verme, arşiv veya bakım durumu gibi beklentileri açıklar.
- `limitations`: bilinen sınırlar; iki dilli metin dizisi.
- `updates`: `date`, `title`, `body` ve isteğe bağlı `version`; arayüzde yeni tarihten eskiye sıralanır.
- `roadmap`: `state: 'done' | 'current' | 'next'`, iki dilli `title` ve isteğe bağlı `body`. Hedef tarih zorunlu değildir.

## Blog ve katılım

`articles` kayıtları `title`, `summary`, `url` içerir. Ayrıntılı “nasıl yaptım?” içeriği Blog'da yaşar. URL, dil başına ayrı yerel yazıya gidebilir:

```ts
url: { tr: 'tr/writing/GERCEK-YAZI/', en: 'writing/REAL-POST/' }
```

Gerçek ve mevcut yazı yolunu kullanın. İlişkisiz bir yazıya bağlamayın. `articles` boşsa bu sekme gösterilmez.

`participation` kayıtlarında `type` (`feedback`, `feature`, `bug`, `contribute`), iki dilli `title` ve `description`, ayrıca `url` bulunur. GitHub Issues/Discussions, harici form, e-posta veya projenin kendi topluluk adresi kullanılabilir. Yalnız ilgili kanalları ekleyin. Bu alanlar dış hedefe yönlendirir; sitede mesaj saklayan veya gönderim yapıyormuş gibi davranan bir form yoktur.

## Düzen ve gezinme

Masaüstünde proje dizini ve ayrıntı paneli yan yanadır. Mobilde ilk açılışta liste taranabilsin diye paneller kapalıdır. Seçilen satırın altında tek panel açılır; aynı satır tekrar seçilerek kapanır. Sekmeler klavyede ok, Home ve End tuşlarıyla kullanılabilir. İçerik olmayan sekmeler oluşmaz. Arama, tür ve durum filtreleri birlikte uygulanır; sonuç yoksa seçim sıfırlanabilir. Uzun dizinler sekizer kayıt açılır. Proje bağlantısı filtrelerle gizlenmez; doğrudan hash bağlantısı ilgili projeyi görünür açar.

JavaScript kapalıysa dizin bağlantıları sayfa içi bağlantı olarak çalışır ve bütün proje içerikleri görünür. `/projects/` ve `/tr/projects/` adresleri, dil geçişleri ve repo alt yolu desteği korunur.
