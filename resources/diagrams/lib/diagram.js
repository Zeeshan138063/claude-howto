// Builds a diagram page from window.SPEC. Layouts: "graph" (columns + connectors) and "sequence".
(function () {
  const S = window.SPEC;
  window.__diagramReady = false;

  const ICONS = {
    terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
    search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
    list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="16" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
    star: '<path d="M12 3l1.9 5.8L20 10l-5.1 3.2L16.2 20 12 16.5 7.8 20l1.3-6.8L4 10l6.1-1.2z"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
    server: '<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>',
    globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    git: '<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
    package: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
    layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    refresh: '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
    zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
    shuffle: '<polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    power: '<path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>',
    play: '<polygon points="5 3 19 12 5 21 5 3"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    chart: '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
    send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
    table: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="12" y1="3" x2="12" y2="21"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    inbox: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    hash: '<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  };

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };

  function icon(name) {
    const d = el('div', 'icon');
    d.innerHTML = `<svg viewBox="0 0 24 24">${ICONS[name] || ICONS.star}</svg>`;
    return d;
  }

  function node(n, extra) {
    const cls = ['node', extra, n.accent && 'accent', n.q && 'q', n.spacer && 'spacer'];
    const d = el('div', cls.filter(Boolean).join(' '));
    if (n.id) d.dataset.id = n.id;
    if (S.vertical && !extra) {
      d.classList.add('v');
      const top = el('div', 'top');
      top.append(icon(n.icon || 'help'), el('div', 'num', n.num || ''));
      d.append(top, el('h3', null, n.title || '·'));
      if (n.chip) d.append(el('span', 'chip', n.chip));
      if (n.desc) d.append(el('div', 'desc', n.desc));
      return d;
    }
    const row = el('div', 'row');
    if (n.icon || n.q) row.append(icon(n.icon || 'help'));
    const t = el('div', 'txt');
    t.append(el('h3', null, n.title || '·'));
    if (n.chip) t.append(el('span', 'chip', n.chip));
    row.append(t);
    d.append(row);
    if (n.desc) d.append(el('div', 'desc', n.desc));
    if (n.num) d.append(el('div', 'num', n.num));
    return d;
  }

  function header() {
    const h = el('header');
    const eb = el('div', 'eyebrow');
    eb.append(el('i'), document.createTextNode(S.eyebrow));
    const h1 = el('h1');
    S.title.split(/\[\[(.+?)\]\]/).forEach((part, i) => {
      h1.append(i % 2 ? el('span', null, part) : document.createTextNode(part));
    });
    h.append(eb, h1);
    if (S.sub) h.append(el('div', 'sub', S.sub));
    return h;
  }

  function footer() {
    const f = el('footer');
    const left = el('div');
    if (S.footer) left.innerHTML = S.footer;
    const brand = el('div', 'brand');
    brand.innerHTML = 'claude<span>-</span>howto';
    f.append(left, brand);
    return f;
  }

  function svgEl(tag, attrs) {
    const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    return e;
  }

  function makeSvg(w, h) {
    const svg = svgEl('svg', { class: 'edges', width: w, height: h });
    const defs = svgEl('defs', {});
    [['ah', '#22C55E'], ['ahd', 'rgba(34,197,94,.6)'], ['ahg', '#6B7280']].forEach(([id, fill]) => {
      const m = svgEl('marker', {
        id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse',
      });
      m.append(svgEl('path', { d: 'M0 0L10 5L0 10z', fill }));
      defs.append(m);
    });
    svg.append(defs);
    return svg;
  }

  function stroke(dashed) {
    return dashed
      ? { stroke: 'rgba(34,197,94,.6)', 'stroke-width': 2, 'stroke-dasharray': '6 6', 'marker-end': 'url(#ahd)' }
      : { stroke: '#22C55E', 'stroke-width': 2, 'marker-end': 'url(#ah)' };
  }

  function label(parent, text, x, y, cls) {
    const l = el('div', 'elabel' + (cls ? ' ' + cls : ''), text);
    l.style.left = x + 'px';
    l.style.top = y + 'px';
    parent.append(l);
  }

  function graph(stage) {
    stage.style.setProperty('--colgap', (S.colgap ?? 120) + 'px');
    stage.style.setProperty('--cardmax', (S.cardMax ?? 320) + 'px');
    stage.style.setProperty('--rowgap', (S.rowgap ?? 18) + 'px');
    if (S.dense) stage.classList.add('dense');
    if (S.columns.some((c) => c.label)) {
      const heads = el('div', 'heads');
      S.columns.forEach((c) => heads.append(el('div', 'colhead', c.label || '')));
      stage.append(heads);
    }
    const g = el('div', 'graph');
    stage.append(g);
    const colOf = {};
    S.columns.forEach((c, i) => {
      const col = el('div', 'col');
      c.nodes.forEach((n) => {
        col.append(node(n));
        if (n.id) colOf[n.id] = i;
      });
      g.append(col);
    });
    const edges = S.edges || [];
    const lanes = edges.filter((e) => colOf[e.to] < colOf[e.from] - 1);
    if (lanes.length) g.style.paddingBottom = 34 + lanes.length * 30 + 'px';

    return () => {
      const gr = g.getBoundingClientRect();
      const R = (id) => {
        const target = g.querySelector(`[data-id="${id}"]`);
        if (!target) throw new Error(`Unknown node id: ${id}`);
        const r = target.getBoundingClientRect();
        const l = r.left - gr.left;
        const t = r.top - gr.top;
        return { l, t, r: l + r.width, b: t + r.height, cx: l + r.width / 2, cy: t + r.height / 2 };
      };
      let cardBottom = 0;
      g.querySelectorAll('.node').forEach((n) => {
        cardBottom = Math.max(cardBottom, n.getBoundingClientRect().bottom - gr.top);
      });
      const svg = makeSvg(gr.width, gr.height);
      g.append(svg);
      let lane = 0;
      edges.forEach((e) => {
        const a = R(e.from);
        const b = R(e.to);
        const ca = colOf[e.from];
        const cb = colOf[e.to];
        const pair = edges.some((x) => x.from === e.to && x.to === e.from);
        let d;
        let lx;
        let ly;
        let side = false;
        if (cb > ca || cb === ca - 1) {
          const fwd = cb > ca;
          const off = pair ? (fwd ? -10 : 10) : 0;
          const x1 = fwd ? a.r : a.l;
          const x2 = fwd ? b.l : b.r;
          const y1 = a.cy + off;
          const y2 = b.cy + off;
          const dx = (x2 - x1) * 0.5;
          d = `M${x1} ${y1} C${x1 + dx} ${y1},${x2 - dx} ${y2},${x2} ${y2}`;
          // Keep labels away from fans: slide toward the end that has a single connection.
          const fanOut = edges.filter((x) => x.from === e.from).length > 1;
          const fanIn = edges.filter((x) => x.to === e.to).length > 1;
          const t = fanOut && !fanIn ? 0.72 : fanIn && !fanOut ? 0.28 : 0.5;
          const u = 1 - t;
          lx = u ** 3 * x1 + 3 * u * u * t * (x1 + dx) + 3 * u * t * t * (x2 - dx) + t ** 3 * x2;
          ly = u ** 3 * y1 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t ** 3 * y2 + (pair ? off * 1.7 : 0);
        } else if (cb === ca) {
          const down = b.t > a.b;
          const y1 = down ? a.b : a.t;
          const y2 = down ? b.t : b.b;
          d = `M${a.cx} ${y1} L${b.cx} ${y2}`;
          lx = a.cx + 12;
          ly = (y1 + y2) / 2;
          side = true;
        } else {
          const y = cardBottom + 30 + lane * 30;
          lane += 1;
          d = `M${a.cx} ${a.b} V${y} H${b.cx} V${b.b}`;
          lx = (a.cx + b.cx) / 2;
          ly = y;
        }
        svg.append(svgEl('path', { d, fill: 'none', ...stroke(e.dashed) }));
        if (e.label) label(g, e.label, lx, ly, [side && 'side', e.dashed && 'muted'].filter(Boolean).join(' '));
      });
    };
  }

  function sequence(stage) {
    const seq = el('div', 'seq');
    stage.append(seq);
    const P = S.participants;
    const idx = Object.fromEntries(P.map((p, i) => [p.id, i]));
    const heads = P.map((p) => {
      const h = node(p, 'ph');
      seq.append(h);
      return h;
    });

    return () => {
      const W = seq.clientWidth;
      const gutter = 44;
      const colW = (W - gutter) / P.length;
      const x = (i) => gutter + colW * (i + 0.5);
      const headW = Math.min(S.headW ?? 230, colW - 14);
      heads.forEach((h, i) => {
        h.style.left = x(i) + 'px';
        h.style.width = headW + 'px';
      });
      const hH = Math.max(...heads.map((h) => h.offsetHeight));
      heads.forEach((h) => { h.style.height = hH + 'px'; });
      const rowH = S.rowH ?? 54;
      const y0 = hH + 52;
      const H = y0 + (S.steps.length - 1) * rowH + 34;
      seq.style.height = H + 'px';
      const svg = makeSvg(W, H);
      seq.prepend(svg);
      P.forEach((_, i) => {
        svg.append(svgEl('line', {
          x1: x(i), y1: hH, x2: x(i), y2: H, stroke: '#2A2A2A', 'stroke-width': 2, 'stroke-dasharray': '4 6',
        }));
      });
      let n = 0;
      S.steps.forEach((s, k) => {
        const y = y0 + k * rowH;
        if (s.note) {
          const xs = s.over.map((id) => x(idx[id]));
          const note = el('div', 'note', s.note);
          note.style.left = (Math.min(...xs) + Math.max(...xs)) / 2 + 'px';
          note.style.top = y + 'px';
          note.style.minWidth = Math.max(...xs) - Math.min(...xs) + 160 + 'px';
          seq.append(note);
          return;
        }
        n += 1;
        const num = el('div', 'stepn', String(n).padStart(2, '0'));
        num.style.left = '0px';
        num.style.top = y + 'px';
        seq.append(num);
        const i = idx[s.from];
        const j = idx[s.to];
        const attrs = { fill: 'none', ...stroke(s.dashed) };
        const lab = el('div', 'mlabel' + (s.dashed ? ' ret' : ''), s.label);
        if (i === j) {
          const xi = x(i);
          svg.append(svgEl('path', { d: `M${xi} ${y - 11} H${xi + 34} V${y + 11} H${xi + 3}`, ...attrs }));
          lab.classList.add('self');
          lab.style.left = xi + 44 + 'px';
          lab.style.top = y + 'px';
        } else {
          const dir = j > i ? 1 : -1;
          svg.append(svgEl('path', { d: `M${x(i)} ${y} H${x(j) - dir * 3}`, ...attrs }));
          lab.style.left = (x(i) + x(j)) / 2 + 'px';
          lab.style.top = y - 6 + 'px';
        }
        seq.append(lab);
      });
    };
  }

  function build() {
    if (S.width) document.body.style.width = S.width + 'px';
    const wrap = el('div', 'wrap');
    const stage = el('div', 'stage');
    wrap.append(header(), stage, footer());
    document.body.append(wrap);
    const finish = S.layout === 'sequence' ? sequence(stage) : graph(stage);
    document.fonts.ready.then(() => {
      finish();
      window.__diagramReady = true;
    });
  }

  build();
})();
