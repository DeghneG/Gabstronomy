/* ============================================
   GABSTRONOMY — Application Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- PRELOADER & HERO ENTRANCE ---
  const preloader = document.getElementById('preloader');
  const counterEl = document.getElementById('preloader-counter');
  
  const hasSeenPreloader = sessionStorage.getItem('gabstronomy_preloader');
  
  if (!hasSeenPreloader && preloader) {
    // Run preloader sequence
    document.body.style.overflow = 'hidden';
    
    // Simulate fast loading percentage
    let count = 0;
    const countInterval = setInterval(() => {
      count += Math.floor(Math.random() * 10) + 5;
      if (count > 100) count = 100;
      counterEl.textContent = String(count).padStart(3, '0') + '%';
      
      if (count === 100) {
        clearInterval(countInterval);
        setTimeout(() => {
          preloader.classList.add('is-hidden');
          setTimeout(() => {
            document.body.classList.add('start-hero');
            document.body.style.overflow = '';
            sessionStorage.setItem('gabstronomy_preloader', 'true');
          }, 800); // Wait for curtain lift
        }, 400); // Hold at 100% briefly
      }
    }, 50);
  } else if (preloader) {
    // Skip preloader
    preloader.style.display = 'none';
    document.body.classList.add('start-hero');
  } else {
    document.body.classList.add('start-hero');
  }

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
    
    // We don't render "All" anymore as a pill. The default state is no active pill.
    
    items.forEach(item => {
      const pill = document.createElement('button');
      pill.className = 'filter-pill';
      pill.textContent = item;
      pill.addEventListener('click', () => {
        const isActive = pill.classList.contains('is-active');
        container.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('is-active'));
        if (isActive) {
          state[filterGroup][filterKey] = null;
        } else {
          pill.classList.add('is-active');
          state[filterGroup][filterKey] = item;
        }
        
        if (filterGroup === 'galleryFilters') {
          updateGalleryFilterUI();
          renderGallery();
        } else {
          // finder logic
          renderFinderResults();
        }
      });
      container.appendChild(pill);
    });
  }

  // --- ACCORDION LOGIC ---
  document.querySelectorAll('.filters__trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const accordion = btn.closest('.filters__accordion');
      const wasOpen = accordion.classList.contains('is-open');
      
      // Close all
      document.querySelectorAll('.filters__accordion').forEach(a => a.classList.remove('is-open'));
      
      // Toggle
      if (!wasOpen) accordion.classList.add('is-open');
    });
  });
  
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.filters__accordion')) {
      document.querySelectorAll('.filters__accordion').forEach(a => a.classList.remove('is-open'));
    }
  });

  // --- GALLERY FILTER UI SYNC ---
  function updateGalleryFilterUI() {
    let activeCount = 0;
    
    // Update Triggers
    const cats = ['cuisine', 'meal', 'method'];
    cats.forEach(cat => {
      const val = state.galleryFilters[cat];
      const triggerValEl = document.getElementById(`trigger-val-${cat}`);
      if (triggerValEl) {
        triggerValEl.textContent = val ? `: ${val}` : '';
      }
      if (val) activeCount++;
    });

    // Update Summary
    const summary = document.getElementById('filter-summary');
    const summaryChips = document.getElementById('filter-summary-chips');
    if (!summary || !summaryChips) return;

    if (activeCount === 0) {
      summary.hidden = true;
    } else {
      summary.hidden = false;
      summaryChips.innerHTML = '';
      
      cats.forEach(cat => {
        const val = state.galleryFilters[cat];
        if (val) {
          const chip = document.createElement('span');
          chip.className = 'filter-summary-chip';
          chip.innerHTML = `${val} <button aria-label="Remove ${val}">×</button>`;
          chip.querySelector('button').addEventListener('click', () => {
            state.galleryFilters[cat] = null;
            // Also un-highlight the pill
            const container = document.getElementById(`filter-${cat}`);
            if(container) {
              container.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('is-active'));
            }
            updateGalleryFilterUI();
            renderGallery();
          });
          summaryChips.appendChild(chip);
        }
      });
    }
  }

  // Finder secondary filters
  buildFilterPills('finder-filter-cuisine', TAXONOMY.cuisines, 'finderFilters', 'cuisine');
  buildFilterPills('finder-filter-meal', TAXONOMY.mealTypes, 'finderFilters', 'meal');
  buildFilterPills('finder-filter-method', TAXONOMY.cookingMethods, 'finderFilters', 'method');

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
  }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

  function createDishCard(dish, index = 0, context = 'gallery', matchData = null) {
    let sizeClass = 'dish-card--reg';
    if (index % 5 === 0) sizeClass = 'dish-card--wide';
    else if (index % 3 === 0) sizeClass = 'dish-card--tall';

    const card = document.createElement('div');
    card.className = `dish-card ${sizeClass}`;
    card.style.setProperty('--delay', `${(index % 3) * 70}ms`);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `View ${dish.name}`);
    
    let topLabel = '';
    let contextHtml = '';
    
    if (context === 'finder') {
      sizeClass = 'result-card'; // override to use result-card style
      card.className = sizeClass;
      
      let matchLabel = '';
      if (matchData) {
        if (matchData.type === 'exact') {
          matchLabel = '<span class="result-card__match exact">Exact Match</span>';
        } else {
          matchLabel = `<span class="result-card__match near">Missing ${matchData.missing.length}</span>`;
        }
      }

      card.innerHTML = `
        <div class="result-card__image-wrap">
          <img src="${dish.image}" alt="${dish.name}" class="result-card__image" loading="lazy" />
          ${matchLabel}
        </div>
        <div class="result-card__body">
          <div class="dish-card__meta">${dish.cookingMethod} <span class="dish-card__meta-dot">·</span> ${dish.mealType}</div>
          <h3 class="dish-card__title">${dish.name}</h3>
          <div class="dish-card__context">
            <div class="dish-card__context-how">${dish.cookTime} · ${dish.tagline || 'Cooked to perfection'}</div>
            ${matchData && matchData.type === 'near' ? `<div class="dish-card__context-missing">Missing: <strong>${matchData.missing.join(', ')}</strong></div>` : ''}
          </div>
        </div>
      `;
    } else {
      // Gallery Style
      const idxText = String(index + 1).padStart(2,'0');
      topLabel = `<span class="dish-card__idx">${idxText} / The Collection</span>`;
      card.innerHTML = `
        <div class="dish-card__image-wrap">
          <div class="dish-card__wipe"></div>
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
    }
    card.addEventListener('click', () => {
      openModal(dish, card.querySelector('.dish-card__image-wrap'));
    });
    card.addEventListener('keydown', e => { if (e.key === 'Enter') openModal(dish, card.querySelector('.dish-card__image-wrap')); });

    revealObserver.observe(card);
    return card;
  }

  function renderGallery() {
    const track = $('#gallery-track');
    if (!track) return;

    track.innerHTML = '';
    
    // Place featured first, rest normal
    const featured = DISHES.filter(d => d.featured);
    const regular = DISHES.filter(d => !d.featured);
    
    const renderSet = () => {
      if (featured.length > 0) {
        track.appendChild(createDishCard(featured[0], 0, 'gallery'));
      }
      const rest = [...featured.slice(1), ...regular];
      rest.forEach((d, i) => track.appendChild(createDishCard(d, featured.length > 0 ? i + 1 : i, 'gallery')));
    };

    // Render twice for seamless perpetual motion looping
    renderSet();
    renderSet();
    
    updateGalleryScale();
  }

  function updateGalleryScale() {
    // Removed to keep cards side-by-side with no gaps
  }

  const galleryCarousel = $('#gallery-carousel');
  if (galleryCarousel) {
    galleryCarousel.addEventListener('scroll', updateGalleryScale, { passive: true });
    window.addEventListener('resize', updateGalleryScale, { passive: true });
    
    galleryCarousel.addEventListener('wheel', (e) => {
      if (e.shiftKey) return;
      
      const isAtStart = galleryCarousel.scrollLeft === 0;
      const isAtEnd = Math.abs(galleryCarousel.scrollWidth - galleryCarousel.clientWidth - galleryCarousel.scrollLeft) <= 1;
      
      if (isAtStart && e.deltaY < 0) return;
      if (isAtEnd && e.deltaY > 0) return;
      
      e.preventDefault();
      galleryCarousel.scrollBy({
        left: e.deltaY * 2.5,
        behavior: 'smooth'
      });
    }, { passive: false });
    
    // Drag to scroll
    let isDown = false;
    let startX;
    let scrollLeft;
    let isDragging = false;

    galleryCarousel.addEventListener('pointerdown', (e) => {
      isDown = true;
      isDragging = false;
      galleryCarousel.style.cursor = 'grabbing';
      startX = e.pageX - galleryCarousel.offsetLeft;
      scrollLeft = galleryCarousel.scrollLeft;
    });

    galleryCarousel.addEventListener('pointerleave', () => {
      isDown = false;
      galleryCarousel.style.cursor = '';
    });

    galleryCarousel.addEventListener('pointerup', () => {
      isDown = false;
      galleryCarousel.style.cursor = '';
    });

    galleryCarousel.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const x = e.pageX - galleryCarousel.offsetLeft;
      const walk = (x - startX) * 2; // scroll multiplier
      if (Math.abs(walk) > 10) isDragging = true;
      galleryCarousel.scrollLeft = scrollLeft - walk;
    });
    
    galleryCarousel.addEventListener('click', (e) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, { capture: true });
    
    // Perpetual Motion
    let exactScroll = 0;
    let scrollSpeed = 0.5; // pixels per frame
    let isHovered = false;
    let animationId;
    
    function startPerpetualMotion() {
      if (animationId) cancelAnimationFrame(animationId);
      
      function step() {
        if (!isHovered && !isDown && galleryCarousel.style.display !== 'none') {
          exactScroll += scrollSpeed;
          if (exactScroll >= 1) {
            const increment = Math.floor(exactScroll);
            galleryCarousel.scrollLeft += increment;
            exactScroll -= increment;
            
            // Loop back to start seamlessly
            if (galleryCarousel.scrollLeft >= galleryCarousel.scrollWidth / 2) {
              galleryCarousel.scrollLeft -= (galleryCarousel.scrollWidth / 2);
            }
          }
        }
        animationId = requestAnimationFrame(step);
      }
      animationId = requestAnimationFrame(step);
    }
    
    galleryCarousel.addEventListener('pointerenter', () => isHovered = true);
    galleryCarousel.addEventListener('pointerleave', () => isHovered = false);
    
    startPerpetualMotion();
  }

  renderGallery();

  // ---- MODAL ----
  const modal = $('#dish-modal');
  const modalBackdrop = $('#modal-backdrop');
  const modalClose = $('#modal-close');

  function openModal(dish, element) {
    const doOpen = () => {
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
    };

    if (element && document.startViewTransition) {
      element.style.viewTransitionName = 'active-dish';
      const transition = document.startViewTransition(() => {
        element.style.viewTransitionName = '';
        doOpen();
      });
    } else {
      doOpen();
    }
  }

  function closeModal() {
    const doClose = () => {
      modal.hidden = true;
      document.body.style.overflow = '';
      $('#modal-image').src = '';
    };

    if (document.startViewTransition) {
      document.startViewTransition(() => doClose());
    } else {
      doClose();
    }
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
  
  const finderBasket = $('#finder-basket');
  const finderActionRow = $('#finder-action-row');
  const finderCta = $('#finder-cta');
  const finderBrowseToggle = $('#finder-browse-toggle');
  const finderBrowsePanel = $('#finder-browse-panel');
  
  state.hasClickedFind = false;

  // Browse by category
  if (finderBrowseToggle) {
    finderBrowseToggle.addEventListener('click', () => {
      const isHidden = finderBrowsePanel.hidden;
      finderBrowsePanel.hidden = !isHidden;
      finderBrowseToggle.textContent = isHidden ? 'Browse by category ▴' : 'Browse by category ▾';
    });

    const cats = TAXONOMY.ingredientCategories;
    const structure = [
      { label: 'Vegetables', items: cats.vegetables },
      { label: 'Meat', items: [...cats.meat.pork, ...cats.meat.chicken, ...cats.meat.beef, ...cats.meat.lamb] },
      { label: 'Seafood', items: [...cats.seafood.fish, ...cats.seafood.shrimp, ...cats.seafood.crab, ...cats.seafood.shellfish] },
      { label: 'Grains & Starches', items: cats.grainsStarches },
      { label: 'Dairy & Eggs', items: cats.dairyEggs },
      { label: 'Herbs & Spices', items: cats.herbsSpices },
      { label: 'Pantry', items: cats.pantryCondiments }
    ];
    
    finderBrowsePanel.innerHTML = '';
    structure.forEach(group => {
      const col = document.createElement('div');
      col.className = 'finder__browse-col';
      col.innerHTML = `<h4>${group.label}</h4><div class="finder__browse-chips"></div>`;
      const chipsContainer = col.querySelector('.finder__browse-chips');
      group.items.forEach(ing => {
        const btn = document.createElement('button');
        btn.className = 'finder__quick-chip';
        btn.textContent = ing.charAt(0).toUpperCase() + ing.slice(1);
        btn.dataset.ing = ing;
        btn.addEventListener('click', () => {
          addIngredient(ing);
        });
        chipsContainer.appendChild(btn);
      });
      finderBrowsePanel.appendChild(col);
    });
  }

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

  // Update basket and find flow
  function updateFinderFlowState() {
    if (state.finderIngredients.length > 0) {
      finderBasket.hidden = false;
      finderActionRow.hidden = false;
      finderEmpty.style.opacity = '0';
      finderEmpty.style.height = '0';
      finderEmpty.style.overflow = 'hidden';
      finderEmpty.hidden = true;
    } else {
      finderBasket.hidden = true;
      finderActionRow.hidden = true;
      finderResults.hidden = true;
      state.hasClickedFind = false;
      
      finderEmpty.hidden = false;
      finderEmpty.style.opacity = '1';
      finderEmpty.style.height = 'auto';
    }
  }

  if (finderCta) {
    finderCta.addEventListener('click', () => {
      state.hasClickedFind = true;
      finderResults.hidden = false;
      debouncedRenderResults();
      setTimeout(() => {
        finderResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    });
  }

  // Add ingredient tag
  function addIngredient(name) {
    const lower = name.toLowerCase().trim();
    if (!lower || state.finderIngredients.includes(lower)) return;
    state.finderIngredients.push(lower);
    
    // Create and append tag directly
    const tag = document.createElement('span');
    tag.className = 'finder__tag tag-enter';
    tag.dataset.ing = lower;
    tag.innerHTML = `${lower}<button class="finder__tag-remove" aria-label="Remove ${lower}"><svg viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>`;
    tag.querySelector('button').addEventListener('click', e => { e.stopPropagation(); removeIngredient(lower); });
    finderTags.appendChild(tag);
    
    updateFinderFlowState();
    
    if (state.hasClickedFind) {
      debouncedRenderResults();
    } else {
      // We just update the counter manually if results are hidden
      updateResultsCounter();
    }
    
    finderSearch.value = '';
    hideAC();
    finderSearch.focus();
  }

  function removeIngredient(name) {
    state.finderIngredients = state.finderIngredients.filter(i => i !== name);
    
    // Find DOM node and animate out
    const tagEl = Array.from(finderTags.children).find(el => el.dataset.ing === name);
    if (tagEl) {
      tagEl.classList.remove('tag-enter');
      tagEl.classList.add('tag-exit');
      tagEl.addEventListener('animationend', () => {
        tagEl.remove();
        updateFinderFlowState();
      });
    } else {
      updateFinderFlowState();
    }
    
    if (state.hasClickedFind) {
      debouncedRenderResults();
    } else {
      updateResultsCounter();
    }
  }

  function updateResultsCounter() {
    renderFinderResults();
  }

  function renderFinderTags() {
    finderTags.innerHTML = '';
    state.finderIngredients.forEach(ing => {
      const tag = document.createElement('span');
      tag.className = 'finder__tag tag-enter';
      tag.dataset.ing = ing;
      tag.innerHTML = `${ing}<button class="finder__tag-remove" aria-label="Remove ${ing}"><svg viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>`;
      tag.querySelector('button').addEventListener('click', e => { e.stopPropagation(); removeIngredient(ing); });
      finderTags.appendChild(tag);
    });
    updateFinderFlowState();
  }

  finderClear.addEventListener('click', () => {
    state.finderIngredients = [];
    const tags = Array.from(finderTags.children);
    tags.forEach(tag => {
      tag.classList.remove('tag-enter');
      tag.classList.add('tag-exit');
      tag.addEventListener('animationend', () => tag.remove());
    });
    setTimeout(updateFinderFlowState, 300);
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

  // Animate counter text logic
  let currentCounterTotal = -1; // track last total to animate from
  
  function animateFinderCounter(newTotal, newHTMLString) {
    const el = $('#finder-count-text');
    if (!el) return;
    
    // If it's complex text (like "1 exact · 2 near"), just fade crossfade it
    // If it's a simple number jump and we have a valid previous number, we could number-spin. 
    // Given the text format can change drastically ("0 matches", "5 dishes", "1 exact"), a fade transition is much cleaner.
    
    el.style.transition = 'opacity 0.2s';
    el.style.opacity = '0';
    setTimeout(() => {
      el.innerHTML = `<strong>${newTotal}</strong> ${newHTMLString}`;
      el.style.opacity = '1';
    }, 200);
  }

  function renderFinderResults() {
    const activeIngs = state.finderIngredients;
    if (activeIngs.length === 0) {
      finderResults.innerHTML = '';
      return;
    }

    const { exact, near } = matchDishes();
    const total = exact.length + near.length;

    let counterText = '';
    if (exact.length > 0 && near.length > 0) {
      counterText = `exact match${exact.length !== 1 ? 'es' : ''} · <strong>${near.length}</strong> near match${near.length !== 1 ? 'es' : ''}`;
    } else if (exact.length > 0) {
      counterText = `dish${exact.length !== 1 ? 'es' : ''} you can make right now`;
    } else if (near.length > 0) {
      counterText = `dish${near.length !== 1 ? 'es' : ''} — missing 1–2 ingredients`;
    } else {
      counterText = `dishes match your ingredients`;
    }
    
    animateFinderCounter(total, counterText);
    currentCounterTotal = total;

    // Only render grid if they clicked Find My Dishes
    if (!state.hasClickedFind) return;

    if (total === 0) {
      finderResults.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--ink-s);">No dishes match your ingredients. Try adding more!</div>';
      return;
    }
    
    if (finderResults.children.length === 1 && !finderResults.firstElementChild.classList.contains('result-card')) {
      finderResults.innerHTML = '';
    }

    // Diff rendering for DOM cards
    const desiredDishes = [...exact, ...near].map(e => e.dish.id);
    const currentCards = Array.from(finderResults.children);
    
    // Remove ones that shouldn't be here
    currentCards.forEach(card => {
      if (!desiredDishes.includes(card.dataset.id) && !card.classList.contains('result-exit')) {
        card.classList.remove('result-enter');
        card.classList.add('result-exit');
        card.addEventListener('animationend', () => card.remove());
      }
    });

    // Add new ones
    let globalIndex = 0;
    const existingIds = currentCards.filter(c => !c.classList.contains('result-exit')).map(c => c.dataset.id);
    
    exact.forEach(e => {
      if (!existingIds.includes(e.dish.id)) {
        const card = createDishCard(e.dish, globalIndex, 'finder', { type: 'exact', missing: [] });
        card.dataset.id = e.dish.id;
        card.classList.add('result-enter');
        finderResults.appendChild(card);
      }
      globalIndex++;
    });
    near.forEach(e => {
      if (!existingIds.includes(e.dish.id)) {
        const card = createDishCard(e.dish, globalIndex, 'finder', { type: 'near', missing: e.missing });
        card.dataset.id = e.dish.id;
        card.classList.add('result-enter');
        finderResults.appendChild(card);
      }
      globalIndex++;
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

  // ---- CUSTOM CURSOR ----
  const cursor = document.getElementById('cursor');
  if (cursor) {
    let mouseX = 0, mouseY = 0, curX = 0, curY = 0;
    window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    function animateCursor(){
      curX += (mouseX - curX) * 0.18;
      curY += (mouseY - curY) * 0.18;
      cursor.style.left = curX + 'px';
      cursor.style.top = curY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }
});
