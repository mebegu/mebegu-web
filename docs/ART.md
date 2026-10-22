# Gökyüzü ve karakter görselleri

Üretim: **yerleşik image_gen aracı**, 22 Ekim 2026. CLI/API fallback kullanılmadı. Kullanıcının eklediği fotoğraf atmosfer/zemin, kutu illüstrasyonu ise üç parçalı kompozisyon referansıydı. Kaynak fotoğraflar doğrudan siteye kopyalanmadı.

## Kaydedilen dosyalar

- `public/art/brush-swipe.svg`: kodla çizilmiş, düzensiz kenarlı ve kıl boşluklu fırça izi maskesi. Güncel sahnedeki renkli kâğıt paneller, yırtık kenarlar ve ince lifler `PaperSky.astro` ve `sky-layout.ts` ile üretilir; bu öğeler için image_gen kullanılmadı.
- **Güncel ana sayfa:** `docs/art-source/night-sky-horizon.png` ve `public/art/night-sky-horizon.webp` (1586 × 992; WebP 238.628 bayt). Parlak diyagonal galaksi yerine ufka yakın, çok sığ U/parabola biçiminde silik bir bant vardır. Turuncu ufuk ve kaya yerleşimi korunur; önceki/yeni kaynakta merkez kaya başlangıcı aynı y=905 konumunda ölçüldü.
- `docs/art-source/night-sky-starlit.png` ve `public/art/night-sky-starlit.webp` (1586 × 992; WebP 471.022 bayt): önceki yoğun, diyagonal Samanyolu; artık ana sayfada kullanılmaz.
- **Güncel baş atlası:** `docs/art-source/observer-heads-v2.png` (1254 × 1254, şeffaf 3 × 3 üretim) ve `public/art/observer-heads-v2.webp` (960 × 576, 119.658 bayt). Dokuz yön pozu tek görselde tutulur; her kare 320 × 192 olarak aynı boyun pivotuna hizalanır. Kırpma, ölçekleme ve atlas paketleme Sharp ile yapılmıştır; yeni baş çizimleri yerleşik image_gen çıktısıdır. Runtime’da yalnız tek kare gösterilir, opaklık karışımı yoktur.
- **Önceki yönlü baş pozları (arşiv):** `docs/art-source/observer-left.png`, `observer-right.png`; web dosyaları `public/art/observer-left.webp` (88.562 bayt) ve `observer-right.webp` (83.576 bayt). Yeni atlas bu pozların yerini aldı; kaynaklar referans/arşiv olarak korunur.
- `docs/art-source/night-sky-organic.png` ve `public/art/night-sky-organic.webp` (1586 × 992; WebP 42.276 bayt): önceki sade manzara, artık ana sayfada kullanılmaz.
- `docs/art-source/night-sky-majestic.png` ve `public/art/night-sky-majestic.webp` (1586 × 992; WebP 142.976 bayt): önceki ayrıntılı gökyüzü; artık ana sayfada kullanılmaz.
- `docs/art-source/night-sky-quiet.png` ve `public/art/night-sky-quiet.webp` (1586 × 992; WebP 81.188 bayt): önceki sakin gökyüzü.
- `docs/art-source/night-sky.png`: ayırıcı çizgileri olmayan gökyüzü ve zemin, 1586 × 992.
- `docs/art-source/observer.png`: alfa kanallı tek karakter, 1024 × 1536.
- `public/art/night-sky.webp`: web için format dönüşümü, yaklaşık 390 KB.
- `public/art/observer.webp`: alfa korunarak web için format dönüşümü, yaklaşık 94 KB.

SVG ayırıcılar, HTML metinleri, animasyonlar ve sosyal şerit görsele gömülü değildir. Karakter idle hareketi sayfa kodunda uygulanır; görsel tek kareliktir. WebP dönüşümü görüntü içeriğini değiştiren bir üretim/edit adımı değildir.

## Kullanılan prompt seti

### Dokuz ara baş pozu — güncel karakter

