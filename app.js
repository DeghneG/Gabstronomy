/* ============================================
   GABSTRONOMY — Application Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- LENIS SMOOTH SCROLL ---
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Intercept anchor links for Lenis
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        lenis.scrollTo(targetElement, { offset: 0 });
      }
    });
  });

  // --- START HERO ---
  document.body.classList.add('start-hero');

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

  // Nav hide-on-scroll
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      nav.classList.add('nav--scrolled');
      if (window.scrollY > lastScrollY && !mobileMenu.classList.contains('open')) {
        nav.classList.add('nav--hidden');
      } else {
        nav.classList.remove('nav--hidden');
      }
    } else {
      nav.classList.remove('nav--scrolled');
      nav.classList.remove('nav--hidden');
    }
    lastScrollY = window.scrollY;
  });

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
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

  // Add Trio items to reveal observer
  $$('.trio__item').forEach(item => revealObserver.observe(item));

  // Feature frame indices — distributed evenly, not clustered
  function getFeatureIndices(total) {
    if (total <= 3) return [0];
    const features = [];
    // Place a feature roughly every 5–6 frames, starting at index 0
    const spacing = Math.max(4, Math.floor(total / Math.ceil(total / 5)));
    for (let i = 0; i < total; i += spacing) {
      features.push(i);
    }
    return features;
  }

  // Stagger offsets: alternate up/down ~18% of card height
  function getStaggerOffset(index) {
    // Even indices: shift down, Odd indices: shift up
    // This creates a rhythmic skyline
    const magnitude = 28; // px — ~18% of a 300px-wide frame's visual height
    return index % 2 === 0 ? magnitude : -magnitude;
  }

  function createDishCard(dish, index = 0, context = 'gallery', matchData = null, isFeature = false) {
    const card = document.createElement('div');

    if (context === 'finder') {
      const sizeClass = 'result-card';
      card.className = sizeClass;
      
      let matchLabel = '';
      if (matchData) {
        if (matchData.type === 'exact') {
          matchLabel = '<span class="result-card__match exact">Exact Match</span>';
        } else {
          matchLabel = `<span class="result-card__match near">Near Match — ${matchData.missing.length} missing</span>`;
        }
      }
      
      let specialHtml = '';
      if (dish.specialIngredients && dish.specialIngredients.length > 0) {
        const special = dish.specialIngredients[0]; // Just show the first one on the card
        specialHtml = `
          <div class="result-card__special">
            <span class="result-card__special-label">Special Ingredient Twist</span>
            <div class="result-card__special-title">${special.ingredient}</div>
            <div class="result-card__special-desc">${special.note}</div>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="result-card__image-wrap">
          <img src="${dish.image}" alt="${dish.name}" class="result-card__image" loading="lazy" />
          ${matchLabel}
        </div>
        <div class="result-card__body">
          <div class="result-card__meta">${dish.cookingMethod} <span class="result-card__meta-dot">·</span> ${dish.cookTime}</div>
          <h3 class="result-card__title">${dish.name}</h3>
          <div class="result-card__context">
            <div class="result-card__context-how"><strong>Core:</strong> ${dish.coreIngredients.join(', ')}</div>
            ${matchData && matchData.type === 'near' ? `<div class="result-card__context-missing">Missing: <strong>${matchData.missing.join(', ')}</strong></div>` : ''}
          </div>
          ${specialHtml}
        </div>
      `;

      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `View ${dish.name}`);
      card.addEventListener('click', () => openModal(dish, card.querySelector('.result-card__image-wrap')));
      card.addEventListener('keydown', e => { if (e.key === 'Enter') openModal(dish, card.querySelector('.result-card__image-wrap')); });
      
      // Stagger entrance delay based on index
      card.style.transitionDelay = `${(index % 12) * 50}ms`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.classList.add('is-staggered');
        });
      });

      return card;
    }

    // ---- Gallery Wall Style ----
    const sizeClass = isFeature ? 'dish-card--feature' : 'dish-card--reg';
    card.className = `dish-card ${sizeClass}`;
    card.style.setProperty('--delay', `${(index % 4) * 80}ms`);
    card.style.setProperty('--stagger-y', `${getStaggerOffset(index)}px`);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `View ${dish.name}`);

    const idxText = String(index + 1).padStart(2, '0');

    card.innerHTML = `
      <div class="dish-card__frame">
        <div class="dish-card__image-wrap">
          <div class="dish-card__wipe"></div>
          <img src="${dish.image}" alt="${dish.name}" class="dish-card__image" loading="lazy" />
          <div class="dish-card__overlay"></div>
        </div>
      </div>
      <div class="dish-card__placard">
        <span class="dish-card__placard-idx">${idxText}</span>
        <span class="dish-card__placard-name">${dish.name}</span>
        <span class="dish-card__placard-tag">${dish.cuisine} · ${dish.cookingMethod}</span>
      </div>
    `;

    card.addEventListener('click', () => openModal(dish, card.querySelector('.dish-card__image-wrap')));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') openModal(dish, card.querySelector('.dish-card__image-wrap')); });

    const frame = card.querySelector('.dish-card__frame');

    revealObserver.observe(card);
    return card;
  }

  function renderGallery() {
    const track = $('#gallery-track');
    if (!track) return;

    track.innerHTML = '';

    // Build the ordered dish list: featured first, then regular
    const featured = DISHES.filter(d => d.featured);
    const regular = DISHES.filter(d => !d.featured);
    const ordered = [...featured, ...regular];

    // Determine which indices get the larger "feature" frame
    const featureSet = new Set(getFeatureIndices(ordered.length));

    // Append 9 sets to create an endless illusion
    const NUM_SETS = 9;
    for (let s = 0; s < NUM_SETS; s++) {
      const setWrapper = document.createElement('div');
      setWrapper.className = 'gallery__set';
      
      ordered.forEach((dish, i) => {
        const isFeature = featureSet.has(i);
        setWrapper.appendChild(createDishCard(dish, i, 'gallery', null, isFeature));
      });
      
      track.appendChild(setWrapper);
    }
    
    // Position scroll at the middle set for infinite loop buffer
    requestAnimationFrame(() => {
      const carousel = $('#gallery-carousel');
      if (carousel && track.firstElementChild) {
        // Measure one set's width (including the 20px gap between sets)
        const setWidth = track.firstElementChild.offsetWidth + 20;
        carousel.scrollLeft = setWidth * 4;
      }
    });
  }

  const galleryCarousel = $('#gallery-carousel');
  if (galleryCarousel) {
    let isResetting = false;

    galleryCarousel.addEventListener('scroll', () => {
      if (isResetting) return;
      const track = $('#gallery-track');
      if (!track || !track.firstElementChild) return;
      
      const setWidth = track.firstElementChild.offsetWidth + 20;
      
      // If we scroll into the early sets, jump forward
      if (galleryCarousel.scrollLeft < setWidth * 3) {
        isResetting = true;
        galleryCarousel.scrollLeft += setWidth;
        isResetting = false;
      }
      // If we scroll into the late sets, jump backward
      else if (galleryCarousel.scrollLeft > setWidth * 5) {
        isResetting = true;
        galleryCarousel.scrollLeft -= setWidth;
        isResetting = false;
      }
    });
    
    // Auto-drift loop
    let driftSpeed = 0.5;
    let driftRaf;
    let isHoveringGallery = false;
    
    galleryCarousel.addEventListener('mouseenter', () => isHoveringGallery = true);
    galleryCarousel.addEventListener('mouseleave', () => isHoveringGallery = false);

    function driftLoop() {
      if (!isHoveringGallery && !isDown && !isResetting) {
        galleryCarousel.scrollLeft += driftSpeed;
        
        // Loop back check
        const track = $('#gallery-track');
        if (track && track.firstElementChild) {
          const setWidth = track.firstElementChild.offsetWidth + 20;
          if (galleryCarousel.scrollLeft > setWidth * 5) {
            isResetting = true;
            galleryCarousel.scrollLeft -= setWidth;
            isResetting = false;
          }
        }
      }
      driftRaf = requestAnimationFrame(driftLoop);
    }
    
    // Start drift if not prefers-reduced-motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      driftLoop();
    }
    
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
  }

  renderGallery();

  // ---- MODAL ----
  const modal = $('#dish-modal');
  const modalBackdrop = $('#modal-backdrop');
  const modalClose = $('#modal-close');

  function openModal(dish, element) {
    if (typeof dish === 'string') {
      dish = DISHES.find(d => d.id === dish);
      if (!dish) return;
    }

    const doOpen = () => {
      $('#modal-image').src = dish.image;
      $('#modal-image').alt = dish.name;
      $('#modal-cuisine').textContent = dish.cuisine;
      $('#modal-method').textContent = dish.cookingMethod;
      $('#modal-time').textContent = dish.cookTime;
      $('#modal-title').textContent = dish.name;
      $('#modal-tagline').textContent = dish.tagline;
      $('#modal-desc').textContent = dish.description;
      
      const ingList = $('#modal-ingredients');
      ingList.innerHTML = '';
      
      const renderIngredient = (name, isSpecialItem) => {
        const li = document.createElement('li');
        let text = name;
        const lowerName = name.toLowerCase();
        
        const isFav = ['chicken liver', 'potatoes', 'kamote leaves', 'chili powder', 'calamansi'].includes(lowerName);
        const isHighlight = ['bagoong'].includes(lowerName) || isSpecialItem;

        if (isFav) {
          text += ' ★';
          li.setAttribute('data-tooltip', "Deghne's fav addition to the dish");
          li.classList.add('is-fav-ingredient');
        }
        
        if (isHighlight || isFav) {
          li.classList.add('is-special');
        }
        
        li.textContent = text.charAt(0).toUpperCase() + text.slice(1);
        ingList.appendChild(li);
      };

      dish.coreIngredients.forEach(i => renderIngredient(i, false));
      if (dish.specialIngredients) {
        dish.specialIngredients.forEach(s => renderIngredient(s.ingredient, true));
      }
      
      const stepList = $('#modal-steps');
      stepList.innerHTML = '';
      dish.steps.forEach((s, idx) => {
        const li = document.createElement('li');
        li.innerHTML = s;
        // Cascade animation delay (base delay + staggered index)
        li.style.animationDelay = `${450 + (idx * 50)}ms`;
        stepList.appendChild(li);
      });

      // Apply cascade delays to ingredients too
      $$('#modal-ingredients li').forEach((li, idx) => {
        li.style.animationDelay = `${400 + (idx * 50)}ms`;
      });

      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      // Temporarily pause lenis
      if (typeof lenis !== 'undefined') lenis.stop();
      
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
      if (typeof lenis !== 'undefined') lenis.start();
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

  // ---- FOOD FINDER (STEP-BY-STEP) ----
  const finderWizard = $('#finder-wizard');
  const resultsView = $('#finder-results-view');
  const btnBack = $('#wizard-btn-back');
  const btnNext = $('#wizard-btn-next');
  const btnSubmit = $('#wizard-btn-submit');
  const btnClear = $('#wizard-btn-clear');
  const btnEdit = $('#finder-btn-edit');
  const errorMsg = $('#wizard-error');
  
  const progText = $('#wizard-progress-text');
  const progFill = $('#wizard-progress-fill');
  
  let currentStep = 1;
  const totalSteps = 3;
  
  const wizardState = {
    protein: 'none',
    vegetables: [],
    spices: []
  };

  // Setup options interactions
  $$('.wizard__opt').forEach(opt => {
    opt.addEventListener('click', () => {
      const val = opt.dataset.val;
      const isSingle = opt.classList.contains('wizard__opt--single');
      
      if (isSingle) {
        // Single select (Protein)
        const siblings = opt.parentElement.querySelectorAll('.wizard__opt');
        siblings.forEach(s => s.classList.remove('is-selected'));
        opt.classList.add('is-selected');
        if (currentStep === 1) wizardState.protein = val;
      } else {
        // Multi select
        if (val === 'none') {
          // Deselect everything else
          const siblings = opt.parentElement.querySelectorAll('.wizard__opt');
          siblings.forEach(s => s.classList.remove('is-selected'));
          opt.classList.add('is-selected');
          if (currentStep === 2) wizardState.vegetables = [];
          if (currentStep === 3) wizardState.spices = [];
        } else {
          // Deselect 'none'
          const noneOpt = opt.parentElement.querySelector('[data-val="none"]');
          if (noneOpt) noneOpt.classList.remove('is-selected');
          
          opt.classList.toggle('is-selected');
          
          // Update state array
          const arr = currentStep === 2 ? wizardState.vegetables : wizardState.spices;
          if (opt.classList.contains('is-selected')) {
            if (!arr.includes(val)) arr.push(val);
          } else {
            const idx = arr.indexOf(val);
            if (idx > -1) arr.splice(idx, 1);
          }
          
          // If array is empty, select 'none' automatically
          if (arr.length === 0 && noneOpt) noneOpt.classList.add('is-selected');
        }
      }
      errorMsg.hidden = true;
    });
  });

  // Pre-select 'none' by default
  $$('[data-val="none"]').forEach(opt => opt.classList.add('is-selected'));

  function updateWizardUI() {
    // Update steps visibility
    for (let i = 1; i <= totalSteps; i++) {
      const stepEl = $(`#wizard-step-${i}`);
      // Clean up classes
      stepEl.classList.remove('is-active', 'is-exiting-left', 'is-exiting-right');
      
      if (i === currentStep) {
        stepEl.classList.add('is-active');
      } else if (i < currentStep) {
        stepEl.classList.add('is-exiting-left');
      } else {
        stepEl.classList.add('is-exiting-right');
      }
    }
    
    // Update progress
    progText.textContent = `Step ${currentStep} of ${totalSteps}`;
    progFill.style.width = `${(currentStep / totalSteps) * 100}%`;
    
    // Update buttons
    btnBack.disabled = currentStep === 1;
    if (currentStep === totalSteps) {
      btnNext.hidden = true;
      btnSubmit.hidden = false;
    } else {
      btnNext.hidden = false;
      btnSubmit.hidden = true;
    }
    errorMsg.hidden = true;
  }

  if (btnBack) btnBack.addEventListener('click', () => { if (currentStep > 1) { currentStep--; updateWizardUI(); } });
  if (btnNext) btnNext.addEventListener('click', () => { if (currentStep < totalSteps) { currentStep++; updateWizardUI(); } });
  
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      wizardState.protein = 'none';
      wizardState.vegetables = [];
      wizardState.spices = [];
      
      $$('.wizard__opt').forEach(opt => opt.classList.remove('is-selected'));
      $$('[data-val="none"]').forEach(opt => opt.classList.add('is-selected'));
      
      currentStep = 1;
      updateWizardUI();
    });
  }
  if (btnSubmit) {
    btnSubmit.addEventListener('click', () => {
      // Validation: Prevent full empty submission
      if (wizardState.protein === 'none' && wizardState.vegetables.length === 0 && wizardState.spices.length === 0) {
        errorMsg.hidden = false;
        return;
      }
      
      finderWizard.hidden = true;
      resultsView.hidden = false;
      renderFinderResults();
      resultsView.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (btnEdit) {
    btnEdit.addEventListener('click', () => {
      resultsView.hidden = true;
      finderWizard.hidden = false;
      finderWizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ---- FINDER MATCHING LOGIC ----
  function matchDishes() {
    // Build user selection set
    const userSet = new Set();
    if (wizardState.protein !== 'none') userSet.add(wizardState.protein);
    wizardState.vegetables.forEach(v => userSet.add(v));
    wizardState.spices.forEach(s => userSet.add(s));

    const exact = [];
    const near = [];

    const PROTEINS = ['beef', 'chicken', 'fish', 'pork', 'shellfish'];

    DISHES.forEach(dish => {
      if (!dish.coreIngredients) return; // safeguard
      
      const dishProteins = dish.coreIngredients.filter(i => PROTEINS.includes(i.toLowerCase()));
      
      if (wizardState.protein === 'none') {
        if (dishProteins.length > 0) return; // Exclude dishes that require a protein
      } else {
        // Dish must include the user's selected protein
        if (!dishProteins.includes(wizardState.protein)) return;
      }
      
      const missing = dish.coreIngredients.filter(i => !userSet.has(i.toLowerCase()));

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

  function renderFinderResults() {
    const grid = $('#finder-results-grid');
    const emptyState = $('#finder-empty');
    if (!grid) return;
    
    grid.innerHTML = '';
    const { exact, near } = matchDishes();
    const total = exact.length + near.length;

    if (total === 0) {
      emptyState.hidden = false;
    } else {
      emptyState.hidden = true;
      let globalIndex = 0;
      exact.forEach(e => {
        grid.appendChild(createDishCard(e.dish, globalIndex++, 'finder', { type: 'exact', missing: [] }));
      });
      near.forEach(e => {
        grid.appendChild(createDishCard(e.dish, globalIndex++, 'finder', { type: 'near', missing: e.missing }));
      });
    }
  }

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
  const cursorLabel = document.getElementById('cursor-label');
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
      // Sync cursor label position
      if (cursorLabel) {
        cursorLabel.style.left = curX + 'px';
        cursorLabel.style.top = curY + 'px';
      }
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover state
    const addHover = () => cursor.classList.add('is-hovering');
    const rmHover = () => cursor.classList.remove('is-hovering');
    
    const hoverSelector = 'a, button, [role="button"], .dish-card, .result-card, .trio__item, .is-fav-ingredient';
    document.querySelectorAll(hoverSelector).forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', rmHover);
    });

    // Re-bind hover states on DOM changes (for dynamically rendered cards)
    const hoverObserver = new MutationObserver(() => {
      document.querySelectorAll(hoverSelector).forEach(el => {
        if (!el.dataset.cursorBound) {
          el.dataset.cursorBound = '1';
          el.addEventListener('mouseenter', addHover);
          el.addEventListener('mouseleave', rmHover);
        }
      });
    });
    hoverObserver.observe(document.body, { childList: true, subtree: true });

    // --- CURSOR CONTEXT LABEL ---
    if (cursorLabel) {
      const cardSelector = '.dish-card, .result-card, .trio__item';
      
      document.addEventListener('mouseenter', (e) => {
        if (e.target.closest(cardSelector)) {
          cursorLabel.classList.add('is-visible');
        }
      }, true);
      
      document.addEventListener('mouseleave', (e) => {
        if (e.target.closest(cardSelector)) {
          cursorLabel.classList.remove('is-visible');
        }
      }, true);
    }
  }

  // ---- SCROLL REVEAL ----
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion) {
    const revealEls = document.querySelectorAll('.reveal, .divider');
    const scrollRevealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          scrollRevealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    
    revealEls.forEach(el => scrollRevealObserver.observe(el));
  } else {
    // Skip animations — show everything immediately
    document.querySelectorAll('.reveal, .divider').forEach(el => el.classList.add('is-revealed'));
  }

  // ---- HERO PARALLAX ----
  const heroImage = document.getElementById('hero-image');
  const heroSection = document.getElementById('hero');
  if (heroImage && heroSection && !prefersReducedMotion) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroH = heroSection.offsetHeight;
          if (scrollY < heroH) {
            // Shift image down as user scrolls (parallax depth)
            const offset = scrollY * 0.3;
            heroImage.style.transform = `translateY(${offset}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ---- MAGNETIC BUTTONS ----
  if (!prefersReducedMotion) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        // Subtle pull — max ~6px displacement
        const pull = 0.25;
        btn.style.transform = `translate(${x * pull}px, ${y * pull}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ---- 3D TILT ON TRIO ITEMS ----
  if (!prefersReducedMotion) {
    document.querySelectorAll('.trio__item').forEach(item => {
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const tiltX = y * -8;  // degrees
        const tiltY = x * 8;
        item.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
      });
      item.addEventListener('mouseleave', () => {
        item.style.transform = '';
      });
    });
  }
});
