# Private projeyi Atölye'ye bağlama

Hedef repo **`mebegu/mebegu.github.io`**, hedef branch **`main`**. Kaynak proje private kalır. Kaynak CI, yalnızca `.workshop/public/project.json` içindeki bilgileri ve bu manifestin referans verdiği medyayı gönderir. Site, private repoyu okumaz; private repo adı, kaynak commit SHA'sı, README, iç issue'lar ve release notları otomatik aktarılmaz. Site reposuna gönderilen tüm JSON ve medya public kabul edilir.

## Başlangıç

Önce bu entegrasyonun dosyaları hedef reponun `main` branch'inde bulunmalı. Ortak workflow, siteye henüz gönderilmemiş yerel dosyalardan çalışamaz.

Diğer projedeki kodlama asistanına [bağlantı promptunu](prompts/connect-workshop.md) verin. Elle kurulum için:

1. [Tam alanlı Cep Arşivi örneğini](../examples/workshop/project.json) kaynak projede `.workshop/public/project.json` olarak kopyalayın. Örneğin medya dosyaları `examples/workshop/media/` altındadır; kendi medyanızla değiştirin veya kullanmadığınız medya/alanları kaldırın. Cep Arşivi bağlantıları bu siteye özeldir; kendi proje adreslerinizi kullanın.
2. `project.id` için kalıcı, herkese açık bir slug belirleyin. Private repo adını kullanmak zorunda değilsiniz. Tür, durum ve Türkçe/İngilizce tanıtımı gerçek bilgilerle doldurun.
3. [Çağıran workflow şablonunu](../examples/workshop/publish-workshop.yml) kaynak projenin `.github/workflows/publish-workshop.yml` dosyasına kopyalayın; `project-id` aynı slug olmalı. Örnek kaynak branch `main`; kendi varsayılan branch'inize uyarlayın.
4. Aşağıdaki iki kimlik doğrulama yönteminden birini kaynak projede ayarlayın.
5. İçerik yayımlanmak üzere hazırsa `publish: true` yapın. Şablon, doldurulmadan yayın yapmaması için `false` gelir.

Kaynak projenin önceden başarılı build/deploy akışı varsa çağıran `workshop` job'unu o workflow'a koyup gerçek deploy job'una `needs` ile bağlayın. Bağımsız şablon; public klasörün `main` değişikliklerinde, release yayımlandığında veya elle çalışır. Bu tetikleyiciler uygulamanın testlerini kendiliğinden çalıştırmaz. Başarılı uygulama CI'ını beklemek için mevcut job bağımlılığını kullanın.

## Kimlik doğrulama

### Fine-grained PAT ile başlangıç

GitHub'da yalnız `mebegu/mebegu.github.io` reposunu seçen, **Contents: Read and write** izinli bir fine-grained PAT oluşturun. Kaynak private repoda **Settings → Secrets and variables → Actions → Repository secrets** altında `WORKSHOP_PUBLISH_TOKEN` olarak saklayın. Token'ı dosyaya veya sohbete yazmayın.

Çağıran job:

```yaml
workshop:
  needs: [deploy] # Kaynak projedeki gerçek başarılı job; bağımsız akışta kaldırın.
  uses: mebegu/mebegu.github.io/.github/workflows/publish-workshop.yml@main
  with:
    project-id: my-public-project
  secrets:
    WORKSHOP_PUBLISH_TOKEN: ${{ secrets.WORKSHOP_PUBLISH_TOKEN }}
```

`GITHUB_TOKEN` bu token'ın yerine geçmez: kaynak repo token'ı yalnız kaynak repoya yetkilidir. Yayın betiği target reposuna Git Database API ile commit yazar. Normal PAT/App kimliğiyle yapılan bu güncelleme hedefteki mevcut `deploy.yml` push akışını başlatır.

### GitHub App ile kısa ömürlü token

App'e **Contents: Read and write** verin ve yalnız site reposuna kurun. Kaynak projede:

- Actions variable: `WORKSHOP_APP_CLIENT_ID`.
- Actions secret: `WORKSHOP_APP_PRIVATE_KEY`.

Çağıran job'un `with` ve `secrets` alanları:

```yaml
with:
  project-id: my-public-project
  app-client-id: ${{ vars.WORKSHOP_APP_CLIENT_ID }}
secrets:
  WORKSHOP_APP_PRIVATE_KEY: ${{ secrets.WORKSHOP_APP_PRIVATE_KEY }}
```

Ortak workflow, GitHub'ın SHA ile sabitlenmiş App token action'ını kullanır. Oluşturulan token yalnız site reposu ve Contents write iznine daraltılır; job sonunda action tarafından iptal edilir. App anahtarını siteye veya public manifestin içine koymayın. Private kaynak repoya erişim yine çağıranın kendi `GITHUB_TOKEN`'ı ile yapılır.

Hedef branch kuralları botun doğrudan commit atmasına izin vermiyorsa GitHub hatasıyla durur; başarılı yayın raporlanmaz. Kullanılacak botun hedef branch kurallarına uygun yetkisi olmalı. Kaynak workflow'da `permissions: contents: read` yeterlidir; hedefe yazma izni ayrı kimlikten gelir. Pull request ve `pull_request_target` olaylarından yayın ortak workflow tarafından engellenir.

## Public paketin içeriği

Şema: [workshop-publication.schema.json](../schemas/workshop-publication.schema.json). `schemaVersion: 1`, `publish`, pozitif tamsayı `revision` ve `project` zorunludur. Proje alanları [içerik rehberinde](WORKSHOP.md) açıklanır.

