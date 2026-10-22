# Sakin yıldızlı arka planın görsel üretimi

## Bu görüntü neden okunurluğu zayıflatıyor; kompozisyon nasıl kurulmalı?

### Takeaway
Ekran görüntüsündeki sorun yalnız parlaklık değil: üç ayrı yoğun galaksi, yüzlerce keskin yıldız ve açık renk metin aynı görsel ağırlık için yarışıyor. Duvar kâğıdı estetiği korunabilir; metinlerin oturacağı geniş ve sakin alanlar görselin üretim brief'ine en baştan konmalı.

### Cited Findings
- Fujifilm'in kompozisyon rehberi negatif alanın tamamen boş veya düz renk olmak zorunda olmadığını; bulanık, daha az renkli veya başka dokulu bir alanın da, ana konuya dönüşmediği sürece negatif alan sayılabildiğini söylüyor. Basitlik, sakinlik ve konuya nefes alanı verme anlatılıyor. — [Fujifilm: Using Negative Space](https://www.fujifilm-x.com/en-gb/learning-centre/using-negative-space/)
- Dijital matte painter Jie Zhou, üretim yöntemini perspektif, ışık ve kamera hareketine göre seçtiğini; sabit veya basit hareketli çekimlerde fotoğrafların Photoshop'ta 2D birleştirilmesini kullandığını açıklıyor. Bu, sanatçının kendi ticari VFX deneyimi; tüm endüstriye ait bir ölçüm olarak aktarılmamalı. — [Jie Zhou: Articles / Matte Painting Workflow](https://www.jiezhouart.com/articles)

### Inferences
- Bu site için **tek bütünlüklü gece göğü**, üç yoğun galaksiden daha uygun. Üç kategori ayrımı HTML başlıklar ve ince yelpaze çizgileriyle yapılabilir; her sektörün ayrı galaksi olması gerekmiyor. Bu bir tasarım önerisi, erişilebilirlik standardı değil.
- Başlıkların arkasında yalnız görüntüyü karartmak yoğun yıldız dokusunu ortadan kaldırmaz. Ton farkları ve ince detay da azaltılmalı; dekoratif en parlak öğeler yazı bantlarından uzaklaştırılmalı.
- İki odak önerisi: önce okunur kategori başlıkları, sonra alt merkezde yalnız figür ve hafif ufuk parlaması. Geri kalan sahne atmosfer taşımalı. Küçük görüntü ve gri tonlu önizleme, büyük parlak şekillerin metinle rekabet edip etmediğini görmeye yarayan bir tasarım kontrolü olabilir.

### Gaps
- “Göğün tam yüzde kaçı boş olmalı?” veya “kaç yıldız ideal?” sorularına bu özel web sahnesi için doğrulanmış evrensel rakam bulunmadı. Aşağıdaki oranlar yalnız başlangıç brief'i.

## Hangi üretim yöntemi bu kişisel siteye uygun?

### Takeaway
İlk sürüm için katmanlı 2D matte painting / fotoğraf kompoziti en doğrudan seçenek. AI konsepti hızlandırabilir; Blender ise ileride kamera veya gerçek 3D karakter hareketi istendiğinde değerlendirilebilir.

### Cited Findings
- Jie Zhou'nun 2D iş akışında fotoğraf referansları Photoshop'ta birleştiriliyor, PSD veya alfaya sahip TIFF teslim ediliyor. 2.5D iş akışında Photoshop katmanları Nuke'ta projeksiyon için hazırlanıyor; 3D temel şekil + Photoshop rötuşunu da ayrı yöntem olarak anlatıyor. — [Jie Zhou](https://www.jiezhouart.com/articles)
- Krita'nın resmi belgesinde katmanların kompozisyonu değiştirmeyi ve öğeleri topluca dönüştürmeyi kolaylaştırdığı; maskelerin saydamlık, dönüşüm ve filtreleri seçici uygulamak için kullanıldığı açıklanıyor. — [Krita: Layers and Masks](https://docs.krita.org/en/reference_manual/layers_and_masks.html)
- Sanatçı Sebastian Sosnowski kendi Blender/Cycles yıldız alanını belgeliyor: yıldızlar için Voronoi, nebula için Noise dokuları, sonuçta parıltı postprocess'i kullanmış. Bu sayfa üretimin mümkün olduğunu gösteren bir sanatçı örneği; web performansı veya ideal görsel yoğunluk kanıtı değil. — [Sebastian Sosnowski: Procedural Starfield](https://sebastiansosnowski.artstation.com/projects/vJw3dD)
- Anna McNaught'ın Adobe Learn uygulamasında dikkat dağıtan nesneler seçilip Generative Fill ile temizleniyor; sonuç özgün görüntüyü değiştirmeyen ayrı bir katmana geliyor. — [Adobe Learn: Remove large areas with Generative Fill](https://www.adobe.com/learn/photoshop/web/remove-image-areas-generative-fill)

