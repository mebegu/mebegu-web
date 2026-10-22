# Yıldızlı sahnede metin okunabilirliği

Araştırma tarihi: 22 Ekim 2026. Kapsam: kullanıcının paylaştığı ekran görüntüsündeki üç dilimli ana sayfa. Bu dosya araştırma notudur; site değiştirilmedi.

## 1. Ekran görüntüsündeki yazılar neden zor okunuyor?

### Takeaway

Ekran görüntüsünde parlak Samanyolu, yoğun yıldız noktaları ve büyük başlıklar aynı bölgelerde yarışıyor. Bu bir ekran görüntüsü üzerinden görsel teşhistir; ölçülmüş kontrast ihlali iddiası değildir. Başlangıç problemi yalnız yazı rengi değil, metin için sakin alan bırakmayan kompozisyondur.

### Cited Findings

- WCAG 2.2 AA, normal metinde en az 4.5:1, büyük metinde en az 3:1 kontrast ister. Büyük metin normal ağırlıkta 18 pt / 24 CSS px veya kalında 14 pt / yaklaşık 18.7 CSS px eşiğindedir. İnce veya sıra dışı fontlar, nominal kontrastı sağlasa bile yumuşatma nedeniyle daha soluk görünebilir; daha güçlü çizgi veya minimumun üzerinde kontrast önerilir. — [W3C Understanding Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- W3C G18, desenli veya değişken parlaklıklı görsellerde harflerin arkasındaki bölgelerin kontrastını ele alır; görselin genel rengine bakmak yeterli değildir. Arka plan bölgesini gölgelemek veya yeterli kontrast sağlayan hale/çizgi eklemek olası tekniklerdir. — [W3C Technique G18](https://www.w3.org/WAI/WCAG22/Techniques/general/G18)
- Google’ın resmi Material 1 imagery rehberi, görsellerde belirgin odak ve az sayıda anlamlı unsur önerir; dekoratif arka planın ön plan içeriğiyle etkileşim sırasında örtülebileceğini belirtir. Bu eski bir rehberdir; güncel stil modasına kanıt olarak değil, kompozisyon ilkesi olarak kullanılmıştır. — [Material Design: Imagery](https://m1.material.io/style/imagery.html)

### Inferences

- Bizde en kritik alan, ortadaki “Profesyonel” başlığının arkasına denk gelen açık renkli ve yoğun galaksi şeridi. Krem metin, yakın açıklıktaki yıldızlarla yer yer birleşiyor. Bu gözlem kontrast ölçümü değildir.
- Üç büyük yazı, açıklamaları, sıra numaraları, yıldız simgeleri, “Keşfet” ve “Bir yol seç” aynı sahnede birçok küçük odak yaratıyor. Yeni görselde üç kategori ve insan silüeti hiyerarşide önde olmalı; dekoratif ayrıntılar onları desteklemeli.
- “4.5:1 geçti, artık rahat okunur” sonucu çıkarılmamalı. Kontrast bir asgari ölçüttür; harf biçimi, görsel yoğunluk, metin büyüklüğü ve hedefi bulma kolaylığı da incelenmeli. Bu yorum, aşağıdaki deneysel bulguyla da uyumlu.

### Gaps

- Gönderilen ekran görüntüsünden piksel düzeyinde kontrast hesabı yapılmadı. Mevcut CSS/kompozit görüntü ayrıca ölçülmeden WCAG uyumlu/uyumsuz denilemez.
- Bu sitedeki Türkçe uzun başlıkların gerçek okuma hızı veya ilk tıklama başarısı kullanıcılarla ölçülmedi.

## 2. Güzel bir masaüstü duvar kâğıdı, okunabilir web arka planına nasıl dönüşür?

### Takeaway

Görseli baştan metne yer açacak şekilde tasarlamak ve gerekirse yalnız yazı bölgelerini yumuşakça korumak en uygun yön. Büyük cam kartlar eklemek zorunlu değil; sakin bir gökyüzü ve görünmez geçişli yerel karartma aynı üç parçalı sahneyi koruyabilir.

### Cited Findings

- Material imagery, metin koruması için yarı saydam scrim katmanını tarif eder. Büyük görsellerde her yeri karartmak yerine metnin bulunduğu alanların hedeflenmesini ve uzun, doğal geçişli gradyan kullanılmasını önerir. Opaklık görsele bağlıdır; örnek yüzdeler evrensel eşik değildir. — [Material Design: Text protection](https://m1.material.io/style/imagery.html#ui-integration)
- W3C G18’in açık renkli harf çevresini koyulaştırma ve hale teknikleri, metin bölgesine özel korumanın geçerli uygulamalar olabileceğini gösterir. Yumuşak dekoratif gölge eklendi diye kontrastın otomatik sağlandığı sonucuna varılamaz. — [W3C Technique G18](https://www.w3.org/WAI/WCAG22/Techniques/general/G18)
- TU Delft’te 2025 tarihli 25 katılımcılı yüksek lisans çalışması, karmaşık arka plan üzerinde metin arama deneyinde yazı boyutu, çizim biçimi ve gölgenin birlikte etkili olduğunu raporlar. Gölge düz metnin okunmasını iyileştirmiş; arka yüzeyli metin koşulları düz metni geride bırakmıştır. Çalışma saydam ekran bağlamındadır; doğrudan web sitesi için reçete sayılamaz. Burada yalnız kurumun yayımladığı özet incelendi; tam tez doğrulanmadı. — [Sharma, TU Delft Repository](https://repository.tudelft.nl/record/uuid%3Ab9e5e25d-08a2-4fae-ba1d-ec97f0da3601)

### Inferences

Bu projeye özel öneri; sayılar standart veya araştırmadan çıkarılmış optimum değerler değildir:

1. **Görsel brief’i:** Alt yüzde 10–15’te siyah zemin ve tek insan; gökyüzünde geniş koyu lacivert boşluklar; sisli, düşük kontrastlı Samanyolu; kategorilerin arkasından geçen parlak galaksi çekirdeği olmaması. İlk görsel üretiminde başlık yerleri yaklaşık dikdörtgen güvenli bölgeler olarak işaretlenmeli. “Çok detaylı, ultra keskin, epik galaksi” yönü, metinle yarışan ayrıntı üretebilir.
2. **Bilgi ve görsel katmanlarını ayırma:** Zemin, gökyüzü, az sayıda parlayan yıldız, insan, dilim sınırları ve HTML metin ayrı katmanlar olarak kalmalı. Böylece görsel yeniden üretilmeden animasyon ve okunabilirlik değiştirilebilir.
3. **Sakinlik hedefi:** Ekranın yaklaşık yüzde 60–70’inin düşük ayrıntılı koyu gökyüzü olarak kalması denenebilir. Fotoğrafın her noktası aynı derecede ilgi çekici olmamalı. Bu oran sanatsal bir başlangıç önerisidir.
4. **Yerel scrim:** Başlık/açıklama gruplarının arkasında çok geniş ve kenarı görünmeyen lacivert radyal gradyanlar denenebilir. Başlangıçta merkezde yüzde 35–55 opaklık, çevrede sıfıra geçiş; son değer gerçek kontrast ölçümüyle bulunur. Daha sakin bir kaynak görselde çok daha az karartma yeterli olabilir.
5. **Tipografi:** Başlıkta güçlü çizgili serif kullanılabilir; küçük açıklama ve eylem yazıları açık kırık beyaz, görece düz ve güçlü bir sans serif olmalı. Küçük altın renk metin yalnız dekor için kalmalı; asıl gezinme etiketleri belirgin okunmalı. “Keşfet” her dilimde korunacaksa belirginliği başlıktan sonra gelmeli.
6. **Gölge:** Hafif gölge yardımcı son dokunuş olabilir. Ana çözüm olarak ağır gölge, kalın kontur veya parlayan harfler kullanmak sahneyi daha yoğun hale getirebilir; önce görseldeki rekabet azaltılmalı.
7. **Sosyal şerit:** Siyah zemin üzerinde sakin, yeterince açık etiketler. Yıldızlı bölgeden ayrı bu mevcut alan doğru yöndedir; placeholder durumunun solukluğu ile okunabilirlik ayrıca değerlendirilmeli.

### Gaps

- “Yıldız sayısını şu kadar azaltmak” için bu tasarıma özgü bilimsel bir optimum yok. Azaltma ve boşluk oranları art direction kararıdır, ardından gerçek sayfada değerlendirilir.
- Arka yüzeyli etiketlerin deneyde daha iyi olması bu sitede cam kart eklemeyi gerektirmez; farklı bağlam ve görev söz konusudur.

## 3. Farklı ekranlarda nasıl doğrulanmalı?

### Takeaway

Masaüstünde doğru görünen tek bir görselin `cover` ile telefona kırpılması, parlak alanları yazıların arkasına taşıyabilir. Mobil için daha sade ayrı bir kompozisyon ve gerçek ekran boyutlarında kontrast/odak kontrolü planlanmalı.

### Cited Findings

- MDN, `<picture>` öğesinin farklı ekran koşullarında farklı kırpımlar veya daha az ayrıntılı bir görsel sunmak için kullanılabileceğini açıkça belirtir. Konum ve doldurma davranışı, içteki `<img>` üzerindeki `object-position` ve `object-fit` ile kontrol edilir. — [MDN: picture element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture)
- W3C, kontrast değerlendirmesinde antialiasing ile solmuş harf kenarı yerine tanımlanmış ön plan/arka plan renklerine bakılmasını; ince çizgilerde eşikten daha güçlü kontrastın tercih edilmesini açıklar. — [W3C Understanding Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

### Inferences

- Önerilen kontrol boyutları: 1440×900, 1920×1080, 390×844 ve 360×800. Bunlar proje için örnek test boyutlarıdır, normatif liste değildir. Ayrıca yatay telefon, yüzde 200 büyütme ve TR/EN başlık uzunlukları kontrol edilir.
- Kontrast için CSS’deki amaçlanan yazı rengi, resim ve scrim birleştirildikten sonraki arka planla karşılaştırılmalı. Arka planın ortalama veya temsili koyu rengi yeterli değil; metin bölgesindeki açık renkli noktalar da kontrol edilmeli. Ölçüm renk sayısına indirgenmeden gerçek görünümle birlikte değerlendirilir.
- Sadece ilk kare kontrol edilmemeli: parlayan yıldızın en parlak durumu, hover ve focus görünümü de metin korumasını bozmamalı. En sağlam yaklaşım, yıldızları doğrudan metnin arkasından uzak tutmaktır.
- Masaüstü ve mobil için kaynak görsel değişebilir; HTML bağlantılar, kategori adları ve odak sırası korunur. Mobilde küçülen başlık büyük metin eşiğinin altına inerse 3:1 istisnasına güvenilemez.

### Gaps

- Bu araştırma sırasında site tarayıcıda açılıp ölçülmedi. Önerilen gradyan yüzdeleri veya güvenli alanlar henüz doğrulanmış uygulama değerleri değildir.
- Erişilen deneysel kaynakların kapsamı, bu üç fan şeklindeki gezinme bölgesinin mobil kullanılabilirliğini doğrudan değerlendirmiyor; gerçek prototipte ayrıca denenmeli.
