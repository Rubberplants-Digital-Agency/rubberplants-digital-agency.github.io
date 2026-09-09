/* Rubberplants documentation — header search, the mobile sidebar toggle, and the
   "On this page" table of contents. No dependencies.

   All three are progressive: the page, the sidebar tree and every link work with
   this file blocked. Search and the TOC simply do not appear. */

(function () {
  'use strict';

  /* ================= Mobile sidebar toggle ================= */

  var toggle = document.querySelector('.menu-toggle');
  var sidebar = document.getElementById('sidebar');

  if (toggle && sidebar) {
    toggle.addEventListener('click', function () {
      var open = sidebar.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    /* Following a link should close the menu, or the page loads behind it. */
    sidebar.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        sidebar.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ================= On this page ================= */

  (function () {
    var main = document.querySelector('.site-main');
    var toc = document.getElementById('toc');
    if (!main || !toc) return;

    var list = toc.querySelector('.toc__list');
    var headings = Array.prototype.slice.call(main.querySelectorAll('h2, h3'));

    /* One heading is not a table of contents, it is a heading. */
    if (headings.length < 2) return;

    var used = Object.create(null);

    function slug(text) {
      var base = text.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-') || 'section';

      var id = base;
      var n = 2;
      while (used[id] || document.getElementById(id)) { id = base + '-' + n++; }
      used[id] = true;
      return id;
    }

    var entries = headings.map(function (heading) {
      /* Kramdown gives headings an id already; this is the safety net. */
      if (!heading.id) heading.id = slug(heading.textContent);

      var item = document.createElement('li');
      item.className = 'toc__item toc__item--' + heading.tagName.toLowerCase();

      var link = document.createElement('a');
      link.href = '#' + heading.id;
      link.textContent = heading.textContent;
      item.appendChild(link);
      list.appendChild(item);

      return { heading: heading, item: item };
    });

    toc.hidden = false;

    /* ---- Scroll spy ----
       A plain scroll read rather than IntersectionObserver: a long section with
       no heading in the observed band leaves the observer with nothing
       intersecting and the highlight goes blank. Walking the list and taking the
       last heading above the fold always has an answer. */

    var current = null;

    function markCurrent() {
      var offset = toc.getBoundingClientRect().top + 24;
      var found = entries[0];

      for (var i = 0; i < entries.length; i++) {
        if (entries[i].heading.getBoundingClientRect().top <= offset) found = entries[i];
        else break;
      }

      if (found === current) return;
      if (current) current.item.classList.remove('is-current');
      found.item.classList.add('is-current');
      current = found;
    }

    var queued = false;

    function onScroll() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(function () {
        markCurrent();
        queued = false;
      });
    }

    markCurrent();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  })();

  /* ================= Search ================= */

  var input = document.getElementById('search-input');
  var panel = document.getElementById('search-results');
  if (!input || !panel) return;

  var index = null;
  var pending = false;
  var results = [];
  var active = -1;

  function load() {
    if (index || pending) return;
    pending = true;
    fetch(input.getAttribute('data-index'))
      .then(function (response) {
        if (!response.ok) throw new Error(response.status);
        return response.json();
      })
      .then(function (data) {
        index = data;
        pending = false;
        if (input.value.trim()) run();
      })
      .catch(function () {
        pending = false;
        render([], 'Search is unavailable right now.');
      });
  }

  /* Every term must appear somewhere in the document. Weighting a title match
     far above a body match is what keeps "git workflow" from burying the page
     actually called Git workflow. */
  function score(doc, terms) {
    var title = doc.title.toLowerCase();
    var section = (doc.section || '').toLowerCase();
    var description = (doc.description || '').toLowerCase();
    var text = (doc.text || '').toLowerCase();
    var total = 0;

    for (var i = 0; i < terms.length; i++) {
      var term = terms[i];
      var hit = 0;

      if (title === term) hit += 60;
      if (title.indexOf(term) !== -1) hit += 25;
      if (section.indexOf(term) !== -1) hit += 6;
      if (description.indexOf(term) !== -1) hit += 8;
      if (text.indexOf(term) !== -1) hit += 2;

      if (!hit) return 0;          // a term nothing matched disqualifies the doc
      total += hit;
    }
    return total;
  }

  /* A short excerpt around the first match, so a body-only hit shows why. */
  function excerpt(doc, terms) {
    var text = doc.text || '';
    if (!text) return doc.description || '';

    var at = text.toLowerCase().indexOf(terms[0]);
    if (at === -1) return doc.description || text.slice(0, 110);

    var from = Math.max(0, at - 40);
    return (from > 0 ? '…' : '') + text.slice(from, from + 120).trim() + '…';
  }

  function render(list, message) {
    panel.innerHTML = '';
    active = -1;

    if (message) {
      var note = document.createElement('li');
      note.className = 'search__empty';
      note.textContent = message;
      panel.appendChild(note);
    } else {
      list.forEach(function (doc, i) {
        var item = document.createElement('li');
        item.setAttribute('role', 'option');
        item.setAttribute('aria-selected', 'false');
        item.id = 'search-result-' + i;

        var link = document.createElement('a');
        link.href = doc.url;
        link.className = 'search__result';

        var title = document.createElement('span');
        title.className = 'search__result-title';
        title.textContent = doc.title;
        link.appendChild(title);

        if (doc.section) {
          var section = document.createElement('span');
          section.className = 'search__result-section';
          section.textContent = doc.section;
          link.appendChild(section);
        }

        var snippet = document.createElement('span');
        snippet.className = 'search__result-snippet';
        snippet.textContent = doc.excerpt;
        link.appendChild(snippet);

        item.appendChild(link);
        panel.appendChild(item);
      });
    }

    var show = Boolean(message) || list.length > 0;
    panel.hidden = !show;
    input.setAttribute('aria-expanded', String(show));
  }

  function run() {
    var query = input.value.trim().toLowerCase();

    if (query.length < 2) {
      results = [];
      render([]);
      return;
    }
    if (!index) {
      load();
      return;
    }

    var terms = query.split(/\s+/);

    results = index
      .map(function (doc) {
        return { doc: doc, weight: score(doc, terms) };
      })
      .filter(function (row) { return row.weight > 0; })
      .sort(function (a, b) { return b.weight - a.weight; })
      .slice(0, 8)
      .map(function (row) {
        return {
          title: row.doc.title,
          url: row.doc.url,
          section: row.doc.section,
          excerpt: excerpt(row.doc, terms)
        };
      });

    render(results, results.length ? null : 'No matches for “' + input.value.trim() + '”.');
  }

  function highlight(next) {
    var options = panel.querySelectorAll('[role="option"]');
    if (!options.length) return;

    if (active > -1) {
      options[active].setAttribute('aria-selected', 'false');
      options[active].classList.remove('is-active');
    }

    active = (next + options.length) % options.length;
    options[active].setAttribute('aria-selected', 'true');
    options[active].classList.add('is-active');
    options[active].scrollIntoView({ block: 'nearest' });
    input.setAttribute('aria-activedescendant', options[active].id);
  }

  function close() {
    panel.hidden = true;
    active = -1;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  }

  input.addEventListener('focus', load);
  input.addEventListener('input', run);

  input.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      close();
      input.blur();
      return;
    }
    if (panel.hidden) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      highlight(active + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      highlight(active - 1);
    } else if (event.key === 'Enter') {
      var choice = panel.querySelector('.is-active a');
      if (choice) {
        event.preventDefault();
        window.location.href = choice.href;
      }
    }
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('.search')) close();
  });

  /* "/" focuses search, the way it does on GitHub — but not while the visitor
     is typing somewhere else. */
  document.addEventListener('keydown', function (event) {
    if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;

    var el = document.activeElement;
    var tag = el ? el.tagName : '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (el && el.isContentEditable)) return;

    event.preventDefault();
    input.focus();
  });
})();
