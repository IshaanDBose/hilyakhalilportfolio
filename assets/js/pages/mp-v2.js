// Marketplace v2: before/after comparison sliders.
// Each [data-compare] figure holds an invisible range input; its value (0–100)
// becomes the --pos custom property that clips the "before" image and moves the handle.
document.querySelectorAll('[data-compare]').forEach(figure => {
  const range = figure.querySelector('input[type="range"]');
  const update = () => figure.style.setProperty('--pos', range.value + '%');
  range.addEventListener('input', update);
  update();
});
