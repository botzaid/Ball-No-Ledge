// Themed dropdowns. Native <select> popups can't be styled on macOS/iOS, so each
// select inside a .select label gets a button + listbox drawn in the site's theme.
// The real <select> stays in the DOM as the source of truth: picking an option
// sets its value and fires a normal 'change' event, so existing code keeps working.

const ThemedSelect = (() => {
  let open = null; // currently open instance
  let uid = 0;
  const valueDesc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');

  function enhance(select) {
    if (select.dataset.themed) return;
    select.dataset.themed = '1';
    const id = `ts-${++uid}`;
    const wrap = document.createElement('div');
    wrap.className = 'ts';
    select.parentNode.insertBefore(wrap, select);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ts-button';
    button.setAttribute('aria-haspopup', 'listbox');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', `${id}-list`);
    button.innerHTML = '<span class="ts-value"></span><svg class="ts-caret" width="12" height="8" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';

    const panel = document.createElement('div');
    panel.className = 'ts-panel';
    panel.id = `${id}-list`;
    panel.hidden = true;

    wrap.append(button, panel, select);
    select.classList.add('ts-native');
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');

    const inst = { select, button, panel, wrap, active: -1, items: [], query: '', typed: '', typedAt: 0 };
    select._ts = inst;

    // Keep the button label right when code sets select.value directly
    Object.defineProperty(select, 'value', {
      configurable: true,
      get() { return valueDesc.get.call(this); },
      set(v) { valueDesc.set.call(this, v); paintValue(inst); }
    });
    select.addEventListener('change', () => paintValue(inst));

    button.addEventListener('click', () => (open === inst ? close() : show(inst)));
    button.addEventListener('keydown', e => {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); show(inst); }
    });
    panel.addEventListener('keydown', e => onKey(inst, e));
    panel.addEventListener('click', e => {
      // The dropdown sits inside a <label>; stop the label re-clicking the button
      e.preventDefault();
      const item = e.target.closest('[role="option"]');
      if (item) choose(inst, item.dataset.value);
    });
    panel.addEventListener('pointermove', e => {
      const item = e.target.closest('[role="option"]');
      if (item) setActive(inst, inst.items.indexOf(item), false);
    });
    paintValue(inst);
  }

  function paintValue(inst) {
    const opt = inst.select.selectedOptions[0];
    inst.button.querySelector('.ts-value').textContent = opt ? opt.textContent : '';
  }

  function build(inst) {
    const { select, panel } = inst;
    const long = select.options.length > 15;
    const parts = [];
    if (long) parts.push('<div class="ts-search"><input type="search" placeholder="Type to search" aria-label="Search options" autocomplete="off"></div>');
    parts.push('<div class="ts-options" role="listbox">');
    for (const node of select.children) {
      if (node.tagName === 'OPTGROUP') {
        parts.push(`<div class="ts-group" role="group" aria-label="${escAttr(node.label)}"><div class="ts-group-label">${escAttr(node.label)}</div>`);
        for (const o of node.children) parts.push(optionHtml(o));
        parts.push('</div>');
      } else {
        parts.push(optionHtml(node));
      }
    }
    parts.push('</div>');
    panel.innerHTML = parts.join('');
    inst.items = [...panel.querySelectorAll('[role="option"]')];
    inst.items.forEach((el, i) => { el.id = `${panel.id}-o${i}`; });
    const search = panel.querySelector('.ts-search input');
    if (search) {
      search.addEventListener('input', () => filter(inst, search.value));
      search.addEventListener('keydown', e => onKey(inst, e));
    }
  }

  function optionHtml(o) {
    return `<div class="ts-option" role="option" tabindex="-1" data-value="${escAttr(o.value)}" aria-selected="${o.selected}">${escAttr(o.textContent)}</div>`;
  }

  function escAttr(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  const fold = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  function filter(inst, q) {
    const f = fold(q.trim());
    inst.items.forEach(el => { el.hidden = Boolean(f) && !fold(el.textContent).includes(f); });
    inst.panel.querySelectorAll('.ts-group').forEach(g => { g.hidden = ![...g.querySelectorAll('[role="option"]')].some(o => !o.hidden); });
    const first = inst.items.findIndex(el => !el.hidden);
    setActive(inst, first, true);
  }

  function show(inst) {
    if (open && open !== inst) close();
    build(inst);
    inst.panel.hidden = false;
    inst.button.setAttribute('aria-expanded', 'true');
    inst.wrap.classList.add('is-open');
    // Open upwards when there's no room below
    const r = inst.button.getBoundingClientRect();
    inst.wrap.classList.toggle('opens-up', innerHeight - r.bottom < 300 && r.top > innerHeight - r.bottom);
    open = inst;
    const selected = inst.items.findIndex(el => el.getAttribute('aria-selected') === 'true');
    setActive(inst, Math.max(selected, 0), true);
    const search = inst.panel.querySelector('.ts-search input');
    (search || inst.panel.querySelector('.ts-options')).focus({ preventScroll: true });
    if (!search) inst.panel.querySelector('.ts-options').tabIndex = -1;
  }

  function close(focusButton = true) {
    if (!open) return;
    const inst = open;
    open = null;
    inst.panel.hidden = true;
    inst.button.setAttribute('aria-expanded', 'false');
    inst.wrap.classList.remove('is-open');
    if (focusButton) inst.button.focus({ preventScroll: true });
  }

  function setActive(inst, i, scroll) {
    inst.items.forEach(el => el.classList.remove('is-active'));
    inst.active = i;
    const el = inst.items[i];
    if (!el) return;
    el.classList.add('is-active');
    inst.panel.querySelector('.ts-options').setAttribute('aria-activedescendant', el.id);
    inst.panel.querySelector('.ts-search input')?.setAttribute('aria-activedescendant', el.id);
    if (scroll) el.scrollIntoView({ block: 'nearest' });
  }

  function choose(inst, value) {
    const changed = inst.select.value !== value;
    inst.select.value = value;
    close();
    if (changed) inst.select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function onKey(inst, e) {
    const visible = inst.items.map((el, i) => (el.hidden ? -1 : i)).filter(i => i >= 0);
    const pos = visible.indexOf(inst.active);
    const move = d => { e.preventDefault(); setActive(inst, visible[Math.max(0, Math.min(visible.length - 1, pos + d))], true); };
    switch (e.key) {
      case 'ArrowDown': return move(1);
      case 'ArrowUp': return move(-1);
      case 'PageDown': return move(8);
      case 'PageUp': return move(-8);
      case 'Home': if (e.target.tagName !== 'INPUT') { e.preventDefault(); setActive(inst, visible[0], true); } return;
      case 'End': if (e.target.tagName !== 'INPUT') { e.preventDefault(); setActive(inst, visible[visible.length - 1], true); } return;
      case 'Enter': e.preventDefault(); if (inst.items[inst.active]) choose(inst, inst.items[inst.active].dataset.value); return;
      case 'Escape': e.preventDefault(); close(); return;
      case 'Tab': close(false); return;
      default:
        // Type-ahead when there's no search box
        if (e.target.tagName !== 'INPUT' && e.key.length === 1) {
          const now = Date.now();
          inst.typed = (now - inst.typedAt < 700 ? inst.typed : '') + fold(e.key);
          inst.typedAt = now;
          const hit = inst.items.findIndex(el => fold(el.textContent).replace(/^\d+\.\s*/, '').startsWith(inst.typed));
          if (hit >= 0) setActive(inst, hit, true);
        }
    }
  }

  function init(root = document) {
    root.querySelectorAll('.select select').forEach(enhance);
    document.addEventListener('pointerdown', e => {
      if (open && !open.wrap.contains(e.target)) close(false);
    });
    addEventListener('resize', () => close(false));
  }

  return { init, enhance };
})();

window.ThemedSelect = ThemedSelect;
