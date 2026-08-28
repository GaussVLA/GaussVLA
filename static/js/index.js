window.HELP_IMPROVE_VIDEOJS = false;

/* ------------------------------------------------------------------
   Copy BibTeX to clipboard
   ------------------------------------------------------------------ */
function copyBibTeX() {
  var bibtexElement = document.getElementById('bibtex-code');
  var button = document.querySelector('.copy-bibtex-btn');
  if (!bibtexElement || !button) return;

  var copyText = button.querySelector('.copy-text');

  function markCopied() {
    button.classList.add('copied');
    if (copyText) copyText.textContent = 'Copied!';
    setTimeout(function () {
      button.classList.remove('copied');
      if (copyText) copyText.textContent = 'Copy';
    }, 2000);
  }

  function fallbackCopy() {
    var textArea = document.createElement('textarea');
    textArea.value = bibtexElement.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    try { document.execCommand('copy'); } catch (e) { /* nothing else to try */ }
    document.body.removeChild(textArea);
    markCopied();
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(bibtexElement.textContent).then(markCopied).catch(fallbackCopy);
  } else {
    fallbackCopy();
  }
}

/* ------------------------------------------------------------------
   Scroll to top
   ------------------------------------------------------------------ */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ------------------------------------------------------------------
   Sticky nav: scroll spy, reading progress, mobile toggle
   ------------------------------------------------------------------ */
function setupNav() {
  var nav = document.getElementById('gv-nav');
  var progress = document.getElementById('gv-progress');
  var toggle = document.getElementById('gv-nav-toggle');
  var links = document.getElementById('gv-nav-links');
  if (!nav) return;

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (event) {
      if (event.target.tagName === 'A') {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var anchors = links ? Array.prototype.slice.call(links.querySelectorAll('a')) : [];
  var sections = anchors
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function onScroll() {
    if (progress) {
      var height = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (height > 0 ? (window.pageYOffset / height) * 100 : 0) + '%';
    }

    var scrollButton = document.querySelector('.scroll-to-top');
    if (scrollButton) {
      scrollButton.classList.toggle('visible', window.pageYOffset > 300);
    }

    // Highlight the section whose top has most recently passed the nav bar.
    var current = -1;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= nav.offsetHeight + 20) current = i;
    }
    anchors.forEach(function (a, i) { a.classList.toggle('is-active', i === current); });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });

  onScroll();
}

/* ------------------------------------------------------------------
   Animated stat counters
   ------------------------------------------------------------------ */
function setupCounters() {
  var counters = document.querySelectorAll('[data-count-to]');
  if (!counters.length) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function render(el, value) {
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    el.textContent = value.toFixed(decimals) + (el.dataset.suffix || '');
  }

  function run(el) {
    var target = parseFloat(el.dataset.countTo);
    if (reduce) { render(el, target); return; }

    var duration = 1200;
    var start = null;
    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      render(el, target * eased);
      if (progress < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(function (el) { render(el, parseFloat(el.dataset.countTo)); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      run(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  counters.forEach(function (el) { observer.observe(el); });
}

/* ------------------------------------------------------------------
   Method tabs
   ------------------------------------------------------------------ */
function setupTabs() {
  var tabs = document.querySelectorAll('.gv-tab');
  if (!tabs.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var name = tab.dataset.tab;
      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      document.querySelectorAll('.gv-tab-panel').forEach(function (panel) {
        panel.classList.toggle('is-active', panel.dataset.panel === name);
      });
    });
  });
}

/* ------------------------------------------------------------------
   Figure lightbox
   ------------------------------------------------------------------ */
function setupLightbox() {
  var lightbox = document.getElementById('gv-lightbox');
  var image = document.getElementById('gv-lightbox-img');
  var caption = document.getElementById('gv-lightbox-caption');
  var closeBtn = document.getElementById('gv-lightbox-close');
  if (!lightbox || !image) return;

  function open(source) {
    image.src = source.src;
    image.alt = source.alt;
    var figcaption = source.closest('figure') ? source.closest('figure').querySelector('figcaption') : null;
    if (caption) caption.textContent = figcaption ? figcaption.textContent.trim() : source.alt;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    image.src = '';
  }

  document.querySelectorAll('.gv-zoomable').forEach(function (img) {
    img.addEventListener('click', function () { open(img); });
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) close();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) close();
  });
}

/* ------------------------------------------------------------------
   Sortable / filterable results table
   ------------------------------------------------------------------ */
