// Google Analytics (same property the Framer site used).
// Only runs on the live domain, so local previews don't count as visits.
(function () {
  if (!/(^|\.)hilya\.me$/.test(location.hostname)) return;
  var id = 'G-D527QLTT71';
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', id);
})();