Yerleşik image_gen düzenleme modu; orijinal karakter kimlik referansı, önceki sol/sağ pozlar yön referansı olarak kullanıldı. Tek şeffaf sprite atlası üretildi. CLI/API fallback kullanılmadı. Web atlasında her başın alfa sınırı ve boyun kesiti ölçülerek sabit pivota kırpma/ölçekleme yapıldı; karakter gövdesi orijinal dosyada kaldı.

```text
Use case: identity-preserve. Asset type: ONE transparent 3 by 3 sprite sheet of nine directional HEAD poses for the existing small back-view website character. Image 1 is the original neutral character and the strict identity/style reference. Images 2 and 3 are references for the full left and right head turns only. Produce ONLY nine isolated HEADS with a short neck, NOT bodies, not shoulders, not jackets, no background or blue aura. Preserve the same young adult anonymous character, dark tousled hair, head size and very dark photographic charcoal lighting with a faint cool rim. Camera remains behind the person. One single 1536x1536 square transparent PNG, split into an invisible exact 3x3 equal grid (each cell 512x512). Reading left to right, top to bottom, head yaw angles toward IMAGE LEFT/RIGHT are: row 1: LEFT 35 degrees, LEFT 26 degrees, LEFT 17 degrees; row 2: LEFT 8 degrees, NEUTRAL BACK VIEW 0 degrees, RIGHT 8 degrees; row 3: RIGHT 17 degrees, RIGHT 26 degrees, RIGHT 35 degrees. This is a smooth turn, not nine different characters. At extremes show only a slight rear three-quarter cheek/nose silhouette on the corresponding side, never a frontal face. CRITICAL ANIMATION REGISTRATION: every head uses exactly the same scale and neck pivot. Within each 512x512 cell, the neck base is at x=256,y=450, head top near y=80, head width about 300 pixels, and the entire short neck ends at y=450 on a horizontal cut. Keep the skull the same height/size across all nine frames, rotating around the fixed neck anchor rather than drifting sideways. Plenty of transparent padding, no clipping. No white dividers, no frame borders, no labels, no numbers, no arrows, no text, no checkerboard printed into the image. Genuine alpha transparency, clean edges, no shadows, no glow cloud or halo outside the silhouette. This must be a clean production head-pose sprite atlas, each pose clearly distinct yet closely spaced, not a contact sheet of full-body people.
```

### Ufka paralel silik galaksi — güncel gökyüzü

Yerleşik image_gen ile `night-sky-starlit.png` düzenlendi; ikinci adımda U’nun iki ucu alçaltılarak eğriliği azaltıldı. CLI/API fallback kullanılmadı. Son PNG ve WebP projeye kaydedildi.

```text
Use case: precise-object-edit.
Asset type: revised photographic sky plate for a personal website.
EDIT TARGET: the supplied current night landscape, 1586x992. Retain the exact canvas, existing dark ground/grass and central rock position, and warm orange horizon.
Change the GALAXY COMPOSITION and reduce its visual force:
1. Completely REMOVE the current bright diagonal Milky Way running from the bottom-left/centre up to the upper-right. Reconstruct a continuous natural dark star field there; no diagonal or vertical luminous band may remain.
2. Replace it with ONE FAINT, VERY BROAD, NEARLY HORIZONTAL galactic haze across the LOWER sky. Its centreline is a very shallow, flat U / wide parabola: at the left edge y≈65%, at x=50% y≈75%, at the right edge y≈65%. Thus the centre sits only slightly lower than the ends. It should read almost parallel to the ground/horizon. Not a tall U, V, sharp arc, rainbow, semicircle, tilted streak or radial spokes.
3. The U is only the diffuse placement of natural smoky astronomical light and dust, NOT a drawn shape or continuous outlined ribbon. Very soft irregular edges, dim silver-blue and dusty mauve. No bright galactic nucleus. Luminosity/contrast of this haze around HALF the current galaxy; saturation lower too. Keep it clearly perceptible but secondary to website labels.
4. Keep a moderately rich natural star field across the sky: more atmospheric interest than an empty smooth sky, but noticeably fewer/lower-contrast bright specks than this target. Fine irregular stars, not glitter or dense noise.
5. Preserve the full-width orange/amber horizon transition, soft and warm, blending into indigo above. Keep its position and character, slightly soften excessive brightness. Preserve the existing terrain and centre rock so a separately positioned person still stands on it.
Website composition: the upper and middle 60% remain dark and calm with natural stars. Label positions x≈15%,34%,65%,86%, y=25–55% must stay low contrast. The lower shallow haze must support the existing fan-shaped webpage composition, never create a competing diagonal. Not over-minimal; target a balanced midpoint between a blank sky and this overly dramatic photograph.
Natural photographic tonal structure only. No repeated cellular/diamond/triangular mesh, bead textures, mosaic, smudged plastic, strong sharpening, glowing star icons, band outlines, added people, moon, planets, telescope, spotlight, water, mountain range, buildings, text, logos, sector lines or UI.
```

