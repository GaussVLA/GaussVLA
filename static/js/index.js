/* GaussVLA project page: nav, sortable table, LIBERO-PRO heat cells, ablation builder, lightbox, BibTeX copy. */
(function () {
  'use strict';

  /* ---- nav: mobile toggle, scroll progress, active section ---- */
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');
  var progress = document.getElementById('nav-progress');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }
  var anchors = links ? Array.prototype.slice.call(links.querySelectorAll('a')) : [];
  var sections = anchors.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (h > 0 ? (window.pageYOffset / h) * 100 : 0) + '%';
    var current = -1;
    sections.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < 120) current = i; });
    anchors.forEach(function (a, i) { a.classList.toggle('active', i === current); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- sortable table ---- */
  document.querySelectorAll('table.sortable').forEach(function (table) {
    var tbody = table.tBodies[0];
    var headers = Array.prototype.slice.call(table.tHead.rows[0].cells);
    headers.forEach(function (th, col) {
      var type = th.getAttribute('data-sort');
      if (!type) return;
      th.addEventListener('click', function () {
        var dir = th.classList.contains('desc') ? 'asc' : 'desc';
        headers.forEach(function (h) { h.classList.remove('asc', 'desc'); });
        th.classList.add(dir);
        var rows = Array.prototype.slice.call(tbody.rows);
        rows.sort(function (a, b) {
          var x = a.cells[col].textContent.trim();
          var y = b.cells[col].textContent.trim();
          var cmp = type === 'num' ? parseFloat(x) - parseFloat(y) : x.localeCompare(y);
          return dir === 'asc' ? cmp : -cmp;
        });
        rows.forEach(function (r) { tbody.appendChild(r); });
      });
    });
  });

  /* ---- LIBERO-PRO heat cells and suite separators ---- */
  var pro = document.getElementById('pro-table');
  if (pro) {
    Array.prototype.forEach.call(pro.tBodies[0].rows, function (row) {
      var cells = Array.prototype.slice.call(row.querySelectorAll('td:not(.col-avg)'));
      cells.forEach(function (td, i) {
        var v = parseFloat(td.textContent);
        td.style.setProperty('--h', v.toFixed(2));
        if (v >= 0.75) td.classList.add('light-text');
        if (i % 5 === 4) td.classList.add('gsep');
      });
    });
    var sub = pro.tHead.rows[1];
    Array.prototype.forEach.call(sub.cells, function (th, i) { if (i % 5 === 4) th.classList.add('gsep'); });
    Array.prototype.forEach.call(pro.tHead.rows[0].cells, function (th, i) { if (i >= 1 && i <= 4) th.classList.add('gsep'); });
  }

  /* ---- ablation builder: values are Table 4 of the paper ---- */
  var VARIANTS = {
    '00': { name: 'Vanilla GaussVLA', libero: 78.1, pro: 11.2, params: '179M', train: '158M', flops: '3.50', lat: '10.85 ms' },
    '10': { name: '+ GST only', libero: 90.5, pro: 29.0, params: '190.2M', train: '169.2M', flops: '4.33', lat: '12.27 ms' },
    '01': { name: '+ DA-CoT only', libero: 82.1, pro: 16.7, params: '188.8M', train: '167.8M', flops: '4.00', lat: '11.55 ms' },
    '11': { name: 'Full GaussVLA', libero: 93.5, pro: 33.3, params: '200M', train: '179M', flops: '4.83', lat: '12.97 ms' }
  };
  var gst = document.getElementById('sw-gst');
  var dacot = document.getElementById('sw-dacot');
  function $(id) { return document.getElementById(id); }
  function renderBuilder() {
    var v = VARIANTS[(gst.checked ? '1' : '0') + (dacot.checked ? '1' : '0')];
    $('b-variant').textContent = v.name;
    $('b-libero').textContent = v.libero.toFixed(1) + '%';
    $('b-pro').textContent = v.pro.toFixed(1) + '%';
    $('b-libero-bar').style.width = v.libero + '%';
    $('b-pro-bar').style.width = v.pro + '%';
    $('b-params').textContent = v.params;
    $('b-train').textContent = v.train;
    $('b-flops').textContent = v.flops;
    $('b-lat').textContent = v.lat;
  }
  if (gst && dacot) {
    gst.addEventListener('change', renderBuilder);
    dacot.addEventListener('change', renderBuilder);
    renderBuilder();
  }

  /* ---- lightbox ---- */
  var lb = $('lightbox'), lbImg = $('lightbox-img');
  function closeLb() { lb.classList.remove('open'); lbImg.src = ''; }
  document.querySelectorAll('img.zoom').forEach(function (img) {
    img.addEventListener('click', function () { lbImg.src = img.src; lbImg.alt = img.alt; lb.classList.add('open'); });
  });
  if (lb) {
    lb.addEventListener('click', closeLb);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });
  }

  /* ---- BibTeX copy ---- */
  var copyBtn = $('copy-bib');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var text = $('bib-code').textContent;
      var done = function () {
        copyBtn.textContent = 'Copied';
        copyBtn.classList.add('done');
        setTimeout(function () { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('done'); }, 1800);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done);
    });
  }
})();
