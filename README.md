# Album

A small static photo album: seven photos, a lightbox, light and dark themes.

Open `index.html` through any static server (or GitHub Pages) to view it.

## Adding photos

1. Put images in `photos/` named `1.jpg` … `7.jpg`.
2. Edit the `ALBUM` block at the top of `app.js` to set the title, subtitle and captions.

Photo 1 is the wide cover; the other six sit in the grid below it. Slots without a
photo show a placeholder until one is added. To change which part of a photo the
grid crop keeps, add `focus: "50% 20%"` (CSS `object-position`) to that photo's entry.
