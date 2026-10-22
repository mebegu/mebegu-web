# Teknik temel

## Amaç ve sınır

Repo, bir backend’e ihtiyaç duymadan GitHub Pages’te yayımlanır. Astro build sırasında sayfaları HTML’e dönüştürür. Üretim çıktısı `dist/` klasörüdür. Yayın için yalnızca bu klasör yüklenir; araştırma ve tasarım belgeleri sitenin parçası değildir.

## Kararlar

| Konu      | İlk karar                           | Gerekçe                                           |
| --------- | ----------------------------------- | ------------------------------------------------- |
| Framework | Astro, statik çıktı                 | Sayfalar ve Markdown içerik birlikte büyüyebilir. |
| İçerik    | Astro koleksiyonu + Markdown        | Yazı eklerken sayfa kodu düzenlemek gerekmez.     |
| Görünüm   | Sade CSS + token’lar                | Küçük başlangıç, okunabilir bir tasarım sistemi.  |
| Etkileşim | CSS/SVG ve gerektiğinde az JS       | Açılış ve navigasyon hızlı kalır.                 |
| Dil       | Baştan Türkçe ve İngilizce          | Kullanıcının seçimi; ortak şablon, ayrı içerik.   |
| Yayın     | GitHub Actions → Pages              | Repo push’undan üretilebilir dağıtım.             |
| Sürümler  | Tam bağımlılık sürümleri + lockfile | Kurulum ve CI aynı bağımlılık ağacını kullanır.   |

## Sayfa haritası

```text
/                  Ana sayfa
/about/            Kısa profil; gerçek CV için genişletilecek
/writing/          Yayımlanmış yazı listesi
/writing/<id>/     Markdown’dan üretilmiş yazı
/atlantis/         Eser sayfası ve Atlantis kategorili güncellemeler
/rss.xml           Tüm yayımlanmış yazıların özeti
/404.html          GitHub Pages hata sayfası
/tr/               Türkçe ana sayfa
/tr/about/         Türkçe profil
/tr/writing/       Türkçe yazı listesi
/tr/writing/<id>/  Türkçe yazı
/tr/atlantis/      Türkçe eser sayfası
/tr/rss.xml        Türkçe yazıların özeti
```

`src/lib/urls.ts` yerel adreslere build’in base yolunu ekler. Sayfa ve asset bağlantılarında `/about/` gibi hardcoded kök yollar kullanmayın. Repo sitesi, kullanıcı sitesi ve özel domain bu yaklaşımla desteklenir. `SITE_URL` origin’i, `BASE_PATH` alt yolu belirtir. Canonical ve RSS aynı değerlerle üretilir. Yalnızca GitHub Pages yayın akışı bu değerleri otomatik keşfeder.

## Veri akışı

`Markdown → içerik şeması → Astro sayfaları ve RSS → dist → GitHub Pages`

`draft: true` içerik koleksiyonda bulunabilir fakat liste, detay route’u ve RSS’de yayımlanmaz. Her sayfa yalnızca kendi `lang` değerindeki içerikleri çeker. Atlantis sayfası ayrıca `category: Atlantis` filtresini kullanır. Şimdilik geleceğe tarihli yazılar otomatik planlanmaz: `draft: false` ise build sırasında yayımlanır.

## Dil stratejisi

`src/lib/i18n.ts` arayüz sözlüğü ve dil bazlı URL yardımcısını içerir. `src/components/pages/` şablonları iki dilde ortak kullanılır. Route dosyaları yalnızca dili geçirir. İngilizce kökte, Türkçe `/tr/` altında yaşar; otomatik tarayıcı dili yönlendirmesi veya zorunlu dil seçimi ekranı yoktur.

Her Markdown kaydının `lang` ve `translationKey` alanı vardır. Çeviri kayıtlarının dosya adları farklı olabilir; aynı `translationKey` onları eşleştirir. Çeviri varsa dil düğmesi aynı yazıya gider ve hreflang eklenir. Çeviri yoksa karşı dildeki yazı listesine gider; bu durumda o liste yazının çevirisi olarak metaveriye eklenmez. Her yazının iki dilde olması zorunlu değildir. Her dilde kendi RSS akışı bulunur. GitHub Pages bütün hatalarda kök `404.html` dosyasını sunar; bu ortak sayfa iki dilde ana sayfaya giriş sağlar.

## Doğrulama

- `pnpm check`: Astro ve TypeScript tanıları.
- `pnpm build`: İçerik şeması ve statik route üretimi.
- `pnpm check:output`: Gereken route’lar, yerel dosya ve anchor bağlantıları, alt yol, canonical adresler ve RSS linkleri.
- Görsel QA: Desktop/mobile, klavye, azaltılmış hareket, dar ekranda taşma ve JS kapalı davranış.

Testler canlı GitHub hesabını, uzaktaki sosyal bağlantıların çalışmasını veya tüm erişilebilirlik kriterlerini doğrulamaz. GitHub Pages yayın akışı hedef remote ve Pages ayarı olmadan yerelde uçtan uca çalıştırılamaz.

## Sonraki genişlemeler

Çalışmalar ve fotoğraflar gerçek içerik geldiğinde ayrı koleksiyonlara dönüşebilir. Albüm görselleri optimize edilmiş boyutlarla tutulmalı; ham fotoğraf arşivi repo içine doldurulmamalı. Arama her dil için statik indeksle eklenebilir. Ziyaretçi mesajları ve aboneler için dış servis kararı ayrıca verilir. Anahtarlar tarayıcı koduna eklenmez.
