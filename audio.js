/* ============================================
   GABSTRONOMY — Audio & Timer Engine
   ============================================ */

(function () {
  'use strict';

  // --- 5-MINUTE REST TIMER ---
  let timerInterval = null;
  let timerRemaining = 300; // 5 minutes in seconds
  let timerTotal = 300;
  let timerPaused = false;

  const overlay = document.getElementById('timer-overlay');
  const display = document.getElementById('timer-display');
  const ring = document.getElementById('timer-ring');
  const timerBtn = document.getElementById('timer-btn');
  const timerClose = document.getElementById('timer-close');
  const timerHint = document.getElementById('timer-hint');

  const CIRCUMFERENCE = 2 * Math.PI * 90; // r=90

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function updateRing() {
    const progress = timerRemaining / timerTotal;
    const offset = CIRCUMFERENCE * (1 - progress);
    if (ring) {
      ring.style.strokeDasharray = CIRCUMFERENCE;
      ring.style.strokeDashoffset = offset;
    }
  }

  function tickTimer() {
    if (timerPaused) return;
    timerRemaining--;
    if (timerRemaining <= 0) {
      timerRemaining = 0;
      clearInterval(timerInterval);
      timerInterval = null;
      // Timer complete!
      if (display) display.textContent = '0:00';
      if (timerHint) timerHint.textContent = 'Ready to serve! 🍽️';
      if (timerBtn) timerBtn.textContent = 'Done';
      if (overlay) overlay.classList.add('is-complete');
    }
    if (display) display.textContent = formatTime(timerRemaining);
    updateRing();
  }

  window.startRestTimer = function (btnEl) {
    if (!overlay) return;

    const minutes = parseInt(btnEl?.dataset?.minutes || '5', 10);
    timerTotal = minutes * 60;
    timerRemaining = timerTotal;
    timerPaused = false;

    // Reset UI
    if (display) display.textContent = formatTime(timerRemaining);
    if (timerHint) timerHint.textContent = 'Let the flavors meld together…';
    if (timerBtn) timerBtn.textContent = 'Pause';
    if (overlay) overlay.classList.remove('is-complete');
    updateRing();

    overlay.hidden = false;
    document.body.style.overflow = 'hidden';

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(tickTimer, 1000);
  };

  function closeTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    if (overlay) overlay.hidden = true;
    document.body.style.overflow = '';
  }

  if (timerBtn) {
    timerBtn.addEventListener('click', () => {
      if (timerRemaining <= 0) {
        closeTimer();
        return;
      }
      timerPaused = !timerPaused;
      timerBtn.textContent = timerPaused ? 'Resume' : 'Pause';
    });
  }

  if (timerClose) {
    timerClose.addEventListener('click', closeTimer);
  }

})();
