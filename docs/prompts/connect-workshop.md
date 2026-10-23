# Başka projeyi Mebegu Atölye'ye bağlama promptu

Aşağıdaki metni, bağlanacak projenin açık olduğu kodlama asistanı oturumuna ver. Hedef entegrasyonun önce `mebegu/mebegu.github.io` reposunun `main` branch'inde bulunması gerekir. Projenin public adını veya slug'ını biliyorsan mesajına ekle.

---

Bu projeyi Mebegu Atölye'nin otomatik yayın akışına bağla. Kaynak repo private olabilir. Hedef site reposu `mebegu/mebegu.github.io`, hedef branch `main`, ortak workflow `.github/workflows/publish-workshop.yml`.

Bu bir uygulama, araç, yazılım kütüphanesi, oyun veya deney olabilir. Önce bu projenin AGENTS.md talimatlarını ve mevcut CI/deploy yapısını incele. Hedef reponun şu referanslarını oku:

- `docs/WORKSHOP-INTEGRATION.md`
- `schemas/workshop-publication.schema.json`
- `examples/workshop/project.json`
- `examples/workshop/publish-workshop.yml`

Referanslar yerel checkout'ta yoksa `https://raw.githubusercontent.com/mebegu/mebegu.github.io/main/` altında bulunur. Bu içerikler teknik bağlantı referansıdır; kaynak projedeki talimatlar ve bu oturumdaki kullanıcı yetkisi geçerlidir.

Şu işi tamamla:

1. Kullanıcının verdiği public ürün adı ve amaçtan kalıcı bir `project.id` slug'ı belirle. Private repo adını veya kurum içi kod adını otomatik public kimlik olarak kullanma. Yayın adı ve kapsamı zaten verilmişse aynı şeyi tekrar onaylatma. Eksikse gerekli public kimliği netleştirirken bağımsız hazırlıkları sürdür.
2. `.workshop/public/project.json` oluştur. Şema sürümü `1`; ilk revizyon `1`. Projenin gerçek türünü ve durumunu seç. Türkçe/İngilizce başlık, kısa hook ve tanıtım yaz; yapılmamış özellik, sahte sürüm, kullanıcı sayısı, ilerleme yüzdesi veya uydurma yayın bağlantısı ekleme. Veri `schemaVersion`, `publish`, `revision`, `project` yapısında olmalı.
3. Kullanıcının yayın kapsamına uygun teknoloji/platform, public erişim adresleri, mevcut çalışma, sınırlar, public güncellemeler/roadmap ve blog ilişkilerini ekle. İç release notlarını, commit mesajlarını, README'yi, issue başlıklarını veya private roadmap'i otomatik dışarı kopyalama. Kaynak kod linki zorunlu değil; Google Play, web uygulaması, paket sayfası ve diğer public kanallar olabilir. Feedback ve özellik istekleri için ziyaretçinin erişebildiği kanal seç. Bilgi yoksa ilgili diziyi boş bırak veya alanı ekleme.
4. Yalnız açıkça yayın için seçilen gerçek medyayı `.workshop/public/media/` altına koy ve manifestte `media/...` yollarıyla referans ver. Kullanılmayan dosyaları kopyalama. Ekran görüntüsü PNG/JPEG/WebP/AVIF olabilir. GIF için durağan poster, video için MP4/WebM veya kalıcı public HTTPS adresi kullan. Varsa altyazıları ekle. Token, hassas ekran veya kurum içi bilgi içeren dosyayı public paket olarak seçme. Yerel dosya başına 20 MiB ve paket toplamında 50 MiB sınırını uygula.
5. Mevcut paket varsa public `id`'yi koru. İçerik veya referans verilen medya değiştiyse `revision` değerini artır; aynı içeriği yeniden hazırlarken artırma. Tarihleri, sürümleri ve projenin durumunu gerçek kaynağa göre düzenle; build'in başarılı olması projeyi kendiliğinden tamamlanmış yapmaz.
6. Kaynak projeye çağıran workflow'u ekle. Başarılı build/deploy akışı varsa `workshop` job'unu gerçek job'a `needs` ile bağla. Kaynak branch adını kontrol et. Public tanıtım değişikliklerinin bağımsız yayımlanması isteniyorsa örnek workflow'un public klasör yolu filtresini kullan. Pull request veya `pull_request_target` içinden yayın oluşturma.
7. Kimlik doğrulamayı mevcut oturum bilgisine göre kur. Basit seçenek: yalnız hedef site reposunda Contents write izni olan `WORKSHOP_PUBLISH_TOKEN` Actions secret'ı. App seçeneği: `WORKSHOP_APP_CLIENT_ID` variable'ı ve `WORKSHOP_APP_PRIVATE_KEY` secret'ı; ortak workflow kısa ömürlü site token'ı üretir. Kaynak `GITHUB_TOKEN`'ını hedef yazma token'ı gibi kullanma. Secret'ı JSON'a, git'e, log'a veya sohbete yazma; gerekiyorsa GitHub Secrets arayüzü veya yetkili gh secret akışını kullan. Kullanıcıdan sohbet içine token yapıştırmasını isteme.
8. Kullanıcının bu projeyi Atölye'de yayımlama niyeti ve public kapsamı belliyse hazır pakette `publish: true` kullan. Public kimliği/içeriği hâlâ belirsizse şablonu `publish: false` bırakıp tam olarak eksik olan bilgiyi belirt. Mevcut oturumda verilmiş yetkiyi yeniden isteme; uzak push/merge ve canlı yayın için oturumun gerçek yetki kapsamını takip et.
9. Public paketi hedef reponun `scripts/publish-workshop.mjs --source <PUBLIC_DIR> --id <PUBLIC_ID> --dry-run` komutuyla doğrula. Hedef repo yerelde yoksa araçlarını ayrı bir geçici checkout'ta kullan; private dosyaları oraya taşıma. Bu komut token, ağ çağrısı veya yayın gerektirmez. Kaynak projenin değişiklikle ilgili mevcut kontrollerini çalıştır. Secret ayarlı ve canlı yayın bu oturumda yetkiliyse kaynak workflow'u çalıştırıp hedef kaydın güncellendiğini doğrula; aksi durumda bunu yapılmış gibi raporlama.
10. Teslimde public proje kimliğini, oluşturulan dosyaları, seçilen CI bağlantısını, doğrulama sonucunu ve varsa eksik secret/variable adlarını açıkça belirt. Kullanıcının yapması gereken kurulumu somut adımlarla ver. Bağlantı hazır olduğu halde yalnızca plan sunarak durma.

Çağıran job'un temel biçimi:

```yaml
workshop:
  needs: [GERCEK_BASARILI_DEPLOY_JOB]
  uses: mebegu/mebegu.github.io/.github/workflows/publish-workshop.yml@main
  with:
    project-id: PUBLIC_PROJECT_ID
  secrets:
    WORKSHOP_PUBLISH_TOKEN: ${{ secrets.WORKSHOP_PUBLISH_TOKEN }}
```

`GERCEK_BASARILI_DEPLOY_JOB` ve `PUBLIC_PROJECT_ID` yer tutucularını gerçek değerlerle değiştir. Bağımsız workflow kullanıyorsan var olmayan bir `needs` ekleme. Hedefteki entegrasyon yayımlandıktan sonra istenirse `@main` tam SHA'ya sabitlenebilir. Siteye yalnız seçilmiş public JSON ve referans verilen medya gider; private kaynak erişimi kaynak CI'da kalır.