### Inferences
- **2D iş akışı önerisi:** önce yalnız büyük ton kütleleriyle kompozisyon; sonra gökyüzü gradyanı, çok zayıf sis/nebula, seyrek sabit yıldızlar, ufuk ve arazi, ayrı figür, en üstte renk düzenlemesi. Önce gerçek başlıklarla maket üstünde dene; ondan sonra detay ekle. Katmanlı kaynak Krita/Photoshop'ta saklanmalı.
- **Fotoğraf kompoziti:** gerçek yıldız göğü + arazi + ayrı figürle inandırıcı doku elde edilebilir. Farklı fotoğraflarda ufuk/perspektif/ışık eşleştirmesi gerekir. Çok yoğun astrofotoğrafı aynen yerleştirmek yerine dokuyu maskelemek veya boyayarak sadeleştirmek gerekir. Fotoğrafın kaynağı ve kullanım hakkı ayrıca belirlenmeli.
- **AI destekli konsept:** önce 2–3 kompozisyon varyasyonu; yazısız, çizgisiz, figürsüz temiz gökyüzü ve ayrı saydam figür varlığı. Sonra katmanlı rötuşla metin bölgelerini temizleme. AI'dan tek seferde bitmiş arayüz istemek kategori çizgilerini ve metni görüntüye kilitler; bu site için uygun değil. Üretimin görsel brief'e uyması ayrıca incelenmeli.
- **Blender prosedürel sahne:** koyu World, eşiklenmiş seyrek yıldız dokusu, çok hafif sis, arazi/figür katmanlarıyla yoğunluk ve ışık tekrar üretilebilir. İlk kurulum/rötuş emeği daha yüksek; mevcut sabit kamera için şart değil. Blender'dan sabit görüntü dışa aktarıp sitede kullanmak ile ziyaretçinin cihazında gerçek zamanlı 3D çalıştırmak iki ayrı karardır.
- Bu aşamada önerilen üretim yolu: AI veya elle boyanmış konsept + 2D katmanlı temizleme; siteye sakin raster gökyüzü ve ayrı figür; seçilmiş birkaç yıldız kodla hareket eder. Böylece metin, yelpaze çizgileri ve animasyon görselin içine gömülmez.

### Gaps
- Seçenekler arasında bu tek proje için doğrulanmış süre/maliyet karşılaştırması yok. “Daha doğrudan / daha çok kurulum” değerlendirmeleri sahnenin kapsamına dayalı çıkarımlar.

## Somut görsel üretim brief'i ne olmalı?

### Takeaway
Hedef; karanlık ama düz olmayan, yalnızlık ve ölçek hissi veren bir gece manzarası. Ekranın çoğunda koyu ve düşük detaylı gökyüzü; altta ince arazi ve küçük bir insan, çok az yıldız ve ufka yakın tek hafif ışık odağı.

### Cited Findings
- Negatif alan dokulu da olabilir; asıl ayrım, o dokunun ana konuya dönüşmemesidir. Bu yüzden atmosferi korumak için gökyüzünü tamamen siyaha indirmek zorunlu değil. — [Fujifilm](https://www.fujifilm-x.com/en-gb/learning-centre/using-negative-space/)
- Düzenlenebilir öğeler ve seçici maskeleme, kompozisyon değişikliklerini kolaylaştırır. — [Krita](https://docs.krita.org/en/reference_manual/layers_and_masks.html)

### Inferences
Önerilen brief; aşağıdaki yüzdeler ve yıldız sayıları **tasarım başlangıç değerleridir, standart değildir**:

> Geniş sinematik gece manzarası; derin lacivert/antrasit, çok hafif mor ve petrol yeşili atmosfer; düşük doygunluk ve düşük yerel kontrast. Üst ve orta yaklaşık %65–75 sakin negatif alan: üç kategori başlığının arkasında parlak yıldız, yoğun nebula veya belirgin ışık şeridi yok. Tek gökyüzü; üç ayrı galaksi yok. Zayıf sütlü bir sis dokusu yalnız kenarlara ve alt ufka yakın. Alt yaklaşık %8–12 koyu arazi, küçük kaya, alt merkezde arkadan görünen yalnız insan; insan ve arazi ayrı katmanlar. Çok hafif amber ufuk ışığı figürü ayırır, merkezden yukarı uzanan parlak galaksi sütunu oluşturmaz. Sahnede seyrek küçük yıldızlar, örneğin ilk denemede 20–40 görünür nokta; yalnız 3–5 tanesi belirgin. Yazı, logo, kategori çizgileri, teleskop ve spot ışığı üretilmesin. Geniş masaüstü ve dar mobil kadraj ayrıca değerlendirilsin.

- Hareket ayrıca tasarlanmalı: yıldızların tamamını titreştirmek yerine birkaç bağımsız düşük genlikli parlama; figürde neredeyse hissedilmeyen nefes/salınım. Bu, kullanıcının isteği doğrultusunda bizim sanat yönetimi önerimizdir.
- En önemli üretim sırası: **gerçek başlıkların yerlerini ayır → sakin kompozisyonu kur → başlıklarla kontrol et → yalnız gerekli yerlere detay ekle**. Yeni görsel üretmeden de mevcut görsel üzerinde başlık bantlarındaki galaksi dokusunu temizleyen rötuş denenebilir; yalnız tek bir genel siyah overlay'e güvenilmemeli.

### Gaps
- Kullanıcı fotoğraf gerçekçiliği ile boyanmış/sadeleştirilmiş üslup arasında henüz nihai seçim yapmadı. İlk karşılaştırma için aynı yerleşimde “minimal astrofotoğraf” ve “stilize matte painting” iki görsel yönü yeterli olur.