Eğriliği sığlaştıran son düzenleme:

```text
Edit ONLY the curvature/placement of the faint galaxy haze in this image.
The current U is still too deep. Make it MUCH FLATTER and almost horizontal, like an extremely wide shallow parabola running parallel to the low horizon. Lower BOTH far ends of the haze substantially: the haze centreline at the left and right edges should be at y≈69% of the frame, and at the middle at y≈75%. Only about 6% of image height between ends and middle, not the current ~20%. Keep its diffuse width soft, with the upper boundary of ALL haze below y=63%. A gently sagging horizontal cloud of starlight, not a prominent U shape, rainbow, V or semicircle.
Erase the haze currently rising at y=50–62% near both side edges and replace it with the existing dark natural star field. Reconstruct that area seamlessly. No diagonal or vertical galaxy band.
Keep the current restrained haze brightness, natural organic astronomical texture, star density, colours, exact 1586x992 canvas, all orange/amber horizon gradients, all ground and central rock position unchanged. No new objects or text. This is a focused adjustment making the existing low U flatter, nothing else.
```

### Fotoğraf referanslı Samanyolu — güncel gökyüzü

22 Ekim 2026: yerleşik image_gen, kullanıcının son eklediği dört fotoğraf kompozisyon/atmosfer referansı olarak kullanıldı. Gerçek fotoğraflar siteye doğrudan kopyalanmadı. CLI/API fallback kullanılmadı.

```text
Use case: photorealistic-natural.
Asset type: rich but readable astronomical landscape background for a personal website, wide 16:10 composition, approximately 1586x992.
The four supplied photographs are visual REFERENCES ONLY. Reference 1: natural fine-scale star field, mauve Milky Way and rich warm orange airglow. Reference 2: luminous depth and wonder, NOT its boat/water/reflection. Reference 3: believable astrophotography and restrained blue star light, NOT its village or mountains. Reference 4: low dark foreground with a small centre rock, sense of a person beneath immense sky, but NO person in the output.
Create an original convincing photographic night landscape with a CLEARLY VISIBLE, beautiful Milky Way, many naturally tiny, sharply varied pinprick stars, authentic smooth large dust lanes and luminous soft mauve/silver-blue galactic haze. Rich visual depth comparable to the reference photos, NOT a mostly blank dark gradient. The Milky Way rises from the lower middle toward the upper right/centre; the brighter dusty core is near the lower middle, with softer detail high above. Preserve dark pockets around x=15%,34%,65%,86% at y=25–60% for website labels and hover descriptions, but these must blend naturally into a continuous lively sky, not big artificial blank holes. Title labels have their own separate paint backgrounds.
Bring back a WARM ORANGE / AMBER GLOW along the ENTIRE low horizon, smoothly transitioning upward through muted copper and dusty mauve into deep indigo. This warm full-width horizon is essential. It should be atmospheric night airglow, not daylight or a sunset sun.
Natural optical detail, restrained contrast and low saturation: foreground black, star field dimensional, galaxy gorgeous but not blinding. Fine real stars are welcome. Absolutely avoid the earlier generated faceted mesh: no diamond/triangle lattice, bead cells, worm-like repeated texture, fish scales, mosaic, pointillist cloud patches, plastic folds, painted nebula or sharpening halos. Dust clouds must have continuous, irregular, organic tonal structure instead of repeated micro-patterns.
Ground is a nearly black low grass/rock silhouette only in the bottom 9–10%, with a small low central rock whose upper surface is near y=90.2%. No person (separate sprite overlay), telescope, spotlight, moon, planets, water, boat, reflections, forest, tall mountains, village, buildings, text, logos, game illustrations, sector dividers, borders or UI. The image is only the landscape plate. Photographic rather than fantasy illustration.
```

