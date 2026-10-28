# Professional: tasarım ve recruiter incelemesi

28 Ekim 2026. Tek ajanla, önce tasarım ardından recruiter senaryosu incelendi. Uygulama değiştirilmedi. İncelenen sürüm `cv-sync`, HEAD `d7c309a`; mevcut üretim build'i yerel HTTP sunucusunda açıldı. Bu rapor yayındaki sitenin bu sürümü kullandığı iddiası değildir.

## Değerlendirme

Sayfanın kendine ait bir görsel kimliği ve güçlü mesleki içeriği var. Buna karşılık bilgiye erişme sırası, hızlı bir mesleki değerlendirme için yeterince iyi değil. Takımyıldızını kaldırmak gerekmiyor; mesleki kanıtı daha erken görünür ve etkileşimleri daha anlaşılır yapmak gerekiyor. Bu, seçilen konseptin reddi değil, uygulanışının eleştirisi.

Kanıt: [masaüstü](evidence/design-1280.png), [mobil](evidence/design-390.png), [açılmış gerçek proje](evidence/recruiter-project.png), [ziyaret akışı](evidence/recruiter.json).

## Web tasarımcısı gözüyle

**İlk izlenim:** Koyu gökyüzü, sıcak bağlantılar ve küçük insan figürü kişisel bir dünya kuruyor. Önceki beyaz CV belgesi hissinden uzak. İlk bakışta isim, rol ve PDF eylemi bulunabiliyor. Profesyonel bir portföy kadar, interaktif bir kişisel deneyim izlenimi de veriyor. Bu ikinci izlenimin işe alım bağlamında ne kadar baskın olacağı bir tasarım kararı.

**Başarılı taraflar:**

- Kimlik, sahne, bağlantılar ve proje paneli tek bir kompozisyon oluşturuyor. Mobilde konsept korunuyor.
- Ana eylem olan PDF indirme belirgin. Gövde metni gerçek HTML; dekorasyon metnin yerine geçmiyor.
- Açılmış projelerde işveren, rol, ekip, katkılar ve teknoloji sıralaması anlamlı. Bu bölüm, adayın gerçek işini değerlendirmek için güçlü.
- Alt bölümlerin koyu ve sakin yüzeyleri, yıldızlı açılıştan daha uzun metinleri okumaya uygun.
- Kavramsal görsellerin açıkça etiketlenmesi ve müşteri isimlerinin anonim olması dürüst bir sunum sağlıyor.

**Tasarım sorunları:**

| ID | Bulgu | Etkisi ve tartışılacak yön |
| --- | --- | --- |
| D1 | Mesleki özet Profile arkasında, şehir Contact arkasında. Deneyim ilk ekranın dışında. | Görsel kimlik, adayın ne kadar deneyimli olduğunu ve nerede olduğunu öğrenmekten önce geliyor. Takımyıldızını koruyarak hangi iki veya üç mevcut gerçeğin hemen görünmesi gerektiğini seçmeliyiz. Yeni kısa metin gerekiyorsa upstream alanı olmalı. |
| D2 | Yetenek düğmeleri ile proje bağlantıları aynı görsel ağırlıkta. Haritada açık bir yönlendirme veya grup başlığı yok. | İlk bakışta etiketlerin hepsi bağlantı, filtre veya sadece dekorasyon gibi algılanabilir. Sağ ve sol tarafın görevini küçük, gerçek HTML etiketleri veya daha net durum tasarımıyla anlatmak mümkün. |
| D3 | Açılış ile sayfanın devamı arasında deneyim farkı var. | Üst bölüm kişisel bir sahne; devamı uzun bir CV akışı. Bölümler arası kısa erişim yolları ve daha tutarlı bir okuma ritmi bu iki kısmı bağlayabilir. |
| D4 | Mobilde rol 12px, harita proje etiketleri 13px, bazı eylemler 11px. | Taşma yok, ancak rahat okuma ile ekrana sığdırma arasında sıkışıklık var. Bu bir minimum font boyutu kaynaklı WCAG ihlali iddiası değil; okunabilirlik değerlendirmesi. |
| D5 | Teknoloji ikonları açık kare zeminler üzerinde sık tekrarlanıyor. | Tek tek anlaşılırlar; bir arada beyaz parçacıklar ve tekrar eden AWS logoları metin taramasını bölebiliyor. Metin hiyerarşisi önde kalacak daha sakin bir ikon düzeni tartışılmalı. |
| D6 | 12 proje için iki temsili illüstrasyon tekrar kullanılıyor. | Görseller bir süre sonra projeleri ayırt etmiyor. Daha fazla görsel üretmek zorunlu değil; sadece katkı sağladığı projelerde kullanmak da bir seçenek. |

Açılıştaki boşluk tek başına hata değil; sahnenin etkisini sağlıyor. Sorun, bu alanın ziyaretçiye hangi mesleki bilgiyi ne zaman verdiği. Daha çok metin veya daha çok kart eklemek kendiliğinden çözüm olmaz.

## Recruiter senaryosu

Bu bölüm gerçek recruiter kullanıcı araştırması değildir. Denediğim görevler üzerinden işe alım bağlamındaki olası düşünce ve soruları çıkarıyorum; uydurma okuma süresi veya dönüşüm oranı vermiyorum.

