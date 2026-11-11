// Small progressive enhancements. The site works without this file.
// 1. Case-study header hides on scroll down, reappears on scroll up.
// 2. Videos play only while on screen (saves battery/data).
// 3. Case-study images open full-size in a lightbox.
// 4. Carousels get working prev/next buttons.

// 1. Auto-hiding header ---------------------------------------------------
const header = document.querySelector('.page-case .site-header');
if (header) {
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    header.classList.toggle('is-hidden', y > lastY && y > 120);
    lastY = y;
  }, { passive: true });
}

// 2. Play videos when visible ---------------------------------------------
const videos = document.querySelectorAll('video[data-autoplay]');
if ('IntersectionObserver' in window && videos.length) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = new IntersectionObserver(entries => {
    for (const { target, isIntersecting } of entries) {
      if (isIntersecting && !reduceMotion) target.play().catch(() => {});
      else target.pause();
    }
  }, { threshold: 0.25 });
  videos.forEach(v => {
    v.muted = true;
    if (reduceMotion) v.controls = true;
    io.observe(v);
  });
}

// 3. Lightbox ---------------------------------------------------------------
const zoomables = document.querySelectorAll('.cs-body figure img:not([data-no-zoom])');
if (zoomables.length && typeof HTMLDialogElement === 'function') {
  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.innerHTML = '<button class="lightbox-close" aria-label="Close">×</button><img alt="">';
  document.body.append(dialog);
  const big = dialog.querySelector('img');
  const close = () => dialog.close();
  dialog.addEventListener('click', close);

  zoomables.forEach(img => {
    img.classList.add('zoomable');
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    const open = () => {
      big.src = img.currentSrc || img.src;
      big.alt = img.alt;
      dialog.showModal();
    };
    img.addEventListener('click', open);
    img.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
}

// 4. Carousels ---------------------------------------------------------------
document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  const buttons = carousel.querySelectorAll('.carousel-btn');
  const update = () => {
    const max = track.scrollWidth - track.clientWidth - 2;
    buttons.forEach(b => {
      b.disabled = b.dataset.dir === '-1' ? track.scrollLeft <= 2 : track.scrollLeft >= max;
    });
  };
  buttons.forEach(b => b.addEventListener('click', () => {
    track.scrollBy({ left: Number(b.dataset.dir) * track.clientWidth, behavior: 'smooth' });
  }));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
});