### Sol ve sağ baş pozları — güncel karakter

Yerleşik image_gen ile `docs/art-source/observer.png` üzerinde iki ayrı düzenleme. Aşağıdaki prompt iki kez kullanıldı: `IMAGE SIDE` yerine sırasıyla `the LEFT side of the image` ve `the RIGHT side of the image` geçirildi. Şeffaflık korundu. Tüm gövdeyi yayımlamak yerine yalnız baş alanı gösterilir; boyun hizası kaynaklarda y=250 civarında x≈509–515 aralığında kontrol edildi.

```text
Use case: precise-object-edit.
Edit target: this exact original transparent 1024x1536 full-body back-view character sprite.
Create a matching directional HEAD POSE for use in a 3-frame web animation. Change ONLY the head and a tiny connected neck area above the jacket collar. Preserve the EXACT full-canvas dimensions 1024x1536, character size, all pixels of the jacket/backpack/arms/body/legs/boots, silhouette below the collar, foot positions and transparent padding. Do not reframe, zoom, recenter or add ground. The base of the neck must stay anchored near x=500,y=250. Hair must match the original dark slightly tousled hairstyle and head scale.
The character's torso remains facing AWAY from us; only the head turns about 35 degrees toward IMAGE SIDE. Keep it a subtle rear three-quarter look, showing a small hint of side cheek/nose outline on IMAGE SIDE so the turn clearly reads at small size. No full frontal face, no full profile, no giant head, no neck stretch. Almost black photographic silhouette with the same faint cool rim light. No expression change.
Output one full-body sprite matching the original registration, genuine transparent background, no backdrop, props, letters, labels, numbers, grid, panels or watermark. We will use only its head area over the unchanged original body.
```

### Organik gökyüzü — güncel üretim

22 Ekim 2026: yerleşik image_gen, referans görsel kullanılmadan yeni üretim. Eski kaynağı düzenleyen ilk denemede tekrar eden doku sürdüğü için o deneme seçilmedi. CLI/API fallback kullanılmadı. Kaynak PNG ve web için WebP projeye kaydedildi. Yeni kaynakta merkez kaya tepesi yaklaşık y=916, ayak destek düzlemi y=923’tür.

```text
Use case: photorealistic-natural.
Asset type: landscape background photograph for an atmospheric personal website, 16:10, 1586x992 if possible.
Create a NEW original restrained night landscape. Authentic clean fine-art landscape photograph, smooth natural optics, no illustrative or generative texture. Broad, deep midnight-blue sky, huge quiet dark negative space. A faint, very soft, irregular veil of silvery starlight drifts near the far left edge and low horizon; smooth continuous diffuse tonal shapes like very distant mist, with a few deep irregular dark gaps. NO resolved Milky Way core, NO detailed nebula, NO granular dust cloud. Distant, subtle, mysterious, inviting the eye into darkness. Restrained pale warmth just above the low horizon, not a blazing sunset. Fine sparse tiny stars of irregular brightness and spacing, perhaps 25–40 stars total, pinpoints without halos. Clean sky with no visible noise, no microtexture, no repetition. The sky should resemble a real low-noise night exposure seen from a remote hill, not a high-detail space illustration.
Ground ONLY in the bottom 9%: nearly black sparse low grass and natural rock silhouette, a small low rock exactly at bottom centre with its top at about y=90.2% for a separate person overlay. No person in this image.
Keep full-width y=18–64% mostly dark and calm for readable website labels and descriptions; beautiful gradual light falloff, gentle depth, no bright highlight behind these areas. The lower sky can carry soft diffuse blue-grey atmosphere, but without any cells, dots, triangles, beads or repeated pattern. The appeal is solemn wonder and believable space, not visual busyness.
Avoid: detailed galactic bands, sharp cloud edges, bright nebula cores, stippling, pointillism, glitter, confetti, faceting, diamond lattice, overlapping round specks, fish scales, mosaic, procedural noise, oil-paint texture, plastic airbrush, oversharpening, artificial grain, glowing star icons. No moon, planet, aurora, mountains, forest, buildings, spaceship, telescope, spotlight, text, logos, divider lines, borders or UI. Photographic dark sky with sparse tiny real stars and a low grass/rock ground only.
```

