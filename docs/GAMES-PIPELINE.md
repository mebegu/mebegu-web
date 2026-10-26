# Oyun yayın hattı

Beş Unity oyununu tek komutla yayımlama tasarımı. Oyun kaynakları **private** kalır. Build'ler **yerelde** Unity batchmode ile üretilir; tek bir script build alır, indirilebilir dosyayı public bir repoya release olarak yükler ve [Atölye manifestini](WORKSHOP-INTEGRATION.md) günceller. Site manifesti okuyup oyunu proje kartı olarak gösterir.

**Tarayıcıda oynatma kapsam dışı.** Oyunlar sitede tanıtılır ve indirilir; WebGL üretilmez.

## Oyunlar

| Oyun | Repo | Unity projesi | Artefakt |
| --- | --- | --- | --- |
| Bagatelle | `mebegu/bagatelle` | repo kökü | APK |
| Caves | `mebegu/caves` | repo kökü | APK |
| Distinct | `mebegu/distinct` | repo kökü | APK |
| Lift | `mebegu/Lift` | repo kökü | APK |
| Football Academy | `mebegu/football-academy` | `Academy/` | Windows (zip) |

Dört oyun mobil, Football Academy masaüstü. Unity projesinin repo kökünde olmaması yalnız Football Academy'de geçerli; hat proje yolunu parametre olarak alır.

## Çözülen asıl sorun: dağılmış build giriş noktaları

Her oyun kendi build script'ini ayrı icat etmişti:

| Oyun | Mevcut giriş noktası |
| --- | --- |
| Bagatelle | `AndroidBuild.BuildS20FE()` |
| Distinct | `AndroidBuild.Build()` |
| Lift | `LiftAndroidBuild.Batch()` / `BatchRelease()` |
| Caves | yoktu |

Farklı sınıf adları, farklı metot adları, farklı çıktı yolları. Dışarıdan tek komutla sürülemiyordu.

Çözüm: her oyuna **aynı** `Assets/Editor/GameBuild.cs` dosyası konur. Mevcut script'lerin yerine geçmez — menü öğeleri ve playtest build'leri olduğu gibi kalır. Yalnız dışarıdan çağrılacak sabit bir kapı ekler.

```
Unity.exe -batchmode -quit -projectPath <proje> \
  -executeMethod GameBuild.Android \
  -gameBuildOutput <çıktı> \
  -gameBuildVersion <sürüm>
```

`GameBuild.Android` ve `GameBuild.Windows`. Sahneler `EditorBuildSettings`'ten alınır, sürüm `PlayerSettings.bundleVersion`'a ve Android `bundleVersionCode`'una yazılır.

## Neden ayrı bir public repo

**Private repo release'i herkese açık indirilemez.** GitHub, private repo release dosyalarına erişimde kimlik doğrulaması ister; siteye konan bağlantı ziyaretçide 404 döner. [Atölye entegrasyonu](WORKSHOP-INTEGRATION.md) bunu zaten yasaklar.

**Atölye aktarımı build artefaktı taşıyamaz.** Şema çalıştırılabilir dosyaları reddeder, dosya başına 20 MiB ve paket başına 50 MiB medya sınırı uygular. Manifest artefakta **bağlantı verebilir**, onu barındıramaz.

**Release dosyaları bedava durur.** Git nesne grafiğinin dışında saklanırlar: repo boyutuna sayılmazlar, dosya başına 2 GiB'e kadar, belgelenmiş toplam üst sınır yok.

## Repo düzeni

```
mebegu/<oyun>           private   Unity kaynağı, .workshop manifesti, .games yapılandırması
mebegu/game-releases    public    APK ve masaüstü paketleri → Releases
mebegu/game-media       public    Atölye sınırlarını aşan tanıtım medyası
mebegu/mebegu.github.io public    Site + yayın script'leri
```

Private oyun reposu hiçbir public repoyu okumaz, yalnız yazar. Site hiçbir private repoyu okumaz.

`game-media` yalnız gerektiğinde kullanılır: küçük ekran görüntüleri oyunun kendi `.workshop/public/media/` klasöründen aktarılır; 20 MiB'ı aşan video ve görseller `game-media`'da durup manifest'ten adresle bağlanır.

## Akış