**Denediğim akış:** Ana sayfadaki görünür Professional başlığına tıkladım; Profile ve Contact'ı açtım; CRM yıldızını seçtim; View project ile tam kayda gittim; geri döndüm; PDF indirdim. Bu akış JavaScript açıkken tamamlandı. Ana sayfanın tam ekran poligon bağlantısının geometrik merkezine yapılan otomasyon tıklaması başka dilime denk geliyordu; görünür başlığa tıklamak çalıştı. Bu otomasyon geometrisi bulgusunu “ana sayfa bağlantısı bozuk” diye sınıflandırmıyorum.

| Aşama | Öğrendiklerim | Olası recruiter düşüncesi |
| --- | --- | --- |
| İlk ekran | İsim, Senior Cloud & Backend Engineer rolü, AWS/IoT/graph odağı ve PDF erişimi | “Alanıma uygun olabilir; görsel olarak kişisel. Deneyim yılı, mevcut işi ve konumu nerede?” |
| Profile ve seçili proje | 7+ yıl; serverless/event-driven AWS; 20M+ cihazlık platform | “Bu yalnızca teknoloji listesi değil, ciddi ölçekte üretim tecrübesi var.” |
| Experience | Concept Reply ve Motius danışmanlığı; OTA, audit trail, altyapı ve üretim sorumluluğu | “Uygulama ve operasyonu birlikte taşıyan bir backend/cloud profili.” |
| CRM detayı | Sekiz kişilik Scrum ekibi, 3+ yıl liderlik, 19 analitik motor, Neo4j ve RAG | “Teknik liderlik için değerlendirilebilir. Bu güçlü kanıt neden daha erken karşıma çıkmadı?” |
| Contact ve Languages | Münih; e-posta/LinkedIn/GitHub; İngilizce ileri, Almanca daha sınırlı | “Pozisyonun lokasyon ve dil ihtiyacına göre uygunluğu değerlendirebilirim.” |

**Bu sayfadan çıkardığım aday profili:** AWS üzerinde backend/cloud geliştiren; IoT ve veri/graph sistemlerinde üretim tecrübesi olan; ekip liderliği de yapmış bir mühendis. İçerik senior backend/cloud ve bazı teknik liderlik görüşmeleri için güçlü kanıt sunuyor. Uygunluk, gerçek iş tanımına bağlı; sayfa tek başına mülakat kararı garantilemez.

**Değerlendirmeyi zorlaştıranlar:**

- Deneyim masaüstünde yaklaşık y=1.058px, mobilde y=1.168px'de başlıyor. Açılış mesleki geçmişi göstermeden önce geniş yer kullanıyor.
- Kapalı proje listesinin başlığı masaüstünde yaklaşık y=3.890px, mobilde y=5.162px'de. Harita/Experience bağlantısı bilen okuyucuya kestirme sağlıyor; normal kaydıran ziyaretçi için Skills, Education, Languages, Teaching ve Interests araya giriyor.
- Mobilde Skills bölümü tek başına yaklaşık 1.256px. Teknoloji genişliği güçlü fakat aynı anda öncelik, derinlik ve güncellik bilgisini vermiyor. Yüzdeler eklemek çözüm değil; hangi işte kullanıldığını öne çıkarmak daha anlamlı.
- “Client A/B/F” kimliği koruyor ama metni redakte edilmiş iç doküman gibi gösterebiliyor. Kamuya açık sektör/iş tanımları varsa kaynaktan sağlanması daha doğal olur. Sektör uydurulmamalı.
- İş arama durumu, tercih edilen rol veya çalışma koşulları bu akışta öğrenilemiyor. Bunların eksikliği otomatik kusur değil; sayfanın aktif işe alım amacı varsa owner kararı ve kaynak verisi gerektirir. “Hire me” banner'ı gerektirmez.

## Yazı ve görsellerin doğallığı

İncelediğim mesleki metinlerde genel bir slogan veya boş motivasyon dili baskın değil. Ölçek, yapılan işler ve ekip büyüklüğü gibi somut bilgiler güveni artırıyor. AWS ve üretim terimlerinin bulunması tek başına yapay anlatım işareti değil. “Client A/B” tekrarları ve belgeye ait “sonraki sayfalarda” ifadesi ise web sayfasına sonradan aktarılmış içerik hissi veriyor. Bunu AI yazarlığı teşhisi olarak sunmuyorum.

İllüstrasyonlar müşteri ürünü gibi sunulmuyor; bu iyi. Aynı iki resmin çok projede kullanılması, resimlerin özgüllüğünü azaltıyor. Yeni görsel üretmeden önce her resmin gerçekten hangi bilgiyi desteklediğini sormak daha doğru.

## Tartışma önerisi

Takımyıldızı kalsın. İlk kararımız şu olsun: ziyaretçi, herhangi bir şey açmadan isim/rol dışında hangi mevcut üç gerçeği görmeli? Ardından proje kanıtına erişim, haritadaki etkileşim dili ve gövdenin ritmi üzerinde konuşalım. Önerileri owner seçimi olmadan uygulamayalım.
