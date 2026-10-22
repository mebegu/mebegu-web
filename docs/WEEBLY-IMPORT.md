# Weebly blog aktarımı

22 Ekim 2026’da [eski blogdan](https://mebegu.weebly.com/blog) dokuz yazı arşivlendi. Kullanıcının sonraki seçimiyle **sekiz özgün yazı ve altı ayrı İngilizce çeviri yayımlandı**. Berkin Elvan yazısı istek üzerine katalog ve canlı route’lardan dışlandı; yalnız arşiv taslağı olarak korunur. RSS tamamen kaldırıldı.

Güncel yayın kaydı [publication.json](../archives/weebly/publication.json) dosyasındadır: yollar, kaynak başlıkları/zamanları, görünür yayın günleri, kapaklar ve değişmemiş özgün gövdelerin SHA-256 değerleri. İlk aktarım manifesti ve URL önerileri ilk yakalamanın tarihsel kaydı olarak korunur. Kaynak gövdeleri yeniden yazılmadı; yalnız yayın/katalog metaverileri eklendi. Yeni özetler kartlarda gösterilir, özgün yazının içine eklenmez. Çeviriler `-en.md` dosyalarında ve özgün `translationKey` ile eşleşir.

## Elimizde ne var?

- RSS, sitemap ve blog gezinmesinde aynı 9 yazı bulundu: 2 İngilizce, 7 Türkçe; 2013–2017 dönemi.
- 15 kategori/ay arşivi sayfası tarandı; ek yazı veya eksik sayfalama bulunmadı. Blog dışındaki CV, projeler ve fotoğraf sayfaları kapsam dışı kaldı.
- 61 görsel ve 1 PDF, toplam 5.893.484 bayt indirildi. Galerilerdeki özgün boyut bağlantıları da korundu; Weebly’nin dekoratif PDF ikonu alınmadı.
- 4 YouTube gömmesi standart video bağlantısına çevrildi; video indirilmedi veya üçüncü taraf oynatıcı çalıştırılmadı.
- İlk aktarımda başlık, özgün dil, RSS yayın zamanı, sayfada görünen tarih, kaynak kategorileri ve kaynak URL korundu. O aşamada çeviri yapılmadı; sonraki altı İngilizce çeviri ayrı dosyalardadır. Özgün metinlere güncel bilgi uyarlaması veya üslup değişikliği yapılmadı.

## Yazı envanteri

| Kaynakta tarih | Yaz? / Markdown tasla??                                                                                                                                       | Dil |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 15/5/2017      | [DRM, Copyright, and Fair Use Regulations](../src/content/writing/weebly-drm-copyright-and-fair-use-regulations.md)                                           | en  |
| 5/4/2017       | [Computer Virus Hoaxes](../src/content/writing/weebly-computer-virus-hoaxes.md)                                                                               | en  |
| 10/8/2014      | [2014 Cumhurbaşkanlığı Seçim Analizi](../src/content/writing/weebly-2014-cumhurbaskanlg-secim-analizi.md)                                                     | tr  |
| 11/3/2014      | [Sen Gazdan Kaçamazsın. Ben Hızlı Koşarım Anne, Ekmeği Ben Alırım...](../src/content/writing/weebly-sen-gazdan-kaamazsn-ben-hzl-koarm-anne-ekmei-ben-alrm.md) | tr  |
| 7/2/2014       | [Yorumum Gözüksün Diye 1 Yıldız](../src/content/writing/weebly-yorumum-gzksn-diye-1-yldz.md)                                                                  | tr  |
| 9/11/2013      | [İstanbul Traffic For Dummies...](../src/content/writing/weebly-stanbul-traffic-for-dummies.md)                                                               | tr  |
| 4/11/2013      | [The Walking Dead : The Game - Season 2](../src/content/writing/weebly-the-walking-dead-the-game-season-2.md)                                                 | tr  |
| 3/11/2013      | [OK Glass...](../src/content/writing/weebly-google-glass.md)                                                                                                  | tr  |
| 25/2/2013      | [And Oscar Goes To....](../src/content/writing/weebly-and-oscar-goes-to.md)                                                                                   | tr  |

Tablo ilk arşiv envanteridir. Berkin Elvan yazısı `draft: true` olarak dışarıda kalır; diğer sekiz kayıtta `draft: false` olur. Güncel canlı yollar ve altı çeviri `publication.json` ile takip edilir.

## Dosyalar

- `src/content/writing/weebly-*.md`: Astro şemasına uygun inceleme taslakları.
- `public/media/weebly/`: görseller, özgün boyut dosyaları ve PDF. Yazılar taslak olsa da bu klasördeki ekler statik yayına kopyalanır; bunlar eski sitede zaten kamuya açık dosyalardır.
- `archives/weebly/raw/`: RSS, sitemap, robots, blog listesi, 15 gezinme sayfası, 8 tam permalink sayfası ve 9 özgün RSS yazı gövdesi. Bu dizin siteye kopyalanmaz; ham HTML çalıştırılacak bir önizleme değildir.
- [manifest.json](../archives/weebly/manifest.json): yazılar, dil/tarih bilgileri, görseller, video bağlantıları, aktarım durumu ve eksikler.
- [url-map.json](../archives/weebly/url-map.json): eski permalink → önerilen yeni yol; bütün kayıtlarda `published: false`. Weebly tarafında yönlendirme kurulmadı.
- [responses.json](../archives/weebly/responses.json): indirilen yanıtların URL, içerik türü, zaman, boyut ve SHA-256 kayıtları. Karantinaya alınan dosyanın eski yanıt kaydı audit amacıyla korunur; dosyanın kendisi mevcut değildir.

## Ham HTML istisnası

Windows Defender, seçim analizi yazısının tam permalink HTML dosyasını `Trojan:Script/Wacatac.H!ml` olarak işaretleyip karantinaya aldı. Algılanan içerik çalıştırılmadı; koruma ayarları değiştirilmedi ve dosya geri yüklenmedi. Algılamanın yanlış pozitif olup olmadığına dair bir iddia yoktur.

Bu yazının tam metni ve görselleri mevcut RSS gövdesinden aktarıldı; başlık, tarih ve listede bulunan görseller kaydedilmiş blog listesiyle karşılaştırıldı. Tam permalink dosyası için bilinen tek ham arşiv eksiği budur. [exclusions.json](../archives/weebly/exclusions.json), aracın bu tam sayfayı tekrar indirmesini engeller. Diğer sekiz yazıda RSS/permalink görsel eşleşmesi kontrol edildi.

## Yeniden çalıştırma

Python 3.10+ gerekir. Araçlar site bağımlılığı değildir; yalnız bu aktarım için çalışma klasörüne kurulur:

```sh
python -m pip install --target .local/weebly-tools -r scripts/requirements-weebly.txt
python scripts/import-weebly.py
python scripts/import-weebly.py --offline
python scripts/test-import-weebly.py
```

Varsayılan çalıştırma önceden kaydedilmiş yanıtları kullanır, yalnız eksik olanları kaynak siteden indirir. `--offline` ağ isteği yapmaz. Arşiv sabit bir ilk kopyadır; otomatik Weebly senkronizasyonu değildir. Tam sayfa istisnası her iki modda da korunur.

Dosya isimleri permalink’ten türetilir ve `weebly-` öneki taşır. Aynı yazı tekrar oluşturulmaz. Mevcut Markdown değişmişse üzerine yazılmaz; yeni dönüşüm `archives/weebly/proposed/` altında karşılaştırılacak bir öneri olur. Böylece sonraki editoryal değişiklikler korunur.

## Kontroller ve kalan işler

- Altı dönüşüm testi geçti: sütun düzenindeki görseller/metinler, aktif gömmelerin bağlantıya çevrilmesi, gizli stil/script temizliği, Türkçe karakterler, dosyayı koruma, tam sayfa istisnası ve görsel yerine gelen HTML’i public dizine yazmama.
- Dokuz taslak ve 62 ekte SHA-256 kontrolü; 61 görselde decode/doğrulama ve PDF imzası kontrolü geçti.
- Ağsız tekrar çalıştırmada bütün taslak ve ek dosyaları bayt düzeyinde değişmedi. Bulunan 9 yazıdan 9’u aktarıldı; beklenmeyen indirme/dönüşüm hatası yok. Ham HTML istisnası yukarıda açıkça kayıtlıdır.
- Özgün metinler tarihi içeriktir; eski bağlantıların güncelliği ve yazılardaki olgular yeniden doğrulanmadı. Kaynak referansları korunur, dış referansların hedef dosyaları bu arşive indirilmez.
- Görsel kullanılan 53 yerin 52’sinde kaynak alt metni boş veya yalnız “Picture/Resim” idi. Açıklama uydurulmadı; yayımdan önce anlamlı alt metinler eklenmeli. Başlıklar, altyazılar, listeler ve uzun alıntılar ayrıca görsel okumadan geçirilmeli.
- RSS zamanları UTC olarak saklanır. Seçim analizi yazısında RSS tarihi 11 Ağustos 2014, görünür kaynak tarihi 10 Ağustos 2014’tür; ikisi de kaydedildi, sessizce yeniden yorumlanmadı.
- Sonraki kullanıcı seçimiyle sekiz yazı yayımlandı; altı İngilizce sürüm ve katalog kapakları/özetleri eklendi. Berkin Elvan yazısı dışlandı. Metinlerin sonraki editoryal düzenlemesi ayrı iştir.