### Fotoğrafik derinlik düzenlemesi — güncel gökyüzü

22 Ekim 2026: yerleşik image_gen, `night-sky-quiet.png` hedefiyle düzenleme. CLI/API fallback kullanılmadı. Kaynak ve WebP projeye kaydedildi; yalnız format dönüşümü yapıldı. Kaya tepesinin merkez konumu eski/yeni kaynakta y=895/894 olarak ölçüldü; ayrı ön kaya ve karakterin temas katmanı korundu.

```text
Use case: lighting-weather.
Asset type: edited photographic night-sky background plate for a responsive personal website.
Edit target: the supplied current sky image. Improve ONLY the sky, preserving EXACT image dimensions 1586x992, ground/grass silhouette, low horizon line, central rock shape and its position pixel-for-pixel. Do not move or redraw the ground: a separate human overlay is aligned to it.
Primary request: a more majestic, convincing REAL astrophotograph, while still a restrained and readable web background. Replace the slightly painted, flat upper sky with true photographic depth: naturally varied fine pinprick stars, a few restrained brighter points, realistic charcoal/inky blue atmosphere and subtle interstellar dust. Keep stars much sparser and softer in the entire upper and middle 65% than a dense astronomy poster; no glitter noise.
Create ONE expansive physically plausible low Milky Way arc spanning the lower sky at roughly y=65–84%, with more convincing dust-lane structure, subtle cool silver-blue haze, faint muted mauve depth, and a restrained broad luminous core LOWER than the text areas. A sense of vast scale and wonder, refined natural long-exposure photography, no plastic airbrush, no painted cloud smears, no three-galaxy collage.
CRITICAL WEBSITE CONSTRAINT: the broad full-width y=18–64% zone must remain predominantly dark and low-contrast, including x=14%,34%,65%,86%. These areas carry rotated category labels AND small white hover descriptions. No bright nebula cores, sharp luminous streaks or dense sparkly clusters there. Natural faint stars are fine; do not make it a completely featureless solid fill. Preserve readable negative space even with a narrow centre crop. Richest texture belongs below this zone and towards peripheral edges.
Preserve the gentle amber glow immediately above the horizon; keep it subtle and photographic, not a bright sunset. Preserve all terrain pixels and rock contact points unchanged. No person, telescope, spotlight, moon, planets, aurora, mountains, buildings, text, logos, borders, fan sectors or divider lines. The output is only the sky/terrain plate: interface, paper divisions and animated stars are separate code layers.
```

### Okunabilirlik düzenlemesi — güncel gökyüzü

22 Ekim 2026: yerleşik image_gen ile `docs/art-source/night-sky.png` hedef alınarak düzenlendi. Figür ayrı tutuldu; üst/orta gökyüzü sadeleştirildi, atmosfer alçak ufka taşındı. WebP yalnız format dönüşümüdür. CLI/API fallback kullanılmadı.

