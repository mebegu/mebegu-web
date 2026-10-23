# Alamori mirror entrance

Alamori's ordinary page entry plays a 4.4-second, silent visual transition: the amber-lit study, abstract marks aligning on the mirror, the room compressing into a thin horizontal seam, a short dark interval, then a still moonlit forest. The viewer remains stationary. The forest resolves before the book frontend is revealed. This is a representative visual interpretation, not a publication of manuscript passages or an interactive story scene.

`MirrorArrivalHead.astro` supplies two motion-aware image preloads and a bounded initial paint veil through `BaseLayout`'s optional `head` slot. `MirrorArrival.astro` occupies the optional `overlay` slot outside the normal page content. The rest of the website does not load this entrance.

`src/lib/alamori-entry.ts` renders two static scenes and procedural abstract marks with Canvas 2D. There is no video, audio, WebGL requirement or continuous background animation. Render resolution is capped at 1.6 megapixels and DPR 1.5; frames stop and the canvas buffer is released after exit. The WebP scenes together are approximately 406 kB. PNG source art and the exact built-in imagegen prompts/edit are recorded in `docs/assets/alamori-entry-images.json`.

The opening can be skipped with the visible button or Escape, and replayed from the book's byline. During playback the underlying page is inert; keyboard focus stays on Skip and returns to the book heading or replay control on exit. Scroll position and the prior overflow/inert state are restored.

Reduced motion, direct hash links and browser history restoration show the book directly. Changing the motion preference, hiding/leaving the page or navigating to a hash ends an active opening. Without JavaScript the entrance and replay control stay hidden. If the enhancement never loads, the initial veil clears after 1.8 seconds; failed/slow scene loads fail open after at most 1.5 seconds. An independent 6.4-second controller watchdog releases the page if playback stalls.

Scene art is frontend-owned under `public/media/alamori-entry/`. It is separate from `public/media/alamori/`, which the book repository's public publication job updates. The book's source-of-truth JSON, PDF preview, roadmap and Blog publishing flow are unchanged.
