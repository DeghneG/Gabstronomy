/* ============================================
   GABSTRONOMY — Application Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- STATE ----
  const state = {
    galleryFilters: { cuisine: null, meal: null, method: null },
    finderIngredients: [],
    finderFilters: { cuisine: null, meal: null, method: null },
    acIndex: -1,
  };

  // ---- DOM REFS ----
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  // ---- NAVIGATION ----
  const nav = $('#nav');
  const burger = $('#nav-burger');
  const mobileMenu = $('#nav-mobile');

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  $$('.nav__mobile-link').forEach(l => l.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }));

  // Active nav link on scroll
  const sections = ['hero', 'gallery', 'finder'];
  const navLinks = $$('.nav__link');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });

  // ---- BUILD FILTER PILLS ----
  function buildFilterPills(containerId, items, filterGroup, filterKey) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const allPill = document.createElement('button');
    allPill.className = 'filters__pill active';
    allPill.textContent = 'All';
    allPill.addEventListener('click', () => {
      state[filterGroup][filterKey] = null;
      container.querySelectorAll('.filters__pill').forEach(p => p.classList.remove('active'));
      allPill.classList.add('active');
      filterGroup === 'galleryFilters' ? renderGallery() : renderFinderResults();
    });
    container.appendChild(allPill);

    items.forEach(item => {
      const pill = document.createElement('button');
      pill.className = 'filters__pill';
      pill.textContent = item;
      pill.addEventListener('click', () => {
        const isActive = pill.classList.contains('active');
        container.querySelectorAll('.filters__pill').forEach(p => p.classList.remove('active'));
        if (isActive) {
          allPill.classList.add('active');
          state[filterGroup][filterKey] = null;
        } else {
          pill.classList.add('active');
          state[filterGroup][filterKey] = item;
        }
        filterGroup === 'galleryFilters' ? renderGallery() : renderFinderResults();
      });
      container.appendChild(pill);
    });
  }

  // Gallery filters
  buildFilterPills('filter-cuisine', TAXONOMY.cuisines, 'galleryFilters', 'cuisine');
  buildFilterPills('filter-meal', TAXONOMY.mealTypes, 'galleryFilters', 'meal');
  buildFilterPills('filter-method', TAXONOMY.cookingMethods, 'galleryFilters', 'method');

  // Finder secondary filters
  buildFilterPills('finder-filter-cuisine', TAXONOMY.cuisines, 'finderFilters', 'cuisine');
  buildFilterPills('finder-filter-meal', TAXONOMY.mealTypes, 'finderFilters', 'meal');
  buildFilterPills('finder-filter-method', TAXONOMY.cookingMethods, 'finderFilters', 'method');

  // Gallery clear all
  $('#filter-clear').addEventListener('click', () => {
    state.galleryFilters = { cuisine: null, meal: null, method: null };
    $$('#gallery-filters .filters__pill').forEach(p => p.classList.remove('active'));
    $$('#gallery-filters .filters__pill').forEach(p => { if (p.textContent === 'All') p.classList.add('active'); });
    renderGallery();
  });

  // ---- GALLERY RENDERING ----
  function filterDishes(dishes, filters) {
    return dishes.filter(d => {
      if (filters.cuisine && d.cuisine !== filters.cuisine) return false;
      if (filters.meal && d.mealType !== filters.meal) return false;
      if (filters.method && d.cookingMethod !== filters.method) return false;
      return true;
    });
  }


  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  function createDishCard(dish, index = 0, context = 'gallery', matchData = null) {
    let sizeClass = 'dish-card--reg';
    if (index % 5 === 0) sizeClass = 'dish-card--wide';
    else if (index % 3 === 0) sizeClass = 'dish-card--tall';

    const card = document.createElement('div');
    card.className = `dish-card ${sizeClass}`;
    card.style.transitionDelay = `${(index % 4) * 90}ms`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `View ${dish.name}`);
    
    const idxText = String(index + 1).padStart(2,'0');
    let topLabel = `<span class="dish-card__idx">${idxText} / Collection</span>`;
    
    if (context === 'finder' && matchData) {
      if (matchData.type === 'exact') {
        topLabel = `<span class="dish-card__idx" style="color:var(--ink);background:var(--white);padding:2px 8px;border-radius:100px;display:inline-block">Full Match</span>`;
      } else {
        topLabel = `<span class="dish-card__idx" style="color:var(--ink-s);background:var(--white);padding:2px 8px;border-radius:100px;display:inline-block">Missing ${matchData.missing.length}</span> <span class="dish-card__idx" style="display:inline-block;margin-left:4px">(${matchData.missing.join(', ')})</span>`;
      }
    }

    card.innerHTML = `
      <div class="dish-card__image-wrap">
        <img src="${dish.image}" alt="${dish.name}" class="dish-card__image" loading="lazy" />
        <div class="dish-card__overlay">
          <div class="dish-card__content">
            ${topLabel}
            <div class="dish-card__name">${dish.name}</div>
            <span class="dish-card__meta">${dish.cuisine} · ${dish.cookingMethod}</span>
          </div>
        </div>
      </div>
    `;
    card.addEventListener('click', () => openModal(dish));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') openModal(dish); });
    
    revealObserver.observe(card);
    return card;
  }

  function renderGallery() {
    const grid = $('#gallery-grid');
    const empty = $('#gallery-empty');
    const counter = $('#gallery-count');
    const filtered = filterDishes(DISHES, state.galleryFilters);

    grid.innerHTML = '';
    if (filtered.length === 0) {
      grid.style.display = 'none';
      empty.hidden = false;
      counter.textContent = '0';
      return;
    }
    grid.style.display = '';
    empty.hidden = true;
    counter.textContent = filtered.length;

    // Place featured first as full-width, rest normal
    const featured = filtered.filter(d => d.featured);
    const regular = filtered.filter(d => !d.featured);

    if (featured.length > 0) {
      grid.appendChild(createDishCard(featured[0], 0, 'gallery'));
    }
    const rest = [...featured.slice(1), ...regular];
    rest.forEach((d, i) => grid.appendChild(createDishCard(d, featured.length > 0 ? i + 1 : i, 'gallery')));
  }

  renderGallery();

  // ---- MODAL ----
  const modal = $('#dish-modal');
  const modalBackdrop = $('#modal-backdrop');
  const modalClose = $('#modal-close');

  function openModal(dish) {
    $('#modal-image').src = dish.image;
    $('#modal-image').alt = dish.name;
    $('#modal-cuisine').textContent = dish.cuisine;
    $('#modal-method').textContent = dish.cookingMethod;
    $('#modal-time').textContent = dish.cookTime;
    $('#modal-title').textContent = dish.name;
    $('#modal-tagline').textContent = dish.tagline;

    const ingList = $('#modal-ingredients');
    ingList.innerHTML = '';
    dish.ingredients.forEach(i => {
      const li = document.createElement('li');
      li.textContent = i.charAt(0).toUpperCase() + i.slice(1);
      ingList.appendChild(li);
    });

    const stepList = $('#modal-steps');
    stepList.innerHTML = '';
    dish.steps.forEach(s => {
      const li = document.createElement('li');
      li.textContent = s;
      stepList.appendChild(li);
    });

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  // ---- FOOD FINDER ----
  const finderSection = $('#finder');
  const finderSearch = $('#finder-search');
  const finderTags = $('#finder-tags');
  const finderAC = $('#finder-autocomplete');
  const finderClear = $('#finder-clear-all');
  const finderResults = $('#finder-results');
  const finderEmpty = $('#finder-empty');
  const finderCounter = $('#finder-counter');
  const finderFiltersEl = $('#finder-filters');

  // Quick Select Chips
  document.querySelectorAll('.finder__quick-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      addIngredient(btn.dataset.ing);
    });
  });

  // Categorize an ingredient for display
  function categorizeIngredient(ing) {
    const cats = TAXONOMY.ingredientCategories;
    if (cats.vegetables.includes(ing)) return 'Vegetable';
    for (const [sub, arr] of Object.entries(cats.meat)) { if (arr.includes(ing)) return 'Meat'; }
    for (const [sub, arr] of Object.entries(cats.seafood)) { if (arr.includes(ing)) return 'Seafood'; }
    if (cats.grainsStarches.includes(ing)) return 'Grain';
    if (cats.dairyEggs.includes(ing)) return 'Dairy / Egg';
    if (cats.herbsSpices.includes(ing)) return 'Herb / Spice';
    if (cats.pantryCondiments.includes(ing)) return 'Pantry';
    return '';
  }

  // Debounce helper
  function debounce(fn, ms) {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  // Add ingredient tag
  function addIngredient(name) {
    const lower = name.toLowerCase().trim();
    if (!lower || state.finderIngredients.includes(lower)) return;
    state.finderIngredients.push(lower);
    renderFinderTags();
    debouncedRenderResults();
    finderSearch.value = '';
    hideAC();
    finderSearch.focus();
  }

  function removeIngredient(name) {
    state.finderIngredients = state.finderIngredients.filter(i => i !== name);
    renderFinderTags();
    debouncedRenderResults();
  }

  function renderFinderTags() {
    finderTags.innerHTML = '';
    state.finderIngredients.forEach(ing => {
      const tag = document.createElement('span');
      tag.className = 'finder__tag';
      tag.innerHTML = `${ing}<button class="finder__tag-remove" aria-label="Remove ${ing}"><svg viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>`;
      tag.querySelector('button').addEventListener('click', e => { e.stopPropagation(); removeIngredient(ing); });
      finderTags.appendChild(tag);
    });
    
    if (state.finderIngredients.length === 0) {
      finderClear.classList.remove('is-active');
    } else {
      finderClear.classList.add('is-active');
    }
  }

  finderClear.addEventListener('click', () => {
    state.finderIngredients = [];
    renderFinderTags();
    debouncedRenderResults();
  });

  // Autocomplete
  function showAC(query) {
    if (!query) { hideAC(); return; }
    const q = query.toLowerCase();
    const matches = ALL_INGREDIENTS.filter(i => i.includes(q) && !state.finderIngredients.includes(i)).slice(0, 8);
    if (matches.length === 0) { hideAC(); return; }

    finderAC.innerHTML = '';
    state.acIndex = -1;
    matches.forEach((m, idx) => {
      const div = document.createElement('div');
      div.className = 'finder__ac-item';
      const cat = categorizeIngredient(m);
      div.innerHTML = `${m}${cat ? `<span class="finder__ac-cat">${cat}</span>` : ''}`;
      div.addEventListener('click', () => addIngredient(m));
      div.addEventListener('mouseenter', () => {
        state.acIndex = idx;
        highlightAC();
      });
      finderAC.appendChild(div);
    });
    finderAC.hidden = false;
  }

  function hideAC() { finderAC.hidden = true; finderAC.innerHTML = ''; state.acIndex = -1; }

  function highlightAC() {
    const items = $$('.finder__ac-item', finderAC);
    items.forEach((it, i) => it.classList.toggle('highlighted', i === state.acIndex));
  }

  const debouncedAC = debounce(q => showAC(q), 200);
  finderSearch.addEventListener('input', () => debouncedAC(finderSearch.value.trim()));
  finderSearch.addEventListener('keydown', e => {
    const items = $$('.finder__ac-item', finderAC);
    if (e.key === 'ArrowDown') { e.preventDefault(); state.acIndex = Math.min(state.acIndex + 1, items.length - 1); highlightAC(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); state.acIndex = Math.max(state.acIndex - 1, 0); highlightAC(); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (state.acIndex >= 0 && items[state.acIndex]) {
        addIngredient(items[state.acIndex].textContent.replace(/[A-Z][a-z\/\s]+$/,'').trim());
      } else if (finderSearch.value.trim()) {
        // Try exact match
        const val = finderSearch.value.trim().toLowerCase();
        if (ALL_INGREDIENTS.includes(val)) addIngredient(val);
      }
    }
    else if (e.key === 'Escape') hideAC();
    else if (e.key === 'Backspace' && !finderSearch.value && state.finderIngredients.length > 0) {
      removeIngredient(state.finderIngredients[state.finderIngredients.length - 1]);
    }
  });

  // Close AC on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('.finder__input-area')) hideAC();
  });

  // ---- FINDER MATCHING LOGIC ----
  function matchDishes() {
    if (state.finderIngredients.length === 0) return { exact: [], near: [] };

    const userSet = new Set(state.finderIngredients);
    const exact = [];
    const near = [];

    // Filter dishes by secondary filters first
    let pool = DISHES;
    const f = state.finderFilters;
    if (f.cuisine) pool = pool.filter(d => d.cuisine === f.cuisine);
    if (f.meal) pool = pool.filter(d => d.mealType === f.meal);
    if (f.method) pool = pool.filter(d => d.cookingMethod === f.method);

    pool.forEach(dish => {
      // Ignore common pantry staples for matching (salt, pepper, olive oil, sugar)
      const coreIngredients = dish.ingredients.filter(i => !['salt', 'pepper', 'olive oil', 'sugar'].includes(i));
      const missing = coreIngredients.filter(i => !userSet.has(i));

      if (missing.length === 0) {
        exact.push({ dish, missing: [] });
      } else if (missing.length <= 2) {
        near.push({ dish, missing });
      }
    });

    // Sort near matches by fewest missing
    near.sort((a, b) => a.missing.length - b.missing.length);
    return { exact, near };
  }

  // createResultCard removed, reusing createDishCard

  function renderFinderResults() {
    if (state.finderIngredients.length === 0) {
      finderSection.classList.remove('has-results');
      finderResults.innerHTML = '';
      finderEmpty.hidden = false;
      const emptyTitle = finderEmpty.querySelector('.finder__empty-title');
      const emptySub = finderEmpty.querySelector('.finder__empty-sub');
      if (emptyTitle) emptyTitle.textContent = "Start typing to see what's possible";
      if (emptySub) emptySub.innerHTML = "Add what you have on hand — we'll surface dishes you can make.<br/>Not sure where to start? Check out these examples:";
      const samplesEl = $('#finder-samples');
      if (samplesEl) samplesEl.hidden = false;
      finderCounter.hidden = true;
      finderFiltersEl.hidden = true;
      return;
    }

    finderSection.classList.add('has-results');
    finderFiltersEl.hidden = false;
    const { exact, near } = matchDishes();
    const total = exact.length + near.length;

    finderResults.innerHTML = '';
    finderEmpty.hidden = total > 0;
    finderCounter.hidden = false;

    if (total === 0) {
      // Show closest partial matches
      finderEmpty.hidden = false;
      const emptyTitle = finderEmpty.querySelector('.finder__empty-title');
      const emptySub = finderEmpty.querySelector('.finder__empty-sub');
      if (emptyTitle) emptyTitle.textContent = 'No exact or near matches';
      if (emptySub) emptySub.textContent = 'Try adding more core ingredients like a protein, grain, or vegetable.';
      const samplesEl = $('#finder-samples');
      if (samplesEl) samplesEl.hidden = true;
      $('#finder-count-text').innerHTML = `<strong>0</strong> dishes match your ingredients`;
      return;
    }

    // Counter text
    let counterText = '';
    if (exact.length > 0 && near.length > 0) {
      counterText = `<strong>${exact.length}</strong> exact match${exact.length !== 1 ? 'es' : ''} · <strong>${near.length}</strong> near match${near.length !== 1 ? 'es' : ''}`;
    } else if (exact.length > 0) {
      counterText = `<strong>${exact.length}</strong> dish${exact.length !== 1 ? 'es' : ''} you can make right now`;
    } else {
      counterText = `<strong>${near.length}</strong> dish${near.length !== 1 ? 'es' : ''} — missing 1–2 ingredients`;
    }
    $('#finder-count-text').innerHTML = counterText;

    // Render cards
    // Render cards
    let globalIndex = 0;
    exact.forEach(e => {
      finderResults.appendChild(createDishCard(e.dish, globalIndex++, 'finder', { type: 'exact', missing: [] }));
    });
    near.forEach(e => {
      finderResults.appendChild(createDishCard(e.dish, globalIndex++, 'finder', { type: 'near', missing: e.missing }));
    });
  }

  // ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // ---- RENDER SAMPLES IN EMPTY STATE ----
  function renderFinderSamples() {
    const samplesContainer = $('#finder-samples');
    if (!samplesContainer) return;
    
    // Pick 2 featured dishes as samples
    const samples = DISHES.filter(d => d.featured).slice(0, 2);
    samplesContainer.innerHTML = '';
    
    samples.forEach(dish => {
      const card = document.createElement('div');
      card.className = 'sample-recipe';
      
      const ingredientsHtml = dish.ingredients.map(i => `<span class="sample-recipe__ing-pill">${i}</span>`).join('');
      const stepsHtml = dish.steps.map(s => `<li>${s}</li>`).join('');
      
      card.innerHTML = `
        <div class="sample-recipe__image-wrap">
          <img src="${dish.image}" alt="${dish.name}" class="sample-recipe__image" loading="lazy" />
        </div>
        <div class="sample-recipe__content">
          <div class="sample-recipe__meta">${dish.cuisine} · ${dish.cookTime} · ${dish.cookingMethod}</div>
          <h3 class="sample-recipe__title">${dish.name}</h3>
          <p class="sample-recipe__desc">${dish.description || dish.tagline}</p>
          
          <div class="sample-recipe__section">
            <h4 class="sample-recipe__section-title">Ingredients Needed</h4>
            <div class="sample-recipe__ingredients">${ingredientsHtml}</div>
          </div>
          
          <div class="sample-recipe__section" style="margin-bottom:0">
            <h4 class="sample-recipe__section-title">How it is cooked</h4>
            <ol class="sample-recipe__steps">${stepsHtml}</ol>
          </div>
        </div>
      `;
      samplesContainer.appendChild(card);
    });
  }

  // Render initial samples
  renderFinderSamples();

  // ---- LAZY IMAGE LOADING with fade-in ----
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const img = e.target;
        if (img.dataset.src) { img.src = img.dataset.src; }
        img.style.opacity = '1';
        imgObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  // Observe future images via mutation observer
  const gridObserver = new MutationObserver(() => {
    document.querySelectorAll('.dish-card__image, .result-card__image').forEach(img => {
      if (!img.dataset.observed) { img.dataset.observed = '1'; imgObserver.observe(img); }
    });
  });
  gridObserver.observe(document.body, { childList: true, subtree: true });

  // ---- VIEW TOGGLE FOR GALLERY ----
  const viewGridBtn = $('#view-grid');
  const viewListBtn = $('#view-list');
  const gallerySection = $('#gallery');
  
  if (viewGridBtn && viewListBtn && gallerySection) {
    viewGridBtn.addEventListener('click', () => {
      gallerySection.classList.remove('view-list');
      viewGridBtn.classList.add('active');
      viewListBtn.classList.remove('active');
    });
    
    viewListBtn.addEventListener('click', () => {
      gallerySection.classList.add('view-list');
      viewListBtn.classList.add('active');
      viewGridBtn.classList.remove('active');
    });
  }
});