```text
Use case: style-transfer.
Asset type: replacement background plate for a responsive personal website, wide landscape approximately 16:10.
Input image: edit target, the existing night sky and ground. Rework its SKY into a restrained cinematic matte painting while retaining the bottom ground silhouette, small centered rock, low horizon and overall composition.
Primary request: dramatically reduce visual clutter and provide usable dark negative space for three website headings. Replace the three bright, sharply detailed galaxy bands with ONE unified deep navy and charcoal night sky. Broad quiet low-detail dark space across the entire top 65% of the image, especially at x=15%,50%,85% and y=30–55%. This dark text-safe band must span the full width so it also works when cropped to a narrow portrait.
Style: atmospheric subtly painted photographic matte painting, subtle fine tonal texture, soft hazy indigo depth, subdued silver pinprick stars, solitary and contemplative, beautiful but restrained. Few faint stars, around 40–60 tiny dots total, no dense granular star noise, NO bright star behind title regions. A single very faint diffuse smoky blue/mauve galactic haze may curve across the LOWER sky at y=65–80%, very low contrast and no sharp bright core. Very faint warm grey/amber light close to horizon, softly revealing a small dark central rock and sparse grasses at bottom.
Preserve the ground silhouette's placement around bottom 8–10% and centered rock; keep the image usable edge-to-edge. Low saturation, no teal/purple split sectors. Aim for hierarchy: quiet dark sky first, faint lower atmosphere second, ground third. No person (separate overlay), no text or letters, no UI, no divider lines, no symbols, no telescope, no spotlight, no moon, no planets, no city, no watermark. This must feel like a subtle night landscape under readable website typography rather than a dense astronomy poster.
```

### Gökyüzü ilk üretim

Use case: stylized-concept. Asset type: very wide landscape background for a personal website landing page, approximately 16:10 landscape. Input images are REFERENCE ONLY: image 1 supplies the night-sky atmosphere, ground at the bottom, immense Milky Way and small-scale human perspective; image 2 supplies ONLY the idea of three sweeping fan-shaped divisions converging near bottom center. Create ORIGINAL art. Main composition: expansive deep dark astronomical sky with a realistic Milky Way, quiet granular starlight, muted mauve/indigo nebulae, a very faint amber horizon. Three broad flowing vertical celestial sectors, left midnight slate blue, middle muted smoky lavender, right deep teal; their boundaries are two slender, elegant warm ivory-gold slightly curved rays converging near x=50%, y=88%, widening toward top x=30% and x=70%. The divisions should feel like an antique celestial atlas, restrained and photographic/painterly, NOT a literal game box, no history imagery, no buildings. Keep the center of each sector in the upper-middle dark and quiet for HTML headings to be placed later. Along the bottom 12% include an almost black irregular grassy/rocky ground silhouette, small central rock suitable for a separately overlaid person. Deep moody dark values, subtle silver-white stars, sparse warm glints; visually rich but no saturated rainbow. NO HUMAN FIGURE: person will be a separate animated layer. No telescope, no spotlight, no lettering, no labels, no symbols, no text, no watermark. Scene should extend edge to edge and crop well at different widths.

### Modüler ayırıcılar için gökyüzü düzenlemesi

Edit this website background. Remove ONLY the two thin gold/ivory diagonal lines that form a V from the top edges towards the central rock. Seamlessly reconstruct the existing stars and nebula underneath those lines. Keep the exact dimensions, composition, all three softly blending star-field colours, the Milky Way details, horizon glow, central rock, grassy ground, dark photographic mood and framing unchanged. We will add dividing lines in website code, so the output must have NO straight or curved divider lines. No person, no text, no new objects, no borders, no symbols. Preserve the original image as closely as possible apart from erasing the two line strokes.

### Karakter

Use case: illustration-story. Asset type: standalone transparent cutout sprite for a night-sky personal website. A single small human seen full body from behind, standing still and looking slightly upward. Wearing a simple hooded outdoor jacket or small backpack, straight trousers and boots. Relaxed idle standing pose, feet spaced a little apart, arms hanging naturally close to body. A clean almost-black photographic silhouette, subtle charcoal folds only, no visible face, no glowing eyes. Shape should be slim and natural, not a superhero. Very faint cool rim light, overall nearly black so it reads silhouetted against a starry sky. Centered full body with all head and shoes in frame and a little transparent padding. Transparent background, isolated person ONLY, no ground, no rock, no sky, no shadows, no scene, no telescope, no props, no text. This is an original anonymous character; not a real person's portrait.