```
  mebegu/<oyun>  (private)
        │
        │  git tag bagatelle-v0.3.0
        │  node scripts/release-game.mjs --source <oyun>
        ▼
   ┌──────────────────────────────────────────────────┐
   │ 1. .games/publish.json okunur                    │
   │ 2. sürüm tag'den türetilir                       │
   │ 3. HEAD == tag commit'i mi, doğrulanır           │
   │ 4. Unity batchmode: GameBuild.<Hedef>            │
   │ 5. masaüstü hedefi ise klasör zip'lenir          │
   └───────────────┬──────────────────┬───────────────┘
                   │                  │
                   ▼                  ▼
          game-releases        .workshop manifesti
          <slug>-v0.3.0        version, links, revision++
          release asset'i             │
                                      ▼
                            publish-workshop.mjs
                                      │
                                      ▼
                          mebegu.github.io → Atölye kartı
```

Tetikleyici elle verilen bir komut. Unity derlemesi CI'da yapılmaz: hiçbir repoda Unity lisans secret'ı yok ve private repolarda Actions dakikası sınırlı. Aynı script ileride bir workflow adımından çağrılabilir.

## Sürüm git tag'inden gelir

Tag biçimi `<slug>-v<semver>`:

```
bagatelle-v0.3.0
football-academy-v0.1.0
```

Script tag'den sürümü çıkarır ve üç yere birden yazar: Unity'nin `bundleVersion`'ı, release tag'i, manifest'in `project.version` alanı. Tek kaynak olduğu için üçü birbirinden ayrışamaz.

İki güvenlik kontrolü var. **HEAD, tag'in commit'i değilse script durur** — yayımlanan şey etiketlenen şey olmalı. **Çalışma ağacı kirliyse uyarır** ama devam eder; commit edilmemiş değişiklikler build'e girer.

`--tag` verilmezse en son eşleşen tag kullanılır.

## Oyun tarafı yapılandırma

Her oyun reposunda üç şey. Beşinde de kurulu.

### `.games/publish.json`

```json
{
  "slug": "bagatelle",
  "projectPath": ".",
  "targets": {
    "android": { "output": "Builds/release/bagatelle.apk" }
  }
}
```

Football Academy monorepo ve masaüstü olduğu için farklı:

```json
{
  "slug": "football-academy",
  "projectPath": "Academy",
  "targets": {
    "windows": { "output": "Builds/release/win64/FootballAcademy.exe", "archive": "zip" }
  }
}
```

`archive: "zip"` verilen masaüstü hedefinde, `.exe`'yi içeren klasörün tamamı sıkıştırılır — masaüstü build'i klasörüyle birlikte taşınmalıdır.

### `Assets/Editor/GameBuild.cs`

Standart build kapısı. Beş oyunda da birebir aynı dosya; güncellenmesi gerekirse hepsinde birlikte güncellenir.

### `.workshop/public/project.json`

Mevcut [Atölye manifesti](WORKSHOP-INTEGRATION.md). Oyunlar için `kind: "games"`, `visual: "gameplay"`.

Bağlantılar şemanın `link` tanımına uyar: yalnız `label`, `url` ve `primary`. Ayrı bir tür alanı **yoktur** (`additionalProperties: false`), bu yüzden script indirme bağlantısını **etiketinden** tanıyıp günceller ve diğer bağlantılara dokunmaz.

```json
"links": [
  {
    "label": { "tr": "APK indir (Android)", "en": "Download APK (Android)" },
    "url": "https://github.com/mebegu/game-releases/releases/download/bagatelle-v0.3.0/bagatelle.apk"
  }
]
```

## Yayın script'i

`scripts/release-game.mjs` — bu repoda, `publish-workshop.mjs` ve `import-workshop.mjs` yanında.

```sh
node scripts/release-game.mjs --source /PATH/TO/GAME [--tag <tag>] [--dry-run]
```

`--dry-run` hiçbir şey yazmaz, ağ isteği yapmaz, token istemez — mevcut workshop script'leriyle aynı davranış. Yapacaklarını listeler:

```
bagatelle 0.3.0  (tag bagatelle-v0.3.0)  [dry-run]

build      android: GameBuild.Android → Builds\release\bagatelle.apk (atlandı)
release    mebegu/game-releases → bagatelle-v0.3.0
             asset: bagatelle.apk
manifest   revision → 2, version → 0.3.0
             bağlantı: APK indir (Android)
```

Manifesti siteye göndermez; o adım mevcut `publish-workshop.mjs` ile ayrı yapılır ve script komutu sonunda yazar. Ayrı tutulmasının sebebi, manifest aktarımının kendi kimlik doğrulaması ve revizyon kuralları olması.