- Gerekli proje alanları: `id`, `kind`, `status`, `title`, `hook`, `description`.
- İsteğe bağlı: teknoloji/platform/sürüm/tarih, medya, yayın adresleri, güncel çalışma odağı, bilinen sınırlar, güncellemeler, roadmap, blog ilişkileri ve katılım kanalları.
- `title` gibi metinler `{ "tr": "…", "en": "…" }` şeklindedir. Bağlantılar `null`, public HTTP(S)/mailto adresi veya `writing/...` gibi siteye göre yerel yol olabilir.
- Kaynak kod adresi zorunlu değildir. Private issue bağlantısı yerine public feedback/feature request kanalı kullanın. İç roadmap ve private release body'leri otomatik kopyalanmaz; public karşılıklarını açıkça yazın.
- Bilinmeyen alanlar, hatalı veri, farklı `project-id`, dosya sınırını aşan yollar ve symlink'ler reddedilir. Betik alanların içindeki iş bilgisinin gizli olup olmadığını belirleyemez; bu klasör bilinçli olarak public hazırlanır.

Örnek yerel ekran görüntüsü:

```json
{
  "type": "screenshot",
  "src": "media/overview.webp",
  "width": 1200,
  "height": 800,
  "alt": { "tr": "Uygulamanın ana ekranı", "en": "The app's main screen" }
}
```

Dosya kaynak repoda `.workshop/public/media/overview.webp` olmalı. Yalnız referans verilen dosyalar aktarılır; klasörün tamamı, kullanılmayan dosyalar ve private repo taranmaz. Yerel dosya adlarında ASCII harf/rakam, tire, alt çizgi ve nokta kullanın.

Yerel türler: ekran görüntüsü/poster için PNG/JPEG/WebP/AVIF; GIF için GIF ve zorunlu durağan poster; video için MP4/WebM; altyazı için VTT. SVG/HTML/çalıştırılabilir dosyalar bu aktarımla alınmaz. Her dosya en fazla **20 MiB**, bir paketin yerel medyası toplam **50 MiB**, JSON en fazla **256 KiB** olabilir. Büyük videolar için kalıcı, ziyaretçinin erişebildiği HTTPS medya adresi kullanın. Private indirme URL'si veya süresi dolan CI artifact bağlantısı kullanmayın. Uzak medya URL'leri betik tarafından indirilmez.

## Güncelleme ve tekrar çalıştırma

Public bilgi veya referans verilen medya değiştiğinde `revision` değerini artırın: `1 → 2 → 3`. Bu sayı sürüm numarasından bağımsızdır; sürüm `project.version` alanında yer alır. Kaynak CI çalıştırma numarası veya saati otomatik revizyon olarak kullanılmaz.

- Aynı revizyon + aynı içerik: işlem yok, commit yok.
- Aynı revizyon + farklı içerik: revizyonu artırmanızı isteyen hata.
- Eski revizyon: atlanır, güncel kayıt korunur.
- Yeni revizyon: JSON ve seçili medya tek bir atomik Git commit'iyle güncellenir.
- İki proje aynı anda yazarsa son `main` ağacı tekrar okunup güncelleme yeniden kurulur; force push kullanılmaz.

`publish: false` yeni aktarımı durdurur; önceden yayımlanan kaydı silmez. Proje geri çekilecekse site reposundaki JSON için ayrıca açık bir silme değişikliği hazırlayın. Eski hash'li medya otomatik silinmez.

Hedef kayıt `src/data/projects/<id>.json`, yerel medya `public/media/projects/<id>/<sha256>.<uzantı>` altında oluşur. Herkese açık commit mesajında yalnız public id ve revizyon bulunur. Atölye yalnız bu JSON kayıtlarını gösterir; otomatik temsili kart yoktur. Tam alanlı `pocket-archive` kaydı da aynı importer ile üretilmiştir ve sitedeki çalışan araca bağlanır.

## Yerelde doğrulama

Bu site reposunda Node.js 24+ ile:

```sh
node scripts/publish-workshop.mjs --source /PATH/TO/PRIVATE-PROJECT/.workshop/public --id my-public-project --dry-run
node scripts/import-workshop.mjs --source /PATH/TO/PRIVATE-PROJECT/.workshop/public --id my-public-project --site /PATH/TO/mebegu.github.io --dry-run
pnpm test:workshop
pnpm check:workshop
pnpm validate
```

`--dry-run` ağ isteği veya dosya yazımı yapmaz, token istemez. Gerçek yerel önizleme için import komutundaki `--dry-run` kaldırılır; siteye yalnız public paket yazılır. `publish-workshop.mjs` dry-run olmadan GitHub'a gerçekten yazar ve token gerektirir. Canlı aktarım testi, kullanıcı hesabında secret/App ayarları yapıldıktan sonra kaynak workflow üzerinden tamamlanır.

Önce hedef entegrasyonu GitHub'a gönderin, sonra kaynak projeyi bağlayın. İstenirse çağıran workflow'daki `@main`, yayımlanan entegrasyonun tam commit SHA'sına sabitlenebilir. Ortak workflow'un yayın araçları hedef `main` üzerinden alınır; şema değişiklikleri sürümlü tutulmalıdır.

Kaynaklar: [Reusable workflows](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows), [GITHUB_TOKEN kapsamı](https://docs.github.com/en/actions/concepts/security/github_token), [Git tree API](https://docs.github.com/en/rest/git/trees#create-a-tree), [App token action](https://github.com/actions/create-github-app-token).
