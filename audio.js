/* ============================================
   GABSTRONOMY — Audio & Timer Engine
   ============================================ */

(function () {
  'use strict';

  // --- AUDIO STATE ---
  let audioCtx = null;
  let soundEnabled = false;

  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // --- SOUND TOGGLE ---
  const toggle = document.getElementById('sound-toggle');
  const iconOff = toggle?.querySelector('.nav__sound-icon--off');
  const iconOn = toggle?.querySelector('.nav__sound-icon--on');

  function updateToggleUI() {
    if (!iconOff || !iconOn) return;
    iconOff.style.display = soundEnabled ? 'none' : 'block';
    iconOn.style.display = soundEnabled ? 'block' : 'none';
    toggle.classList.toggle('is-active', soundEnabled);
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      updateToggleUI();
      if (soundEnabled) {
        // Initialize audio context on first enable (requires user gesture)
        getAudioCtx();
        // Play a tiny confirmation tap
        playKnifeTap(0.15);
      }
    });
  }

  // --- SIZZLE SOUND ---
  // Generates a soft, short sizzle using filtered white noise
  function playSizzle(volume = 0.08) {
    if (!soundEnabled) return;
    const ctx = getAudioCtx();
    const duration = 0.18;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate noise with amplitude envelope
    for (let i = 0; i < bufferSize; i++) {
      const t = i / bufferSize;
      // Quick attack, gentle decay
      const envelope = t < 0.1 ? t / 0.1 : Math.pow(1 - (t - 0.1) / 0.9, 2);
      data[i] = (Math.random() * 2 - 1) * envelope;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Bandpass filter to shape the sizzle
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 4000 + Math.random() * 2000;
    filter.Q.value = 0.8;

    // High-pass to remove low rumble
    const hipass = ctx.createBiquadFilter();
    hipass.type = 'highpass';
    hipass.frequency.value = 2000;

    const gain = ctx.createGain();
    gain.gain.value = volume;

    source.connect(filter);
    filter.connect(hipass);
    hipass.connect(gain);
    gain.connect(ctx.destination);

    source.start();
    source.stop(ctx.currentTime + duration);
  }

  // --- KNIFE TAP SOUND ---
  // Short, sharp transient — like a knife tapping a cutting board
  function playKnifeTap(volume = 0.12) {
    if (!soundEnabled) return;
    const ctx = getAudioCtx();

    // Oscillator for the "thock" body
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = 300 + Math.random() * 100;

    // Quick pitch drop for impact feel
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.06);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(volume, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);

    // Tiny noise burst for the "click" attack
    const noiseLen = ctx.sampleRate * 0.015;
    const noiseBuf = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
    const noiseData = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * (1 - i / noiseLen);
    }
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuf;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 3000;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = volume * 0.6;

    noiseSrc.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseSrc.start(ctx.currentTime);
    noiseSrc.stop(ctx.currentTime + 0.015);
  }

  // --- COMPLETION CHIME ---
  function playChime() {
    if (!soundEnabled) return;
    const ctx = getAudioCtx();
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      const startTime = ctx.currentTime + i * 0.15;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.7);
    });
  }

  // --- BIND SOUND EVENTS ---
  // Use event delegation for dynamically created elements
  document.addEventListener('mouseenter', (e) => {
    const card = e.target.closest('.dish-card, .result-card, .trio__item');
    if (card) playSizzle();
  }, true);

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.dish-card, .result-card, .trio__item');
    if (card) playKnifeTap();
  }, true);

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
      playChime();
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

  // Expose for external use
  window.GabAudio = {
    playSizzle,
    playKnifeTap,
    playChime,
    get enabled() { return soundEnabled; }
  };
})();
