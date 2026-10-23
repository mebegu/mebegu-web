# Alamori mirror entrance

Alamori's ordinary page entry plays a 4.4-second silent transition over the actual book frontend. A fabricated frosted mirror obscures the page. Abstract gold marks appear, settle into three rows around a small central opening, and a golden spiral completes. The glass and marks then compress into a horizontal seam; the seam parts and disappears, revealing the page directly. There is no room, landscape, forward camera travel, device camera, permission request or manuscript excerpt.

The circular motif belongs to the central golden curl, rather than an orbiting arrangement of letters. This is a representative interface interpretation. It does not reproduce a chapter or depict an unsuccessful passage as a successful one.

`MirrorArrivalHead.astro` supplies a bounded initial frosted veil through `BaseLayout`'s optional `head` slot. `MirrorArrival.astro` occupies the optional `overlay` slot outside the normal content. Only the Alamori page loads this enhancement. There are no entrance image preloads or scene downloads.

CSS gradients and backdrop blur create the glass; `src/lib/alamori-entry.ts` draws procedural abstract marks and the seam using transparent Canvas 2D. There is no media stream, video, audio, WebGL requirement or continuous background animation. Render resolution is capped at 1.6 megapixels and DPR 1.5. Frames stop and the canvas buffer is released after exit. Previous scene-art source files and their generation records are historical work artifacts, not served entrance assets.

The opening can be skipped with the visible button or Escape, and replayed from the book's byline. During playback the underlying page is inert; keyboard focus stays on Skip and returns to the book heading or replay control on exit. Scroll position and prior overflow/inert state are restored.

Reduced motion, direct hash links and browser history restoration show the book directly. Changing the motion preference, hiding/leaving the page or navigating to a hash ends an active opening. Without JavaScript the entrance and replay control stay hidden. If the enhancement never loads, the initial veil clears after 1.8 seconds. An independent 6-second watchdog releases the page if playback stalls; rendering errors also release it immediately.

The frontend effect is separate from `public/media/alamori/`, which the book repository's publication job updates. Source-owned JSON, PDF previews, roadmap and Blog publishing are unchanged.