function setupResultsTable() {
  var table = document.getElementById('gv-results-table');
  if (!table) return;

  var tbody = table.tBodies[0];
  var headers = Array.prototype.slice.call(table.querySelectorAll('th.gv-sortable'));
  var filter = document.getElementById('gv-filter-small');
  var state = { index: -1, ascending: false };

  function applyFilter() {
    if (!filter) return;
    Array.prototype.forEach.call(tbody.rows, function (row) {
      var params = parseFloat(row.dataset.params);
      row.classList.toggle('is-hidden', filter.checked && params >= 1000);
    });
  }

  function sortBy(index) {
    var header = headers[index];
    var numeric = header.dataset.sort === 'num';

    // Same column toggles direction; a new column starts high-to-low for
    // numbers and A-to-Z for text.
    if (state.index === index) {
      state.ascending = !state.ascending;
    } else {
      state.index = index;
      state.ascending = !numeric;
    }

    var rows = Array.prototype.slice.call(tbody.rows);
    rows.sort(function (a, b) {
      var cellA = a.cells[index];
      var cellB = b.cells[index];
      var result;
      if (numeric) {
        result = parseFloat(cellA.dataset.v) - parseFloat(cellB.dataset.v);
      } else {
        result = cellA.textContent.trim().localeCompare(cellB.textContent.trim());
      }
      return state.ascending ? result : -result;
    });
    rows.forEach(function (row) { tbody.appendChild(row); });

    headers.forEach(function (h, i) {
      h.classList.toggle('is-sorted', i === index);
      var icon = h.querySelector('i');
      if (!icon) return;
      if (i === index) {
        icon.className = state.ascending ? 'fas fa-sort-up' : 'fas fa-sort-down';
      } else {
        icon.className = 'fas fa-sort';
      }
    });

    applyFilter();
  }

  headers.forEach(function (header, index) {
    header.addEventListener('click', function () { sortBy(index); });
  });

  if (filter) filter.addEventListener('change', applyFilter);
}

/* ------------------------------------------------------------------
   Ablation builder (Table 4)
   ------------------------------------------------------------------ */
function setupAblationBuilder() {
  var gst = document.getElementById('gv-gst');
  var dacot = document.getElementById('gv-dacot');
  if (!gst || !dacot) return;

  var VARIANTS = {
    '00': { name: 'Vanilla GaussVLA', libero: 78.1, pro: 11.2, params: '179M', trainable: '158M', flops: '3.50', latency: '10.85 ms' },
    '10': { name: 'GaussVLA + GST', libero: 90.5, pro: 29.0, params: '190.2M', trainable: '169.2M', flops: '4.33', latency: '12.27 ms' },
    '01': { name: 'GaussVLA + DA-CoT', libero: 82.1, pro: 16.7, params: '188.8M', trainable: '167.8M', flops: '4.00', latency: '11.55 ms' },
    '11': { name: 'Full GaussVLA', libero: 93.5, pro: 33.3, params: '200M', trainable: '179M', flops: '4.83', latency: '12.97 ms' }
  };

  var BASELINE = VARIANTS['00'];

  var el = {
    name: document.getElementById('gv-variant-name'),
    tokens: document.getElementById('gv-token-mode'),
    libero: document.getElementById('gv-m-libero'),
    pro: document.getElementById('gv-m-pro'),
    barLibero: document.getElementById('gv-b-libero'),
    barPro: document.getElementById('gv-b-pro'),
    params: document.getElementById('gv-m-params'),
    trainable: document.getElementById('gv-m-train'),
    flops: document.getElementById('gv-m-flops'),
    latency: document.getElementById('gv-m-lat'),
    delta: document.getElementById('gv-delta')
  };

  function update() {
    var key = (gst.checked ? '1' : '0') + (dacot.checked ? '1' : '0');
    var v = VARIANTS[key];

    el.name.textContent = v.name;
    el.tokens.textContent = 'Visual input: ' + (gst.checked ? '3D Gaussian tokens' : 'flat 2D tokens');
    el.libero.textContent = v.libero.toFixed(1) + '%';
    el.pro.textContent = v.pro.toFixed(1) + '%';
    el.barLibero.style.width = v.libero + '%';
    el.barPro.style.width = v.pro + '%';
    el.params.textContent = v.params;
    el.trainable.textContent = v.trainable;
    el.flops.textContent = v.flops;
    el.latency.textContent = v.latency;

    if (key === '00') {
      el.delta.textContent = 'Baseline: flat 2D tokens, no geometric reasoning. Turn on a module to see its effect.';
    } else {
      var dLibero = (v.libero - BASELINE.libero).toFixed(1);
      var dPro = (v.pro - BASELINE.pro).toFixed(1);
      var dLatency = (parseFloat(v.latency) - parseFloat(BASELINE.latency)).toFixed(2);
      el.delta.textContent = '+' + dLibero + ' pts on LIBERO and +' + dPro +
        ' pts on LIBERO-PRO over the vanilla baseline, at a cost of +' + dLatency + ' ms latency.';
    }
  }

  gst.addEventListener('change', update);
  dacot.addEventListener('change', update);
  update();
}

/* ------------------------------------------------------------------
   Real-robot bar chart: grow bars when scrolled into view
   ------------------------------------------------------------------ */
function setupBarChart() {
  var chart = document.getElementById('gv-realworld-chart');
  if (!chart) return;

  var columns = chart.querySelectorAll('.gv-col');

  function grow() {
    columns.forEach(function (col) { col.classList.add('is-grown'); });
  }

  if (!('IntersectionObserver' in window)) { grow(); return; }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      grow();
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  observer.observe(chart);
}

/* ------------------------------------------------------------------
   Play the rollout video only while it is on screen
   ------------------------------------------------------------------ */
function setupVideoAutoplay() {
  var carouselVideos = document.querySelectorAll('.gv-video-block video');
  if (!carouselVideos.length || !('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(function () { /* autoplay blocked by the browser */ });
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.5 });

  carouselVideos.forEach(function (video) { observer.observe(video); });
}

/* ------------------------------------------------------------------
   Boot
   ------------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', function () {
  setupNav();
  setupCounters();
  setupTabs();
  setupLightbox();
  setupResultsTable();
  setupAblationBuilder();
  setupBarChart();
  setupVideoAutoplay();
});
