# Karakterin imleci takip etmesi

Bu sitede dokuz yönlü baş pozu ve küçük katman hareketleri kullanılır. Arka siluetin tek resmini döndürmek yeni bir yüz perspektifi oluşturmadığından ayrı yön kareleri seçildi. Pozlar saç, yanak ve burun konturunu değiştirir; bacak ve ayak görüntüsü sabit kalır.

## Webdeki seçenekler

| Yöntem               | Ne sağlar?                                                   | Bu proje için değerlendirme                                                                        |
| -------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Yönlü sprite/kareler | Farklı baş veya gövde açılarında ayrı çizimler               | Sabit kameradaki küçük karakter için seçilen yöntem; bir animasyon motoru gerektirmiyor.           |
| Kemikli 2D rig       | Parçalar, kemikler, mesh deformasyonu ve animasyon geçişleri | Yürüme, oturma, kol hareketi ve daha çok davranış eklenirse değerlendirilebilir.                   |
| Rig’li 3D model      | Gerçek perspektif ve kemik dönüşü                            | Model, rig, ışık ve WebGL sahnesi gerektirir; bu küçük dekoratif karakter için şu anda ek iş yükü. |

Spine’ın [resmi demoları](https://esotericsoftware.com/spine-demos) sprite kareleri ile kemikli animasyonu karşılaştırır; gerektiğinde farklı perspektif karelerinin rig içinde değiştirilebildiğini de gösterir. Three.js’in [SkinnedMesh belgesi](https://threejs.org/docs/pages/SkinnedMesh.html) 3D model/iskelet yaklaşımını açıklar. Bunlar yöntem örnekleridir; web sitelerinde kullanım oranı ölçülmedi. Tablodaki proje seçimi bizim değerlendirmemizdir.

## Uygulanan hareket

İmleç yalnız hedef konumu değiştirir. Baş hedefe kritik sönümlü bir yayla yaklaşır; gövde daha yavaş başka bir yayla başın mevcut konumunu izler. Hızlar sınırlandırılır. Bu, fare hızlıca sağa sola atıldığında karakterin tam açılar arasında anlık sıçramasını önler. Hareket 120 Hz’e kadar alt adımlarla hesaplanır; 30/60/120 FPS simülasyonları aynı sonucu verdi.

Önceki üç pozun çapraz opaklık geçişi, farklı konturları aynı anda gösterdiği için ghosting üretiyordu. Artık opaklık karışımı ve `plus-lighter` yoktur. Yerleşik image_gen ile üretilmiş dokuz kare tek bir 3 × 3 atlasta bulunur; kırpılmış alanda aynı anda yalnız bir baş pozu görünür. Kaynak `docs/art-source/observer-heads-v2.png`, web atlası `public/art/observer-heads-v2.webp` (960 × 576, 119.658 bayt). Her web karesi 320 × 192 pikseldir; boyun kesitinin orta noktası aynı pivota hizalanır. Karelerin gerçek dönüş açıları ölçülmedi; prompt arka görünümden iki yöne küçük adımlar istedi.

`observerHeadFrame` yumuşatılmış baş konumundan bir kare seçer. Kare sınırında 0,08 karelik ek eşik, küçük imleç titreşimlerinin iki poz arasında gidip gelmesini önler. Sürekli küçük baş/gövde dönüşleri ve yay takibi korunur; yeni pozlar arasında yarı saydam geçiş yapılmaz.

Baş alanı, orijinal 1024 × 1536 koordinatlarında x=352, y=64, w=320, h=192’dir; üst gövde y=256’da başlar. Beldeki eski %62–66 katman çakışması da kaldırıldı: sabit alt gövde %64’te başlar, hareketli üst bölge aynı düzlemde kırpılır. Böylece üst gövdenin dönüşünde alttaki ikinci bir bel konturu görünmez. Ayak ve kaya konumu değiştirilmedi.

İmleç çıkınca hedef merkez olur. Sekme gizlenmesi, pencere odağı kaybı veya hareket tercihinin değişmesi pozu sıfırlar. Dokunmatik ve azaltılmış hareket tercihinde takip çalışmaz. Hedefe ulaşıldığında RAF döngüsü durur.

Atlasın dokuz karesi ve orijinal gövdeyle boyun birleşimleri ayrı bir temas tablosunda görsel olarak incelendi. Gerçek tarayıcı yüzeyi erişilebilir olmadığından canlı perspektif ve geçiş estetiği henüz tarayıcı QA’sından geçmedi. Kare sıralaması, sınır titreşimi, merkeze dönüş, hız sınırları ve 30/60/120 FPS tutarlılığı birim simülasyonuyla doğrulandı; bu, canlı görsel doğrulama yerine geçmez.
