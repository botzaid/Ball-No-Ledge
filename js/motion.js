// Motion layer: split-text reveals, hero stadium canvas, tilt + spotlight cards,
// magnetic buttons, page curtain, scroll progress and confetti.
// Everything degrades to static when the visitor prefers reduced motion.

const Motion = (() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  // ---------- split text ----------

  // Wrap each word of a heading in a span so words can rise in one after another.
  function split(el) {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = '1';
    let i = 0;
    const walk = node => {
      for (const child of [...node.childNodes]) {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const outer = document.createElement('span');
            outer.className = 'w';
            const inner = document.createElement('span');
            inner.className = 'wi';
            inner.style.setProperty('--i', i++);
            inner.textContent = part;
            outer.appendChild(inner);
            frag.appendChild(outer);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          walk(child);
        }
      }
    };
    walk(el);
    el.classList.add('is-split');
  }

  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -10% 0px' })
    : null;

  // Prepare and (re)play entrance animations inside a container.
  function enter(container) {
    container.querySelectorAll('[data-split]').forEach(el => {
      split(el);
      if (reduced || !io) { el.classList.add('is-in'); return; }
      el.classList.remove('is-in');
      void el.offsetWidth;
      io.observe(el);
    });
    container.querySelectorAll('[data-blur-in]').forEach((el, i) => {
      el.style.setProperty('--bi', i);
      if (reduced) { el.classList.add('is-in'); return; }
      el.classList.remove('is-in');
      void el.offsetWidth;
      requestAnimationFrame(() => el.classList.add('is-in'));
    });
  }

  // ---------- tilt + spotlight, magnetic buttons ----------

  function bindPointerEffects() {
    if (!finePointer || reduced) return;
    document.addEventListener('pointermove', e => {
      const card = e.target.closest('.card, .feature, .route-player, .match-card, .lobby-tier');
      if (card) {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', `${x * 100}%`);
        card.style.setProperty('--my', `${y * 100}%`);
        if (card.classList.contains('card') || card.classList.contains('feature') || card.classList.contains('lobby-tier')) {
          card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 8}deg) translateY(-3px)`;
        }
      }
      const mag = e.target.closest('.magnetic');
      if (mag) {
        const r = mag.getBoundingClientRect();
        mag.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
      }
    }, { passive: true });
    document.addEventListener('pointerout', e => {
      const el = e.target.closest('.card, .feature, .lobby-tier, .magnetic');
      if (el && !el.contains(e.relatedTarget)) el.style.transform = '';
    });
  }

  // ---------- scroll progress ----------

  function bindScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
  }

  // ---------- page curtain ----------

  // A quick fade over a spinning Champions League trophy while the view swaps.
  let firstNav = true, curtainTimer = null;
  function curtain(swap) {
    const el = document.getElementById('curtain');
    if (firstNav || reduced || !el) { firstNav = false; swap(); return; }
    clearTimeout(curtainTimer);
    el.classList.remove('is-out');
    void el.offsetWidth;
    el.classList.add('is-in');
    curtainTimer = setTimeout(() => {
      swap();
      el.classList.remove('is-in');
      el.classList.add('is-out');
      curtainTimer = setTimeout(() => el.classList.remove('is-out'), 340);
    }, 420);
  }

  // ---------- hero canvas: a floodlit stadium at night ----------

  function stadium(canvas) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1, raf = null, t0 = performance.now(), visible = true;
    const motes = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random(), z: Math.random(), s: Math.random() }));
    const flashes = Array.from({ length: 40 }, () => ({ x: Math.random(), y: 0.52 + Math.random() * 0.12, t: Math.random() * 6 }));

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = now => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      // night sky
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#07070c');
      sky.addColorStop(0.55, '#0d0c17');
      sky.addColorStop(1, '#09090d');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // stands: a dark band with crowd camera flashes
      const standTop = h * 0.5, standBottom = h * 0.66;
      ctx.fillStyle = '#0f0e18';
      ctx.fillRect(0, standTop, w, standBottom - standTop);
      for (const f of flashes) {
        const phase = (t + f.t) % 6;
        if (phase < 0.12) {
          ctx.fillStyle = `rgba(255,255,255,${0.9 - phase * 6})`;
          ctx.beginPath();
          ctx.arc(f.x * w, f.y * h, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // pitch in perspective
      const horizon = standBottom, vanishX = w / 2;
      const pitch = ctx.createLinearGradient(0, horizon, 0, h);
      pitch.addColorStop(0, '#0d2416');
      pitch.addColorStop(1, '#123a22');
      ctx.fillStyle = pitch;
      ctx.fillRect(0, horizon, w, h - horizon);
      // mowing stripes
      for (let i = 0; i < 9; i++) {
        const y0 = horizon + (h - horizon) * Math.pow(i / 9, 1.6);
        const y1 = horizon + (h - horizon) * Math.pow((i + 1) / 9, 1.6);
        if (i % 2) { ctx.fillStyle = 'rgba(255,255,255,0.025)'; ctx.fillRect(0, y0, w, y1 - y0); }
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.16)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      // touchlines converge to the vanishing point
      ctx.moveTo(vanishX - w * 0.38, horizon + 2); ctx.lineTo(-w * 0.4, h);
      ctx.moveTo(vanishX + w * 0.38, horizon + 2); ctx.lineTo(w * 1.4, h);
      // halfway line and centre circle
      const mid = horizon + (h - horizon) * 0.42;
      ctx.moveTo(0, mid); ctx.lineTo(w, mid);
      ctx.ellipse(vanishX, mid, w * 0.13, (h - horizon) * 0.09, 0, 0, Math.PI * 2);
      ctx.stroke();

      // floodlight cones that sway slightly
      const lights = [[0.08, 0.06, 0.6], [0.92, 0.06, -0.6], [0.3, 0.02, 0.25], [0.7, 0.02, -0.25]];
      ctx.globalCompositeOperation = 'lighter';
      lights.forEach(([lx, ly, dir], k) => {
        const sway = Math.sin(t * 0.35 + k) * 0.05;
        const x = lx * w, y = ly * h;
        const tx = x + (dir + sway) * w * 0.6, ty = h * 0.95;
        const grad = ctx.createLinearGradient(x, y, tx, ty);
        grad.addColorStop(0, 'rgba(225,232,255,0.20)');
        grad.addColorStop(1, 'rgba(225,232,255,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(tx - w * 0.16, ty);
        ctx.lineTo(tx + w * 0.16, ty);
        ctx.closePath();
        ctx.fill();
        const bulb = ctx.createRadialGradient(x, y, 0, x, y, 70);
        bulb.addColorStop(0, 'rgba(255,255,255,0.9)');
        bulb.addColorStop(0.15, 'rgba(210,222,255,0.35)');
        bulb.addColorStop(1, 'rgba(210,222,255,0)');
        ctx.fillStyle = bulb;
        ctx.fillRect(x - 70, y - 70, 140, 140);
      });

      // dust and drizzle drifting through the light
      for (const m of motes) {
        m.y += 0.0004 + m.z * 0.0009;
        m.x += Math.sin(t * 0.6 + m.s * 10) * 0.0003;
        if (m.y > 1) { m.y = 0; m.x = Math.random(); }
        ctx.fillStyle = `rgba(220,228,255,${0.08 + m.z * 0.25})`;
        ctx.fillRect(m.x * w, m.y * h * 0.9, 1 + m.z * 1.5, 1 + m.z * 1.5);
      }
      ctx.globalCompositeOperation = 'source-over';
      if (!reduced && visible) raf = requestAnimationFrame(draw);
    };

    resize();
    new ResizeObserver(resize).observe(canvas);
    const vis = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting && !document.hidden;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    });
    vis.observe(canvas);
    document.addEventListener('visibilitychange', () => {
      visible = !document.hidden;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    });
    requestAnimationFrame(draw);
  }

  // ---------- confetti ----------

  function confetti(x = innerWidth / 2, y = innerHeight / 3, amount = 120) {
    if (reduced) return;
    const c = document.createElement('canvas');
    c.className = 'confetti';
    c.width = innerWidth; c.height = innerHeight;
    document.body.appendChild(c);
    const ctx = c.getContext('2d');
    const colors = ['#ffffff', '#e6bd5f', '#9db2ff', '#f3f0e8'];
    const bits = Array.from({ length: amount }, () => ({
      x, y, vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 14 - 4,
      r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.4,
      w: 6 + Math.random() * 6, h: 3 + Math.random() * 4, c: colors[(Math.random() * colors.length) | 0]
    }));
    const start = performance.now();
    const step = now => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (const b of bits) {
        b.vy += 0.45; b.vx *= 0.99; b.x += b.vx; b.y += b.vy; b.r += b.vr;
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r);
        ctx.fillStyle = b.c; ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
        ctx.restore();
      }
      if (now - start < 1800) requestAnimationFrame(step); else c.remove();
    };
    requestAnimationFrame(step);
  }

  function init() {
    bindPointerEffects();
    bindScrollProgress();
    const hero = document.getElementById('hero-canvas');
    if (hero) stadium(hero);
  }

  return { init, enter, split, curtain, confetti, reduced };
})();

window.Motion = Motion;
