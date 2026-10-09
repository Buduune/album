// Edit this block to change the album. Drop images into photos/ and point
// each `src` at one. Captions are optional.
const ALBUM = {
  title: "Album",
  subtitle: "Seven moments worth keeping",
  footer: "",
  photos: [
    { src: "photos/1.jpg", caption: "", focus: "50% 72%" },
    { src: "photos/2.jpg", caption: "" },
    { src: "photos/3.jpg", caption: "" },
    { src: "photos/4.jpg", caption: "" },
    { src: "photos/5.jpg", caption: "" },
    { src: "photos/6.jpg", caption: "" },
    { src: "photos/7.jpg", caption: "" },
  ],
};

const $ = (id) => document.getElementById(id);
const pad = (n) => String(n).padStart(2, "0");

document.title = ALBUM.title;
$("album-title").textContent = ALBUM.title;
$("album-subtitle").textContent = ALBUM.subtitle;
$("album-count").textContent = `${ALBUM.photos.length} photographs`;
$("album-footer").textContent = ALBUM.footer || `${ALBUM.title} · ${new Date().getFullYear()}`;

// Indexes of photos that actually loaded; the lightbox only steps through these.
const loaded = new Set();
const grid = $("grid");

ALBUM.photos.forEach((photo, i) => {
  const tile = document.createElement("figure");
  tile.className = "tile is-empty";
  tile.style.setProperty("--delay", `${i * 60}ms`);

  const btn = document.createElement("button");
  btn.className = "tile-frame";
  btn.disabled = true;
  btn.setAttribute("aria-label", `Open photo ${i + 1}`);

  const img = document.createElement("img");
  img.alt = photo.caption || `Photo ${i + 1}`;
  img.loading = i === 0 ? "eager" : "lazy";
  img.decoding = "async";
  if (photo.focus) img.style.objectPosition = photo.focus;

  const placeholder = document.createElement("div");
  placeholder.className = "placeholder";
  placeholder.innerHTML = `<span class="ph-num">${pad(i + 1)}</span><span class="ph-note">photo coming soon</span>`;

  img.addEventListener("load", () => {
    tile.classList.remove("is-empty");
    btn.disabled = false;
    loaded.add(i);
  });
  img.addEventListener("error", () => img.remove());
  img.src = photo.src;

  btn.append(placeholder, img);
  btn.addEventListener("click", () => openAt(i));

  const cap = document.createElement("figcaption");
  cap.innerHTML = `<span class="num">${pad(i + 1)}</span>`;
  if (photo.caption) {
    const text = document.createElement("span");
    text.textContent = photo.caption;
    cap.append(text);
  }

  tile.append(btn, cap);
  grid.append(tile);
});

// Lightbox
const lb = $("lightbox");
let current = 0;

function order() {
  return [...loaded].sort((a, b) => a - b);
}

function show(i) {
  current = i;
  const photo = ALBUM.photos[i];
  const seq = order();
  $("lb-img").src = photo.src;
  $("lb-img").alt = photo.caption || `Photo ${i + 1}`;
  $("lb-caption").textContent = photo.caption;
  $("lb-counter").textContent = `${seq.indexOf(i) + 1} / ${seq.length}`;
  const single = seq.length < 2;
  $("lb-prev").hidden = single;
  $("lb-next").hidden = single;
}

function step(dir) {
  const seq = order();
  if (seq.length < 2) return;
  const pos = seq.indexOf(current);
  show(seq[(pos + dir + seq.length) % seq.length]);
}

function openAt(i) {
  if (!loaded.has(i)) return;
  show(i);
  lb.showModal();
  lb.focus();
  document.body.classList.add("no-scroll");
}

function close() {
  lb.close();
}

lb.addEventListener("close", () => document.body.classList.remove("no-scroll"));
$("lb-close").addEventListener("click", close);
$("lb-prev").addEventListener("click", () => step(-1));
$("lb-next").addEventListener("click", () => step(1));
lb.addEventListener("click", (e) => {
  if (e.target === lb) close();
});
document.addEventListener("keydown", (e) => {
  if (!lb.open) return;
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

let touchX = null;
lb.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  touchX = null;
});
