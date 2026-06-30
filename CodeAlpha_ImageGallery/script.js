// ---- Data: using picsum.photos placeholder images, tagged with categories ----
const images = [
  { id: 11, category: 'nature', title: 'Forest Path' },
  { id: 28, category: 'animals', title: 'Wildlife Close-up' },
  { id: 1015, category: 'nature', title: 'River Valley' },
  { id: 1025, category: 'animals', title: 'Curious Pup' },
  { id: 1031, category: 'city', title: 'Urban Lights' },
  { id: 1040, category: 'nature', title: 'Quiet Hillside' },
  { id: 64, category: 'people', title: 'Portrait Study' },
  { id: 91, category: 'city', title: 'Skyline View' },
  { id: 119, category: 'nature', title: 'Misty Morning' },
  { id: 177, category: 'people', title: 'Candid Moment' },
  { id: 219, category: 'city', title: 'Street Corner' },
  { id: 237, category: 'animals', title: 'Loyal Companion' },
];

const galleryEl = document.getElementById('gallery');
const filtersEl = document.getElementById('filters');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCounter = document.getElementById('lightboxCounter');

let currentFilter = 'all';
let currentIndex = 0;

function imgUrl(id, w, h) {
  return `https://picsum.photos/id/${id}/${w}/${h}`;
}

function renderGallery() {
  galleryEl.innerHTML = '';
  images.forEach((img, index) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.dataset.category = img.category;
    item.dataset.index = index;
    item.style.animationDelay = `${(index % 12) * 0.05}s`;

    item.innerHTML = `
      <img src="${imgUrl(img.id, 400, 320)}" alt="${img.title}" loading="lazy">
      <div class="item-overlay">
        <div>
          <span>${img.title}</span>
          <small>${img.category}</small>
        </div>
      </div>
    `;

    item.addEventListener('click', () => openLightbox(index));
    galleryEl.appendChild(item);
  });
  applyFilter(currentFilter);
}

function applyFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.gallery-item').forEach(item => {
    const match = filter === 'all' || item.dataset.category === filter;
    item.classList.toggle('hidden', !match);
  });
}

filtersEl.addEventListener('click', (e) => {
  if (!e.target.classList.contains('filter-btn')) return;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  applyFilter(e.target.dataset.filter);
});

// ---- Lightbox logic ----
function getVisibleIndices() {
  return images
    .map((img, i) => ({ img, i }))
    .filter(o => currentFilter === 'all' || o.img.category === currentFilter)
    .map(o => o.i);
}

function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function updateLightbox() {
  const visible = getVisibleIndices();
  const pos = visible.indexOf(currentIndex);
  const img = images[currentIndex];
  lightboxImg.src = imgUrl(img.id, 1000, 750);
  lightboxImg.alt = img.title;
  lightboxCaption.textContent = `${img.title} — ${img.category}`;
  lightboxCounter.textContent = `${pos + 1} / ${visible.length}`;
}

function showNext() {
  const visible = getVisibleIndices();
  const pos = visible.indexOf(currentIndex);
  currentIndex = visible[(pos + 1) % visible.length];
  updateLightbox();
}

function showPrev() {
  const visible = getVisibleIndices();
  const pos = visible.indexOf(currentIndex);
  currentIndex = visible[(pos - 1 + visible.length) % visible.length];
  updateLightbox();
}

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxNext').addEventListener('click', showNext);
document.getElementById('lightboxPrev').addEventListener('click', showPrev);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
});

renderGallery();
