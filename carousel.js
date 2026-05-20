/* Kickoff Clean ATL — hero carousel
 * Continuous orbit + 3D mouse-tilt + depth-based scaling/z-order.
 * Vanilla port of the React ImageCarouselHero component.
 */
(function () {
  'use strict';

  const stage = document.getElementById('carousel-stage');
  if (!stage) return;

  const wrap  = stage.parentElement;
  const cards = Array.from(stage.querySelectorAll('.carousel-card'));
  const count = cards.length;
  if (!count) return;

  // Make the container respond to pointer
  wrap.classList.add('is-interactive');

  // ---- state ----
  let baseAngle = 0;
  let mx = 0, my = 0;
  let targetMx = 0, targetMy = 0;
  let rafId = null;
  let paused = false;

  const SPEED = 0.30;                 // degrees per frame (~21°/sec → 17s per revolution)
  const FOLLOW = 0.10;                // mouse easing
  const TILT_AMOUNT = 20;             // max degrees of mouse-tilt
  const ANGLE_STEP = 360 / count;

  function getRadius() {
    const w = window.innerWidth;
    if (w < 480) return 120;
    if (w < 768) return 170;
    if (w < 1100) return 230;
    return 280;
  }
  function getYSquash() {
    // Flatten orbit into an ellipse — easier on the eye
    return window.innerWidth < 640 ? 0.32 : 0.42;
  }
  function getDepth() {
    return window.innerWidth < 640 ? 80 : 160;
  }

  // ---- main loop ----
  function tick() {
    if (!paused) baseAngle = (baseAngle + SPEED) % 360;

    mx += (targetMx - mx) * FOLLOW;
    my += (targetMy - my) * FOLLOW;

    const radius = getRadius();
    const ySquash = getYSquash();
    const depth = getDepth();
    const tiltX = (my * TILT_AMOUNT).toFixed(2);
    const tiltY = (mx * TILT_AMOUNT).toFixed(2);

    for (let i = 0; i < count; i++) {
      const card = cards[i];
      const a = ((baseAngle + i * ANGLE_STEP) * Math.PI) / 180;
      const cosA = Math.cos(a);
      const sinA = Math.sin(a);

      const x = cosA * radius;
      const y = sinA * radius * ySquash;
      const z = sinA * depth;          // forward when sin > 0

      const staticRot = parseFloat(card.dataset.staticRotation) || 0;
      const front = (sinA + 1) / 2;                       // 0 = back, 1 = front
      const depthScale = 0.68 + 0.50 * front;             // [0.68, 1.18] — more dramatic
      const opacity = 0.45 + 0.55 * front;                // [0.45, 1.00] — clearer foreground

      card.style.transform =
        'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,' + z.toFixed(1) + 'px) ' +
        'rotateX(' + tiltX + 'deg) ' +
        'rotateY(' + tiltY + 'deg) ' +
        'rotate(' + staticRot + 'deg) ' +
        'scale(' + depthScale.toFixed(3) + ')';
      card.style.opacity = opacity.toFixed(3);
      card.style.zIndex = String(Math.round((sinA + 1) * 100));
    }
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (rafId == null) rafId = requestAnimationFrame(tick);
  }
  function stop() {
    if (rafId != null) { cancelAnimationFrame(rafId); rafId = null; }
  }

  // ---- pointer interactions ----
  wrap.addEventListener('mousemove', function (e) {
    const r = wrap.getBoundingClientRect();
    targetMx = (e.clientX - r.left) / r.width - 0.5;
    targetMy = (e.clientY - r.top)  / r.height - 0.5;
  });
  wrap.addEventListener('mouseleave', function () {
    targetMx = 0;
    targetMy = 0;
  });
  wrap.addEventListener('mouseenter', function () { paused = false; });

  // Hovering a card slows the orbit so the visitor can read the label
  cards.forEach(function (card) {
    card.addEventListener('mouseenter', function () { paused = true; });
    card.addEventListener('mouseleave', function () { paused = false; });
  });

  // ---- reduced motion: static fan, no rAF ----
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function renderStatic() {
    const radius = getRadius();
    const ySquash = getYSquash();
    for (let i = 0; i < count; i++) {
      const card = cards[i];
      const a = ((i * ANGLE_STEP) * Math.PI) / 180;
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius * ySquash;
      const staticRot = parseFloat(card.dataset.staticRotation) || 0;
      card.style.transform =
        'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) ' +
        'rotate(' + staticRot + 'deg)';
      card.style.opacity = '1';
      card.style.zIndex = String(Math.round((Math.sin(a) + 1) * 100));
    }
  }

  function init() {
    if (reduceMotion.matches) { stop(); renderStatic(); }
    else { start(); }
  }

  // ---- visibility & resize handling ----
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else if (!reduceMotion.matches) start();
  });
  let resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (reduceMotion.matches) renderStatic();
    }, 120);
  });
  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener('change', init);
  }

  init();
})();
