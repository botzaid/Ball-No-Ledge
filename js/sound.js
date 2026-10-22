// Sound: synthesised with the Web Audio API, so there are no audio files to
// license or download. Two switches in the masthead, both off until the visitor
// turns them on (browsers block sound before a click anyway):
//   effects  referee's whistle, crowd roar on a goal, groan on a miss, clicks
//   music    a slow stadium anthem loop over a low crowd murmur

const Sound = (() => {
  const KEYS = { fx: 'bnl_sound_fx', music: 'bnl_sound_music' };
  const read = k => { try { return localStorage.getItem(k) === '1'; } catch (e) { return false; } };
  const write = (k, v) => { try { localStorage.setItem(k, v ? '1' : '0'); } catch (e) { /* storage off */ } };

  let ctx = null, master = null, noiseBuf = null;
  const on = { fx: read(KEYS.fx), music: read(KEYS.music) };
  let musicNodes = null;

  function audio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.8;
      // Gentle limiter so overlapping effects don't clip
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14; comp.ratio.value = 6;
      master.connect(comp).connect(ctx.destination);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      // Pinkish noise: sounds more like a crowd than white noise
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < d.length; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.997 * b0 + w * 0.029; b1 = 0.985 * b1 + w * 0.032; b2 = 0.95 * b2 + w * 0.048;
        d[i] = (b0 + b1 + b2 + w * 0.02) * 2.2;
      }
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function noise(loop = false) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    src.loop = loop;
    return src;
  }

  function env(gain, t, peak, attack, hold, release) {
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(peak, t + attack);
    gain.gain.setValueAtTime(peak, t + attack + hold);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + hold + release);
  }

  // ---------- effects ----------

  // Pea whistle: a high tone with the pea's fast warble. pattern = blast lengths in seconds.
  function whistle(pattern = [0.35]) {
    if (!on.fx || !audio()) return;
    let t = ctx.currentTime + 0.02;
    for (const len of pattern) {
      const osc = ctx.createOscillator(), lfo = ctx.createOscillator(), depth = ctx.createGain(), g = ctx.createGain();
      osc.type = 'sine'; osc.frequency.value = 2900;
      lfo.frequency.value = 38; depth.gain.value = 160;
      lfo.connect(depth).connect(osc.frequency);
      env(g, t, 0.16, 0.015, len, 0.06);
      osc.connect(g).connect(master);
      osc.start(t); lfo.start(t); osc.stop(t + len + 0.1); lfo.stop(t + len + 0.1);
      t += len + 0.14;
    }
  }

  // Crowd roar: band-passed noise swelling up and dying away, with a rising cheer.
  function roar(big = false) {
    if (!on.fx || !audio()) return;
    const t = ctx.currentTime + 0.01;
    const src = noise(true), bp = ctx.createBiquadFilter(), g = ctx.createGain();
    bp.type = 'bandpass'; bp.Q.value = 0.7;
    bp.frequency.setValueAtTime(500, t); bp.frequency.linearRampToValueAtTime(big ? 1400 : 1100, t + 0.5); bp.frequency.linearRampToValueAtTime(700, t + 2.4);
    env(g, t, big ? 0.9 : 0.6, 0.25, big ? 0.9 : 0.4, big ? 2.2 : 1.6);
    src.connect(bp).connect(g).connect(master);
    src.start(t, Math.random()); src.stop(t + 4);
  }

  // The "ooooh" when a shot goes wide: a falling vowel-ish band over noise.
  function groan() {
    if (!on.fx || !audio()) return;
    const t = ctx.currentTime + 0.01;
    const src = noise(true), bp = ctx.createBiquadFilter(), g = ctx.createGain();
    bp.type = 'bandpass'; bp.Q.value = 4;
    bp.frequency.setValueAtTime(650, t); bp.frequency.exponentialRampToValueAtTime(280, t + 1.1);
    env(g, t, 0.7, 0.12, 0.3, 0.9);
    src.connect(bp).connect(g).connect(master);
    src.start(t, Math.random()); src.stop(t + 1.6);
  }

  // Short soft click for buttons and options
  function tick(high = false) {
    if (!on.fx || !audio()) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = 'triangle'; osc.frequency.setValueAtTime(high ? 1250 : 820, t); osc.frequency.exponentialRampToValueAtTime(high ? 900 : 560, t + 0.05);
    env(g, t, 0.12, 0.004, 0.01, 0.06);
    osc.connect(g).connect(master);
    osc.start(t); osc.stop(t + 0.1);
  }

  // Air sweep for page changes
  function whoosh() {
    if (!on.fx || !audio()) return;
    const t = ctx.currentTime;
    const src = noise(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
    bp.type = 'bandpass'; bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(300, t); bp.frequency.exponentialRampToValueAtTime(2400, t + 0.35);
    env(g, t, 0.18, 0.12, 0.05, 0.3);
    src.connect(bp).connect(g).connect(master);
    src.start(t, Math.random()); src.stop(t + 0.6);
  }

  // Last seconds on the clock
  function beep() {
    if (!on.fx || !audio()) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = 'square'; osc.frequency.value = 660;
    env(g, t, 0.05, 0.005, 0.05, 0.05);
    osc.connect(g).connect(master);
    osc.start(t); osc.stop(t + 0.15);
  }

  // ---------- music ----------

  // A slow anthem in D major (I–V–vi–IV) on soft brass-like pads, a bass and a
  // kick on the downbeat, over a quiet crowd bed. Scheduled a bar at a time.
  const CHORDS = [[62, 66, 69], [57, 61, 64], [59, 62, 66], [55, 59, 62]];
  const MELODY = [[74, 2], [73, 1], [71, 1], [69, 2], [66, 2], [71, 2], [69, 1], [67, 1], [66, 4]];
  const midi = n => 440 * 2 ** ((n - 69) / 12);

  function startMusic() {
    if (musicNodes || !audio()) return;
    const bus = ctx.createGain();
    bus.gain.setValueAtTime(0.0001, ctx.currentTime);
    bus.gain.exponentialRampToValueAtTime(0.32, ctx.currentTime + 2.5);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 2200;
    bus.connect(lp).connect(master);

    // crowd bed
    const crowd = noise(true), cbp = ctx.createBiquadFilter(), cg = ctx.createGain();
    cbp.type = 'bandpass'; cbp.frequency.value = 700; cbp.Q.value = 0.5; cg.gain.value = 0.18;
    crowd.connect(cbp).connect(cg).connect(bus); crowd.start();

    const beat = 60 / 76;
    let bar = 0, next = ctx.currentTime + 0.1;
    const voice = (freq, t, len, type, peak, dest = bus) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = freq;
      if (type === 'sawtooth') o.detune.value = (Math.random() - 0.5) * 12;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + Math.min(0.25, len * 0.3));
      g.gain.setValueAtTime(peak, t + len * 0.7);
      g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      o.connect(g).connect(dest); o.start(t); o.stop(t + len + 0.05);
    };
    const kick = t => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.18);
      env(g, t, 0.5, 0.004, 0.02, 0.25);
      o.connect(g).connect(bus); o.start(t); o.stop(t + 0.35);
    };
    const schedule = () => {
      while (next < ctx.currentTime + 1.5) {
        const chord = CHORDS[bar % 4];
        const len = beat * 4;
        chord.forEach(n => { voice(midi(n), next, len, 'sawtooth', 0.035); voice(midi(n), next, len, 'triangle', 0.05); });
        voice(midi(chord[0] - 24), next, len, 'sine', 0.22);
        for (let b = 0; b < 4; b++) if (b % 2 === 0) kick(next + b * beat);
        // melody on every other pass through the progression
        if (Math.floor(bar / 4) % 2 === 1) {
          const start = (bar % 4) * 4;
          let steps = 0;
          for (const [n, d] of MELODY) {
            if (steps >= start && steps < start + 4) voice(midi(n), next + (steps - start) * beat, d * beat * 0.95, 'triangle', 0.09);
            steps += d;
          }
        }
        next += len; bar++;
      }
    };
    schedule();
    const timer = setInterval(schedule, 400);
    musicNodes = { bus, crowd, timer };
  }

  function stopMusic() {
    if (!musicNodes) return;
    const { bus, crowd, timer } = musicNodes;
    musicNodes = null;
    clearInterval(timer);
    bus.gain.cancelScheduledValues(ctx.currentTime);
    bus.gain.setValueAtTime(Math.max(bus.gain.value, 0.0001), ctx.currentTime);
    bus.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
    setTimeout(() => { crowd.stop(); bus.disconnect(); }, 900);
  }

  // ---------- switches ----------

  function paint() {
    document.querySelectorAll('[data-sound]').forEach(btn => {
      const key = btn.dataset.sound;
      btn.classList.toggle('is-on', on[key]);
      btn.setAttribute('aria-pressed', String(on[key]));
    });
  }

  function set(key, value) {
    on[key] = value;
    write(KEYS[key], value);
    paint();
    if (key === 'music') value ? startMusic() : stopMusic();
    if (key === 'fx' && value) tick(true);
  }

  function init() {
    document.querySelectorAll('[data-sound]').forEach(btn => btn.addEventListener('click', () => set(btn.dataset.sound, !on[btn.dataset.sound])));
    paint();
    // Music remembered as on still needs a click before the browser lets it play
    if (on.music) {
      const resume = () => { startMusic(); removeEventListener('pointerdown', resume); removeEventListener('keydown', resume); };
      addEventListener('pointerdown', resume);
      addEventListener('keydown', resume);
    }
    // Clicks on buttons and options
    document.addEventListener('click', e => {
      if (e.target.closest('[data-sound]')) return;
      if (e.target.closest('.btn, .lobby-tier, .chip, .seg button, .ts-option, .tile, .nav-link, .theme-toggle')) tick();
    });
    // Pause the music in a background tab
    document.addEventListener('visibilitychange', () => { if (ctx) document.hidden ? ctx.suspend() : ctx.resume(); });
  }

  return { init, whistle, roar, groan, tick, whoosh, beep };
})();

window.Sound = Sound;