Unity yolu `UNITY_PATH` ortam değişkeninden alınır; varsayılan `6000.3.25f1`.

## Yayın adımları

```sh
# 1. Oyun reposunda: değişiklikleri commit et ve etiketle
git tag bagatelle-v0.3.0

# 2. Site reposunda: önce kuru çalıştır
node scripts/release-game.mjs --source C:\dev\rescued\Bagatelle --dry-run

# 3. Gerçekten yayımla (Unity derlemesi birkaç dakika sürer)
node scripts/release-game.mjs --source C:\dev\rescued\Bagatelle

# 4. Manifesti siteye gönder
node scripts/publish-workshop.mjs --source C:\dev\rescued\Bagatelle\.workshop\public --id bagatelle

# 5. Oyun reposunda: manifest değişikliğini commit et, tag'i push et
git push origin main --tags
```

## Kimlik doğrulama

| Araç | Gereken | Ne için |
| --- | --- | --- |
| `gh` CLI | Oturum açık olması | `game-releases`'e release yüklemek |
| `publish-workshop.mjs` | `WORKSHOP_PUBLISH_TOKEN` | Manifesti siteye göndermek |

Yayın yerelden çalıştığı için `gh`'nin mevcut oturumu yeterli; ayrı bir token gerekmez. Repo secret'ına yalnız CI'a taşınırsa ihtiyaç olur.

## Limitler

| Kaynak | Limit | Not |
| --- | --- | --- |
| Release dosya başına | 2 GiB | Pratikte biraz altında |
| Release toplam | Belgelenmiş sınır yok | Repo boyutuna sayılmaz |
| Pages yayınlanan site | 1 GB | Yalnız `game-media` için geçerli |
| Pages bant genişliği | 100 GB / ay | Yalnız `game-media` için geçerli |
| Atölye medya dosyası | 20 MiB | Aşanlar `game-media`'ya |
| Atölye medya paketi | 50 MiB | Oyun başına |
| Atölye JSON | 256 KiB | |

APK'lar release'te durduğu için Pages bütçesine hiç dokunmuyorlar.

## İsimlendirme

Tek slug her yerde: manifest `project.id`, release tag öneki, `game-media` alt dizini.

```
bagatelle  caves  distinct  lift  football-academy
```

Slug kalıcıdır ve private repo adından bağımsızdır. `Lift` reposu büyük harfle ama slug `lift`.

Dosya adları: `<slug>.apk`, `<slug>-<sürüm>-win64.zip`.

## Mevcut durum

| Parça | Durum |
| --- | --- |
| `mebegu/game-releases` | Kuruldu |
| `mebegu/game-media` | Kuruldu (eski `play` reposu yeniden amaçlandırıldı) |
| `scripts/release-game.mjs` | Yazıldı, dry-run doğrulandı |
| `GameBuild.cs` shim | Beş oyunda da kurulu |
| `.games/publish.json` | Beş oyunda da kurulu |
| `.workshop` manifesti | Beş oyunda da var. Football Academy yayında; diğer dördü `publish: false` |
| Site `/games/<slug>/` sayfası | **Yapılmadı** — ilk yayından sonra |

## Karara bağlanacak açık noktalar

- Dört oyunun manifestinde `publish: false`. Metinler gözden geçirilip açılmalı. Lift'in hook ve description alanları `DOLDURULACAK` olarak duruyor; repoda README yok.
- Ekran görüntüleri hiçbir manifeste eklenmedi. Atölye kartı görselsiz duruyor.
- Android `bundleVersionCode` semver'den türetiliyor (`0.3.0` → 300). Play'e yüklenmiş bir sürümün altına düşmemeli; ilk gerçek yüklemeden önce doğrulanmalı.
- `release-game.mjs` henüz gerçek bir build ile çalıştırılmadı; yalnız dry-run doğrulandı. İlk gerçek yayın bir oyunla denenmeli.
- Oyun sayfası (`/games/<slug>/`) ilk yayından sonra yazılacak.

## İlgili dokümanlar

- [Atölye entegrasyonu](WORKSHOP-INTEGRATION.md) — manifest aktarımı, kimlik doğrulama
- [Atölye içerik rehberi](WORKSHOP.md) — proje alanlarının anlamı
- [Mimari](ARCHITECTURE.md) — site yapısı

Kaynaklar: [GitHub Pages limitleri](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).
