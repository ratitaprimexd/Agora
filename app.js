/* Ágora — app de participación ciudadana (demo educativa, datos ficticios) */
'use strict';

/* ---------- utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = n => Number(n).toLocaleString('es-AR');
const pct = n => Math.round(n) + ' %';
const DIA = 864e5;
const hoy = () => new Date();
const NODO = id => NODOS.find(n => n.id === id);
const PROV = id => PROVINCIAS.find(p => p.id === id);
const CORTO = { salud: 'Salud', educacion: 'Educación', ambiente: 'Ambiente', seguridad: 'Seguridad', defensa: 'Defensa', justicia: 'Justicia', economia: 'Economía', agro: 'Agro', transporte: 'Transporte', exteriores: 'Exteriores', social: 'Social' };
const TIPO_COLOR = { 'Crítica': 'orange', 'Idea': '', 'Mejora': 'green', 'Pregunta': 'purple' };

function hashStr(s) { let h = 1779033703 ^ s.length; for (let i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); } return h >>> 0; }
function rng(seed) { let a = hashStr(String(seed)); return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
const persona = r => `${pick(r, NOMBRES)} ${pick(r, APELLIDOS)}`;
const iniciales = n => n.split(/\s+/).map(x => x[0]).slice(0, 2).join('').toUpperCase();
const colorDe = s => `hsl(${hashStr(s) % 360} 60% 48%)`;
function hace(dias) {
  if (dias <= 0) return 'hoy';
  if (dias === 1) return 'ayer';
  if (dias < 30) return `hace ${dias} días`;
  const m = Math.round(dias / 30); return m === 1 ? 'hace un mes' : `hace ${m} meses`;
}
const mayus = t => t.charAt(0).toUpperCase() + t.slice(1);
const fechaLarga = d => d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const fechaCorta = d => d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });

/* ---------- estado guardado en el navegador ---------- */
const KEY = 'agora.v1';
const vacio = () => ({ user: null, apoyos: {}, votos: {}, propias: [], debates: [], coms: {}, perfil: {}, verProv: null });
let S = vacio();
try { S = Object.assign(vacio(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* sin almacenamiento */ }
if (S.user && !PROVINCIAS.some(p => p.id === S.user.prov)) S.user = null;
if (S.verProv && !PROVINCIAS.some(p => p.id === S.verProv)) S.verProv = null;
function guardar() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignorar */ } }

/* ---------- generación de datos ficticios por provincia ---------- */
const cache = {};
function datosProv(pid) {
  if (cache[pid]) return cache[pid];
  const P = PROV(pid), r = rng('niki-' + pid);
  const umbral = Math.max(1500, Math.round(P.poblacion * 0.005 / 100) * 100);
  const fill = (s, loc) => s.replaceAll('{loc}', loc).replaceAll('{prov}', P.nombre);
  const propuestas = [], debates = [], info = {}, tend = {};
  NODOS.forEach(N => {
    (PROPUESTAS_MODELO[N.id] || []).forEach((m, i) => {
      const loc = pick(r, P.localidades), f = 0.06 + r() * 1.3;
      propuestas.push({ id: `p-${pid}-${N.id}-${i}`, prov: pid, nodo: N.id, tema: N.temas[m.t].n, loc,
        titulo: fill(m.ti, loc), cuerpo: fill(m.cu, loc), autor: persona(r), apoyos: Math.round(umbral * f), umbral,
        estado: f >= 1 ? (r() < 0.4 ? 'aprobada' : 'tratamiento') : 'apoyos', dias: 1 + Math.floor(r() * 75) });
    });
    (DEBATES_MODELO[N.id] || []).forEach(([tipo, t, ti], i) => {
      const n = 2 + Math.floor(r() * 4), coms = [];
      for (let k = 0; k < n; k++) coms.push({ autor: persona(r), texto: pick(r, COMENTARIOS[tipo]), dias: Math.floor(r() * 6) });
      debates.push({ id: `d-${pid}-${N.id}-${i}`, prov: pid, nodo: N.id, tipo, tema: N.temas[t].n, loc: pick(r, P.localidades),
        titulo: ti, texto: `${ti}. Lo comparto para que el Nodo de ${N.nombre} de ${P.nombre} lo tenga en cuenta.`, autor: persona(r),
        coms, vistas: 40 + Math.floor(r() * 900), dias: 1 + Math.floor(r() * 20) });
    });
    info[N.id] = { ministro: persona(r), vice: persona(r), presupuesto: Math.round(P.poblacion * (8 + r() * 30) / 1000) * 1000,
      detecciones: 1 + Math.floor(r() * 7), vivo: r() < 0.45, espectadores: 80 + Math.floor(r() * 1400) };
    const base = 30 + r() * 70;
    tend[N.id] = { serie: Array.from({ length: 12 }, (_, k) => Math.round(base * (0.6 + 0.5 * Math.sin(k / 2 + r() * 2) * 0.5 + r() * 0.5 + k * 0.03) * P.poblacion / 400000)),
      criticas: Math.round(base * (0.5 + r())), ideas: Math.round(base * (0.4 + r())), mejoras: Math.round(base * (0.3 + r() * 0.8)) };
  });
  return (cache[pid] = { P, umbral, propuestas, debates, info, tend });
}
function propuestasDe(pid) { return datosProv(pid).propuestas.concat(S.propias.filter(p => p.prov === pid)); }
function debatesDe(pid) { return datosProv(pid).debates.concat(S.debates.filter(d => d.prov === pid)); }
function buscarPropuesta(id) { const u = S.propias.find(p => p.id === id); if (u) return u; const pid = id.split('-')[1]; return PROV(pid) ? datosProv(pid).propuestas.find(p => p.id === id) : null; }
function buscarDebate(id) { const u = S.debates.find(d => d.id === id); if (u) return u; const pid = id.split('-')[1]; return PROV(pid) ? datosProv(pid).debates.find(d => d.id === id) : null; }
const apoyosDe = p => p.apoyos + (S.apoyos[p.id] ? 1 : 0);

/* Elysia: sugiere nodo y tema según palabras clave (la persona confirma) */
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
function clasificar(texto) {
  const t = ' ' + norm(texto) + ' '; let mejor = null;
  NODOS.forEach(N => N.temas.forEach(T => {
    let pts = 0; T.k.forEach(k => { if (t.includes(norm(k))) pts += k.length > 6 ? 2 : 1; });
    if (pts && (!mejor || pts > mejor.pts)) mejor = { nodo: N.id, tema: T.n, pts };
  }));
  return mejor;
}

/* ---------- mandato de Elysia: cuenta progresiva y regresiva ---------- */
function partes(desde, hasta) {
  if (hasta < desde) return { a: 0, m: 0, d: 0, h: 0, mi: 0, s: 0 };
  let a = hasta.getFullYear() - desde.getFullYear(), base = new Date(desde);
  base.setFullYear(desde.getFullYear() + a);
  if (base > hasta) { a--; base = new Date(desde); base.setFullYear(desde.getFullYear() + a); }
  let m = 0;
  for (;;) { const n = new Date(base); n.setMonth(n.getMonth() + 1); if (n > hasta) break; base = n; m++; }
  let ms = hasta - base; const d = Math.floor(ms / DIA); ms -= d * DIA;
  const h = Math.floor(ms / 36e5); ms -= h * 36e5; const mi = Math.floor(ms / 6e4); ms -= mi * 6e4;
  return { a, m, d, h, mi, s: Math.floor(ms / 1000) };
}
const UNID = [['a', 'años'], ['m', 'meses'], ['d', 'días'], ['h', 'horas'], ['mi', 'min'], ['s', 'seg']];
function contadorHTML(modo) {
  return `<div class="counter six ${modo === 'resta' ? 'down' : ''}" data-count="${modo}">${UNID.map(([k, l]) => `<div><b data-u="${k}">0</b><span>${l}</span></div>`).join('')}</div>`;
}
function avanceMandato() { const t = hoy(); return Math.min(100, Math.max(0, (t - MANDATO.inicio) / (MANDATO.fin - MANDATO.inicio) * 100)); }
function textoResta() {
  const p = partes(hoy(), MANDATO.fin);
  return `${p.a} ${p.a === 1 ? 'año' : 'años'}, ${p.m} ${p.m === 1 ? 'mes' : 'meses'} y ${p.d} ${p.d === 1 ? 'día' : 'días'}`;
}
function tickContadores() {
  const t = hoy();
  document.querySelectorAll('[data-count]').forEach(el => {
    const p = el.dataset.count === 'lleva' ? partes(MANDATO.inicio, t) : partes(t, MANDATO.fin);
    el.querySelectorAll('[data-u]').forEach(b => { b.textContent = String(p[b.dataset.u]).padStart(b.dataset.u === 'a' || b.dataset.u === 'm' || b.dataset.u === 'd' ? 1 : 2, '0'); });
  });
  document.querySelectorAll('[data-avance]').forEach(el => { el.style.width = avanceMandato().toFixed(3) + '%'; });
  document.querySelectorAll('[data-avance-txt]').forEach(el => { el.textContent = avanceMandato().toFixed(4).replace('.', ',') + ' %'; });
  document.querySelectorAll('[data-resta-txt]').forEach(el => { el.textContent = textoResta(); });
}
setInterval(tickContadores, 1000);

/* ---------- gráficos SVG ---------- */
function barrasH(items, { max, sufijo = '' } = {}) {
  const w = 340, fila = 28, lab = 92, h = items.length * fila + 6, m = max || Math.max(...items.map(i => i.v), 1);
  const ancho = w - lab - 46;
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Gráfico de barras">
    <defs><linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".5" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".08"/></linearGradient></defs>
    ${items.map((it, i) => { const y = i * fila + 4, bw = Math.max(3, it.v / m * ancho);
      return `<text x="${lab - 6}" y="${y + 15}" text-anchor="end" font-size="12" fill="#0b3a4a">${esc(it.l)}</text>
      <rect x="${lab}" y="${y + 2}" width="${ancho}" height="18" rx="9" fill="rgba(255,255,255,.6)"/>
      <rect x="${lab}" y="${y + 2}" width="${bw}" height="18" rx="9" fill="${it.c}"/>
      <rect x="${lab}" y="${y + 2}" width="${bw}" height="18" rx="9" fill="url(#gl)"/>
      <text x="${lab + bw + 5}" y="${y + 15}" font-size="11.5" font-weight="700" fill="#0b3a4a">${esc(num(it.v))}${sufijo}</text>`; }).join('')}
  </svg>`;
}
function barrasApiladas(items) {
  const w = 340, fila = 28, lab = 92, h = items.length * fila + 6, ancho = w - lab - 6;
  const cols = ['#ff9a1f', '#14b8c4', '#4cc35a'];
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Críticas, ideas y mejoras por nodo">
    ${items.map((it, i) => { const y = i * fila + 4, tot = it.p.reduce((a, b) => a + b, 0) || 1; let x = lab;
      return `<text x="${lab - 6}" y="${y + 15}" text-anchor="end" font-size="12" fill="#0b3a4a">${esc(it.l)}</text>` +
        it.p.map((v, k) => { const bw = v / tot * ancho; const r = `<rect x="${x}" y="${y + 2}" width="${bw}" height="18" fill="${cols[k]}"><title>${num(v)}</title></rect>`; x += bw; return r; }).join('') +
        `<rect x="${lab}" y="${y + 2}" width="${ancho}" height="9" fill="rgba(255,255,255,.35)"/>`; }).join('')}
  </svg>
  <div class="legend"><span><i style="background:#ff9a1f"></i>Críticas</span><span><i style="background:#14b8c4"></i>Ideas</span><span><i style="background:#4cc35a"></i>Mejoras</span></div>`;
}
function linea(vals, color = '#14b8c4') {
  const w = 340, h = 170, pl = 30, pr = 10, pt = 12, pb = 26, mx = Math.max(...vals) * 1.15 || 1;
  const meses = [], d = hoy();
  for (let i = 11; i >= 0; i--) { const x = new Date(d.getFullYear(), d.getMonth() - i, 1); meses.push(x.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '')); }
  const X = i => pl + i * (w - pl - pr) / 11, Y = v => pt + (1 - v / mx) * (h - pt - pb);
  const pts = vals.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
  const gid = 'lg' + hashStr(color + vals.join());
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Actividad de los últimos 12 meses">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".45"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
    ${[0, .5, 1].map(f => `<line x1="${pl}" x2="${w - pr}" y1="${Y(mx * f / 1.15)}" y2="${Y(mx * f / 1.15)}" stroke="rgba(10,143,156,.15)"/>
      <text x="${pl - 4}" y="${Y(mx * f / 1.15) + 4}" text-anchor="end" font-size="10" fill="#3f6775">${num(Math.round(mx * f / 1.15))}</text>`).join('')}
    <polygon points="${X(0)},${h - pb} ${pts} ${X(11)},${h - pb}" fill="url(#${gid})"/>
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    ${vals.map((v, i) => `<circle cx="${X(i)}" cy="${Y(v)}" r="3.5" fill="#fff" stroke="${color}" stroke-width="2"><title>${meses[i]}: ${num(v)}</title></circle>`).join('')}
    ${meses.map((m, i) => i % 2 === 0 ? `<text x="${X(i)}" y="${h - 8}" text-anchor="middle" font-size="10" fill="#3f6775">${m}</text>` : '').join('')}
  </svg>`;
}

/* ---------- piezas comunes ---------- */
const DEMO = `<div class="demo-ribbon"><span>⚠️</span><span><b>Demostración educativa.</b> Niki, sus provincias, usuarios, propuestas y votos son ficticios. Ágora no es un sistema electoral oficial ni seguro.</span></div>`;
const volver = (href, txt = 'Volver') => `<a class="link back" href="${href}">‹ ${esc(txt)}</a>`;
function tarjetaPropuesta(p) {
  const N = NODO(p.nodo), a = apoyosDe(p), f = Math.min(100, a / p.umbral * 100);
  const est = p.estado === 'aprobada' ? '<span class="badge green">Aprobada por el nodo</span>' : p.estado === 'tratamiento' ? '<span class="badge purple">En tratamiento</span>' : '<span class="badge outline">Juntando apoyos</span>';
  return `<a class="item" href="#/propuesta/${p.id}">
    <div class="meta"><span class="badge" style="background:${N.color}">${N.icono} ${esc(CORTO[N.id])}</span><span class="badge outline">${esc(p.tema)}</span>${est}</div>
    <h3>${esc(p.titulo)}</h3>
    <div class="muted small">📍 ${esc(p.loc)} · ${esc(p.autor)} · ${hace(p.dias)}</div>
    <div class="progress ${f >= 100 ? '' : 'turq'}" style="margin-top:8px"><i style="width:${f}%"></i></div>
    <div class="muted small" style="margin-top:4px">${num(a)} apoyos de ${num(p.umbral)} necesarios ${S.apoyos[p.id] ? '· ✔ Apoyaste' : ''}</div>
  </a>`;
}
function tarjetaDebate(d) {
  const n = d.coms.length + (S.coms[d.id] || []).length;
  return `<a class="item" href="#/debate/${d.id}">
    <div class="meta"><span class="badge ${TIPO_COLOR[d.tipo]}">${esc(d.tipo)}</span><span class="badge outline">${esc(d.tema)}</span></div>
    <h3>${esc(d.titulo)}</h3>
    <div class="muted small">📍 ${esc(d.loc)} · ${esc(d.autor)} · 💬 ${n} · 👁 ${num(d.vistas)}</div>
  </a>`;
}
function comentarioHTML(c) {
  return `<div class="comment row" style="align-items:flex-start"><div class="avatar" style="background:${colorDe(c.autor)}">${esc(iniciales(c.autor))}</div>
    <div class="grow"><div class="who">${esc(c.autor)} <small>· ${hace(c.dias || 0)}</small></div><div>${esc(c.texto)}</div></div></div>`;
}
function provGrid() {
  return `<div class="prov-grid">${PROVINCIAS.map((p, i) => `<a class="prov-card" style="--c:${p.color}" href="#/provincia/${p.id}">
    <span class="num">${String(i + 1).padStart(2, '0')}</span><b>${esc(p.nombre)}</b><span>${esc(p.tipo || 'Provincia')} · ${esc(p.capital)}</span></a>`).join('')}</div>`;
}

/* Mapa de Niki: silueta inspirada en un casco de F1 visto de perfil */
let mapaSel = null;
function infoMapa() {
  const p = PROV(mapaSel);
  if (!p) return `<p class="muted" style="margin:0;text-align:center">👆 Tocá una provincia del casco para conocerla.</p>`;
  return `<div class="row"><div class="orb sm" style="--c:${p.color}">${p.tipo ? '⭐' : '📍'}</div>
    <div class="grow"><b style="font-size:17px">${esc(p.nombre)}</b> ${p.tipo ? '<span class="badge yellow">Distrito Capital</span>' : ''}
    <div class="muted small">Capital: ${esc(p.capital)} · ${num(p.poblacion)} hab. · ${p.localidades.length} localidades</div></div></div>
    <p class="small">${esc(p.lema)}</p>
    <a class="btn block" href="#/provincia/${p.id}">Entrar a ${esc(p.nombre)} ›</a>`;
}
function mapaNiki() {
  const lineas = [70, 120, 170, 220, 270, 320, 370].map((y, i) =>
    `<path d="M-60 ${y} q40 ${i % 2 ? -6 : 6} 80 0" /><path d="M${545 + (i % 3) * 8} ${y + 14} q30 ${i % 2 ? 5 : -5} 60 0" />`).join('');
  const etiquetas = PROVINCIAS.map(p => {
    const w = p.nombre.length * 7.4 + 14, [x, y] = p.lbl;
    return `<g class="lbl" transform="translate(${x} ${y})"><rect x="${-w / 2}" y="-11" width="${w}" height="21" rx="10.5"/><text y="4" text-anchor="middle">${esc(p.nombre)}</text></g>`;
  }).join('');
  return `<div class="glass mapa" id="mapa">
    <div class="mapa-head"><b>NIKI · Mapa de provincias</b><span class="muted small">13 provincias</span></div>
    <svg class="mapa-svg" viewBox="-60 0 680 440" role="group" aria-label="Mapa de Niki con sus 13 provincias">
      <defs>
        <clipPath id="casco"><polygon points="${SILUETA}"/></clipPath>
        <linearGradient id="brillo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <filter id="sombraCasco" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#086B71" flood-opacity=".28"/></filter>
      </defs>
      <g class="velocidad">${lineas}</g>
      <polygon points="${SILUETA}" fill="#fff" filter="url(#sombraCasco)"/>
      ${PROVINCIAS.map(p => `<g class="prov-shape ${mapaSel === p.id ? 'on' : ''}" data-act="mapa" data-prov="${p.id}" tabindex="0" role="button" aria-label="${esc(p.nombre)}${p.tipo ? ', Distrito Capital' : ''}"><polygon points="${p.poly}" style="--c:${p.color}"/></g>`).join('')}
      <rect clip-path="url(#casco)" x="0" y="0" width="560" height="170" fill="url(#brillo)" pointer-events="none"/>
      <polygon points="${SILUETA}" fill="none" stroke="#086B71" stroke-width="7" stroke-linejoin="round" pointer-events="none"/>
      <g pointer-events="none">${etiquetas}
        <circle class="pulso" cx="${CAPITAL_XY[0]}" cy="${CAPITAL_XY[1]}" r="7"/>
        <circle cx="${CAPITAL_XY[0]}" cy="${CAPITAL_XY[1]}" r="7" fill="#FF922E" stroke="#fff" stroke-width="3"/>
        <text class="cap" x="${CAPITAL_XY[0]}" y="${CAPITAL_XY[1] + 24}" text-anchor="middle">★ Capital</text>
      </g>
    </svg>
    <div class="mapa-info" id="mapaInfo">${infoMapa()}</div>
    <p class="muted small" style="margin-bottom:0">La silueta de Niki se inspira en un casco de Fórmula 1 visto de perfil.</p>
  </div>
  <details class="glass tight lista-prov"><summary>Ver la lista de provincias</summary>${provGrid()}</details>`;
}

const fechaEn = dias => new Date(hoy().getTime() + dias * DIA);

/* ---------- vistas ---------- */
const V = {};

V.inicio = () => {
  const d = hoy(), feat = BOLETIN.find(b => b.destacado);
  return `
  <section class="glass hero photo-bg" style="--img:url(inicio.webp)">
    <img class="logo" src="logo.webp" alt="Logo de Ágora">
    <h1>Bienvenidos a Ágora</h1>
    <p class="sub">La plataforma de participación ciudadana de la <b>República de Niki</b>, en la Lumencracia. Informate, proponé y debatí con tu provincia.</p>
    <div class="btn-row" style="justify-content:center">
      <a class="btn" href="#/provincias">Elegir mi provincia</a>
      <a class="btn orange" href="#/elysia">Mandato de Elysia</a>
    </div>
  </section>
  ${DEMO}
  <a class="glass tight item" href="#/elysia" style="display:block">
    <div class="row"><div class="orb sm" style="--c:#8a5cd6">✨</div>
      <div class="grow"><b>Elysia · Perfil «${esc(MANDATO.programa)}»</b>
        <div class="muted small">Quedan <span data-resta-txt>${textoResta()}</span> de mandato</div></div></div>
    <div class="progress orange" style="margin-top:10px"><i data-avance style="width:${avanceMandato()}%"></i></div>
  </a>

  <div class="section-title"><h2>📰 Boletín Oficial</h2><a href="#/boletin">Ver todo</a></div>
  <p class="muted" style="margin:0 2px 8px">${mayus(fechaLarga(d))}</p>
  <div class="card-list">
    ${noticiaHTML(feat, true)}
    ${BOLETIN.filter(b => !b.destacado).slice(0, 3).map(b => noticiaHTML(b)).join('')}
  </div>

  <div class="section-title"><h2>📅 Calendario del mes</h2></div>
  <div class="glass" id="cal">${calendarioHTML()}</div>

  <div class="section-title"><h2>🗳️ Consultas abiertas</h2><a href="#/consultas">Ver todas</a></div>
  <div class="card-list">${CONSULTAS_MODELO.filter(c => c.alcance === 'nacional').map(c => tarjetaConsulta(c, 'lumina')).join('')}</div>

  <div class="section-title" id="provincias"><h2>🗺️ Las 13 provincias de Niki</h2></div>
  <div class="photo-strip" style="--img:url(provincias.webp)"><span>Un país federal, conectado y sustentable</span></div>
  <p class="muted" style="margin:0 2px 10px">Tocá tu provincia en el mapa para ver sus localidades, sus nodos, las propuestas y los debates.</p>
  ${mapaNiki()}
  ${pie()}`;
};

function noticiaHTML(b, feat) {
  return `<button class="item ${feat ? 'news-feature open' : ''}" data-act="toggle">
    <div class="meta"><span class="news-cat">${esc(b.cat)}</span><span class="news-date">· ${b.d === 0 ? 'Hoy' : b.d === 1 ? 'Ayer' : fechaCorta(fechaEn(-b.d))}</span>${feat ? '<span class="badge orange">Destacado</span>' : ''}</div>
    <h3>${esc(b.ti)}</h3><div class="news-body">${esc(b.cu)}</div>
  </button>`;
}

let calSel = null;
function eventosDelMes() {
  const d = hoy(), ult = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const ev = EVENTOS_MES.map(e => ({ ...e, dia: Math.min(e.dia, ult) }));
  ev.push({ dia: d.getDate(), tipo: 'vivo', ti: 'Sesión en vivo del Nodo de Transportes y Comunicaciones', lugar: 'Todas las provincias · en Ágora' });
  return ev.sort((a, b) => a.dia - b.dia);
}
function calendarioHTML() {
  const d = hoy(), y = d.getFullYear(), m = d.getMonth(), primero = (new Date(y, m, 1).getDay() + 6) % 7, ult = new Date(y, m + 1, 0).getDate();
  const ev = eventosDelMes(), sel = calSel || d.getDate();
  const delDia = ev.filter(e => e.dia === sel), prox = ev.filter(e => e.dia >= d.getDate()).slice(0, 4);
  let celdas = '';
  for (let i = 0; i < primero; i++) celdas += '<div class="cal-day empty"></div>';
  for (let n = 1; n <= ult; n++) {
    const k = ev.filter(e => e.dia === n).length;
    celdas += `<button class="cal-day ${n === d.getDate() ? 'today' : ''} ${n === sel ? 'sel' : ''}" data-act="cal" data-dia="${n}" aria-label="${n}${k ? ', ' + k + ' eventos' : ''}">${n}${k ? `<span class="dots">${'<i></i>'.repeat(Math.min(k, 3))}</span>` : ''}</button>`;
  }
  const evHTML = e => `<div class="ev"><div class="d">${e.dia}<small>${new Date(y, m, e.dia).toLocaleDateString('es-AR', { weekday: 'short' }).replace('.', '')}</small></div><div><b>${esc(e.ti)}</b><div class="muted small">${esc(e.lugar)}</div></div></div>`;
  return `<div class="cal-head"><h3>${mayus(d.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }))}</h3><span class="muted small">Tocá un día</span></div>
    <div class="cal-grid">${['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(x => `<div class="dow">${x}</div>`).join('')}${celdas}</div>
    <div style="margin-top:12px"><b>${sel === d.getDate() ? 'Hoy' : `El ${sel}`}</b>
      ${delDia.length ? delDia.map(evHTML).join('') : '<p class="muted">No hay eventos ese día.</p>'}</div>
    <div style="margin-top:10px"><b>Próximos eventos</b>${prox.map(evHTML).join('')}</div>`;
}

V.boletin = () => `
  ${volver('#/', 'Inicio')}
  <div class="photo-strip" style="--img:url(boletin.webp)"><span>Boletín Oficial</span></div>
  <div class="section-title"><h2>📰 Boletín Oficial de Niki</h2></div>
  <p class="muted" style="margin:0 2px 10px">Comunicaciones de los órganos del Estado que la ciudadanía necesita conocer. Tocá cada aviso para leerlo completo.</p>
  <div class="card-list">${BOLETIN.map(b => noticiaHTML(b, b.destacado)).join('')}</div>
  <div class="section-title"><h2>📅 Calendario</h2></div>
  <div class="glass" id="cal">${calendarioHTML()}</div>
  ${pie()}`;

V.provincias = () => `
  ${volver('#/', 'Inicio')}
  <div class="photo-strip" style="--img:url(provincias.webp)"><span>República de Niki</span></div>
  <div class="section-title"><h2>🗺️ Elegí tu provincia</h2></div>
  <p class="muted" style="margin:0 2px 10px">Niki es un Estado federal con 13 provincias. Cada una organiza sus propios nodos y tiene su propia instancia de Elysia.</p>
  ${mapaNiki()}${pie()}`;

V.provincia = (pid) => {
  if (!PROV(pid)) return noEncontrado();
  const D = datosProv(pid), P = D.P;
  S.verProv = pid; guardar();
  const loc = S.locFiltro && P.localidades.includes(S.locFiltro) ? S.locFiltro : null;
  const props = propuestasDe(pid).filter(p => !loc || p.loc === loc).sort((a, b) => apoyosDe(b) - apoyosDe(a));
  const enVivo = NODOS.filter(N => D.info[N.id].vivo);
  const esMia = S.user && S.user.prov === pid;
  return `
  ${volver('#/provincias', 'Provincias')}
  <section class="banner" style="--c:${P.color}">
    <div class="small" style="opacity:.95">${esc(P.tipo || 'Provincia')} de la República de Niki</div>
    <h1>${esc(P.nombre)}</h1>
    <div>${esc(P.lema)}</div>
    <div class="kv"><span>🏛️ Capital: <b>${esc(P.capital)}</b></span><span>👥 ${num(P.poblacion)} hab.</span><span>📍 ${P.localidades.length} localidades</span></div>
  </section>
  ${esMia ? `<div class="glass tight">✅ Participás como vecino/a de <b>${esc(S.user.loc)}</b>.</div>` :
    `<div class="glass tight"><div class="row"><div class="grow small">${S.user ? `Tu provincia es <b>${esc(PROV(S.user.prov).nombre)}</b>. Acá podés mirar, pero solo participás en tu provincia.` : '¿Vivís acá? Registrate (ficticio) para proponer, apoyar y debatir.'}</div>
    ${S.user ? `<a class="btn small ghost" href="#/provincia/${S.user.prov}">Ir a la mía</a>` : `<button class="btn small" data-act="registro" data-prov="${pid}">Participar</button>`}</div></div>`}

  <div class="section-title"><h2>📍 Localidades</h2></div>
  <div class="chips">
    <button class="chip ${!loc ? 'on' : ''}" data-act="loc" data-loc="">Todas</button>
    ${P.localidades.map(l => `<button class="chip ${loc === l ? 'on' : ''}" data-act="loc" data-loc="${esc(l)}">${esc(l)}</button>`).join('')}
  </div>

  <div class="section-title"><h2>🔷 Nodos de ${esc(P.nombre)}</h2></div>
  <div class="glass"><div class="nodo-grid">${NODOS.map(N => `<a class="nodo-tile" href="#/provincia/${pid}/nodo/${N.id}/info"><div class="orb" style="--c:${N.color}">${N.icono}</div>${esc(N.nombre)}</a>`).join('')}</div></div>

  ${enVivo.length ? `<div class="section-title"><h2>🔴 En vivo ahora</h2></div>
  <div class="card-list">${enVivo.slice(0, 3).map(N => `<a class="item" href="#/provincia/${pid}/nodo/${N.id}/vivo"><div class="row"><div class="orb sm" style="--c:${N.color}">${N.icono}</div><div class="grow"><b>Sesión abierta · Nodo de ${esc(N.nombre)}</b><div class="muted small">👁 ${num(D.info[N.id].espectadores)} mirando</div></div><span class="badge red">EN VIVO</span></div></a>`).join('')}</div>` : ''}

  <div class="section-title"><h2>💡 Iniciativas ${loc ? 'en ' + esc(loc) : 'más apoyadas'}</h2><a href="#/iniciativas/${pid}">Ver todas</a></div>
  <div class="card-list">${props.slice(0, 4).map(tarjetaPropuesta).join('') || '<p class="empty-note">Todavía no hay iniciativas en esta localidad.</p>'}</div>
  ${esMia || !S.user ? `<div class="btn-row"><button class="btn green block" data-act="nueva" data-prov="${pid}">＋ Presentar una iniciativa</button></div>` : ''}
  ${pie()}`;
};

V.nodo = (pid, nid, tab = 'info') => {
  if (!PROV(pid) || !NODO(nid)) return noEncontrado();
  const D = datosProv(pid), P = D.P, N = NODO(nid);
  const I = D.info[nid], base = `#/provincia/${pid}/nodo/${nid}`;
  const tabs = [['info', 'Información'], ['propuestas', 'Propuestas'], ['debates', 'Debates'], ['vivo', 'En vivo'], ['tendencias', 'Tendencias']];
  let cuerpo = '';
  if (tab === 'info') {
    cuerpo = `
    <div class="glass">
      <h3>🏛️ Parte legislativa</h3><p>Encabezada por el ministro <b>${esc(I.ministro)}</b>. Crea las leyes de ${esc(N.nombre.toLowerCase())} de ${esc(P.nombre)}, que se guardan en su carpeta de Evanescence.</p>
      <h3 style="margin-top:12px">⚙️ Parte ejecutiva</h3><p>A cargo de la viceministra o viceministro <b>${esc(I.vice)}</b>. Aplica las leyes y lleva adelante las políticas públicas del área.</p>
      <div class="kpis"><div><b>N$ ${num(Math.round(I.presupuesto / 1e6))} M</b><span>Presupuesto</span></div><div><b>${I.detecciones}</b><span>Detecciones de Elysia</span></div><div><b>90 días</b><span>Plazo para tratarlas</span></div></div>
    </div>
    <div class="glass"><h3>📂 Leyes vigentes (carpeta en Evanescence)</h3>
      <ul class="list-check">${LEYES_MODELO[nid].map(l => `<li>${esc(l)} de ${esc(P.nombre)}</li>`).join('')}</ul>
      <p class="muted small">Las leyes de los nodos están por debajo de Evanescence y de los códigos generales.</p></div>
    <div class="glass"><h3>🏷️ Temas de este nodo</h3><div class="chips" style="flex-wrap:wrap">${N.temas.map(t => `<a class="chip" href="${base}/propuestas?tema=${encodeURIComponent(t.n)}">${esc(t.n)}</a>`).join('')}</div>
      <p class="muted small">Cada reclamo, idea o debate se ordena por tema. Por ejemplo, una queja sobre trenes va a Transportes › Trenes.</p></div>`;
  } else if (tab === 'propuestas') {
    const tema = new URLSearchParams(location.hash.split('?')[1] || '').get('tema');
    const lista = propuestasDe(pid).filter(p => p.nodo === nid && (!tema || p.tema === tema)).sort((a, b) => apoyosDe(b) - apoyosDe(a));
    cuerpo = `<div class="chips"><a class="chip ${!tema ? 'on' : ''}" href="${base}/propuestas">Todos</a>${N.temas.map(t => `<a class="chip ${tema === t.n ? 'on' : ''}" href="${base}/propuestas?tema=${encodeURIComponent(t.n)}">${esc(t.n)}</a>`).join('')}</div>
      <div class="card-list">${lista.map(tarjetaPropuesta).join('') || '<p class="empty-note">No hay iniciativas en este tema todavía.</p>'}</div>
      <div class="btn-row"><button class="btn green block" data-act="nueva" data-prov="${pid}" data-nodo="${nid}">＋ Presentar una iniciativa</button></div>`;
  } else if (tab === 'debates') {
    const lista = debatesDe(pid).filter(d => d.nodo === nid);
    cuerpo = `<p class="muted" style="margin:0 2px 8px">Críticas, ideas, mejoras y preguntas sobre la gestión del nodo. Elysia no modera los debates.</p>
      <div class="card-list">${lista.map(tarjetaDebate).join('')}</div>
      <div class="btn-row"><button class="btn block" data-act="nuevo-debate" data-prov="${pid}" data-nodo="${nid}">＋ Abrir un debate</button></div>`;
  } else if (tab === 'vivo') {
    cuerpo = `
      <div class="stream"><span class="live">EN VIVO</span><span class="viewers">👁 <span id="viewers">${num(I.espectadores)}</span></span>
        <div class="podium"><i></i><i></i><i></i></div>
        <div class="caption"><b>Sesión abierta del Nodo de ${esc(N.nombre)} · ${esc(P.nombre)}</b><br>Tema: ${esc(N.temas[0].n)} y respuestas a las iniciativas con más apoyos</div></div>
      <p class="muted small" style="margin:8px 2px">Transmisión simulada. Las sesiones reales también se pueden seguir en los puntos de atención presencial de cada municipio.</p>
      <div class="glass tight"><b>💬 Chat de la sesión</b><div class="chat" id="chat"></div>
        <form class="inline-form" data-form="chat"><input class="in" name="t" maxlength="200" placeholder="${S.user ? 'Escribí tu comentario…' : 'Registrate para comentar'}" ${S.user ? '' : 'disabled'} aria-label="Comentario">
        <button class="btn small" ${S.user ? '' : 'disabled'}>Enviar</button></form></div>`;
  } else if (tab === 'tendencias') {
    const T = D.tend[nid], temas = N.temas.map((t, i) => ({ l: t.n.length > 13 ? t.n.slice(0, 12) + '…' : t.n, v: Math.round((T.criticas + T.ideas + T.mejoras) * (0.35 + rng(pid + nid + i)() * 0.65)), c: N.color }));
    cuerpo = `
      <div class="glass"><h3>Actividad ciudadana · últimos 12 meses</h3><p class="muted small">Propuestas, comentarios y apoyos en el Nodo de ${esc(N.nombre)} de ${esc(P.nombre)}.</p>${linea(T.serie, N.color)}</div>
      <div class="glass"><h3>Tipo de participación</h3>${barrasApiladas([{ l: CORTO[nid], p: [T.criticas, T.ideas, T.mejoras] }])}
        <div class="kpis"><div><b>${num(T.criticas)}</b><span>Críticas</span></div><div><b>${num(T.ideas)}</b><span>Ideas</span></div><div><b>${num(T.mejoras)}</b><span>Mejoras</span></div></div></div>
      <div class="glass"><h3>Temas más mencionados</h3>${barrasH(temas)}</div>`;
  }
  return `
  ${volver('#/provincia/' + pid, P.nombre)}
  <section class="banner" style="--c:${N.color}"><div class="row"><div class="orb lg" style="--c:${N.color}">${N.icono}</div>
    <div class="grow"><div class="small">Nodo · ${esc(P.nombre)}</div><h1 style="font-size:22px">${esc(N.nombre)}</h1>${I.vivo ? '<span class="badge red">● EN VIVO</span>' : ''}</div></div></section>
  <nav class="tabs">${tabs.map(([k, l]) => `<a class="${k === tab ? 'on' : ''}" href="${base}/${k}">${l}</a>`).join('')}</nav>
  ${cuerpo}${pie()}`;
};

V.propuesta = (id) => {
  const p = buscarPropuesta(id); if (!p) return noEncontrado();
  const N = NODO(p.nodo), P = PROV(p.prov), a = apoyosDe(p), f = Math.min(100, a / p.umbral * 100);
  const puedo = S.user && S.user.prov === p.prov, coms = S.coms[p.id] || [];
  const r = rng('imp' + p.id), costo = Math.round((2 + r() * 40) * 10) / 10, benef = Math.round(P.poblacion * (0.02 + r() * 0.2));
  return `
  ${volver(`#/provincia/${p.prov}/nodo/${p.nodo}/propuestas`, 'Nodo de ' + N.nombre)}
  <article class="glass">
    <div class="meta" style="display:flex;gap:6px;flex-wrap:wrap"><span class="badge" style="background:${N.color}">${N.icono} ${esc(N.nombre)}</span><span class="badge outline">${esc(p.tema)}</span></div>
    <h2 style="margin:10px 0 6px;color:#06606f">${esc(p.titulo)}</h2>
    <div class="muted small">📍 ${esc(p.loc)}, ${esc(P.nombre)} · Iniciativa de ${esc(p.autor)} · ${hace(p.dias)}</div>
    <p style="margin-top:12px">${esc(p.cuerpo)}</p>
    <div class="progress ${f >= 100 ? '' : 'turq'}" style="margin-top:14px"><i style="width:${f}%"></i></div>
    <p class="small"><b>${num(a)}</b> apoyos de <b>${num(p.umbral)}</b> necesarios (0,5 % de la población de ${esc(P.nombre)}). ${f >= 100 ? 'Superó el umbral: el nodo debe tratarla.' : ''}</p>
    <div class="btn-row">
      ${puedo ? `<button class="btn ${S.apoyos[p.id] ? 'ghost' : 'green'}" data-act="apoyar" data-id="${p.id}">${S.apoyos[p.id] ? '✔ Apoyaste · quitar' : '👍 Apoyar'}</button>` :
        S.user ? `<span class="muted small">Solo pueden apoyar quienes viven en ${esc(P.nombre)}.</span>` : `<button class="btn green" data-act="registro" data-prov="${p.prov}">👍 Registrarme para apoyar</button>`}
      <button class="btn ghost" data-act="compartir">Compartir</button>
    </div>
  </article>
  <div class="glass tight"><div class="row"><div class="orb sm" style="--c:#8a5cd6">✨</div><div class="grow"><b>Informe de impacto de Elysia</b> <span class="badge gray">No vinculante</span>
    <div class="small">Costo estimado: <b>N$ ${String(costo).replace('.', ',')} M</b> · Personas alcanzadas: <b>${num(benef)}</b>. El informe orienta, pero la decisión es del nodo y de la ciudadanía.</div></div></div></div>
  <div class="glass"><h3>💬 Comentarios (${coms.length})</h3>
    ${coms.map(comentarioHTML).join('') || '<p class="muted">Todavía no hay comentarios. ¡Sé la primera persona en opinar!</p>'}
    ${puedo ? `<form class="inline-form" data-form="com" data-id="${p.id}"><input class="in" name="t" maxlength="400" placeholder="Escribí un comentario" aria-label="Comentario"><button class="btn small">Enviar</button></form>` : ''}
  </div>${pie()}`;
};

V.debate = (id) => {
  const d = buscarDebate(id); if (!d) return noEncontrado();
  const N = NODO(d.nodo), P = PROV(d.prov), puedo = S.user && S.user.prov === d.prov;
  const coms = d.coms.concat(S.coms[d.id] || []);
  return `
  ${volver(`#/provincia/${d.prov}/nodo/${d.nodo}/debates`, 'Debates de ' + N.nombre)}
  <article class="glass">
    <div class="meta" style="display:flex;gap:6px;flex-wrap:wrap"><span class="badge ${TIPO_COLOR[d.tipo]}">${esc(d.tipo)}</span><span class="badge" style="background:${N.color}">${N.icono} ${esc(CORTO[N.id])}</span><span class="badge outline">${esc(d.tema)}</span></div>
    <h2 style="margin:10px 0 6px;color:#06606f">${esc(d.titulo)}</h2>
    <div class="muted small">📍 ${esc(d.loc)}, ${esc(P.nombre)} · ${esc(d.autor)} · ${hace(d.dias)}</div>
    <p style="margin-top:10px">${esc(d.texto)}</p>
  </article>
  <div class="glass"><h3>Respuestas (${coms.length})</h3>${coms.map(comentarioHTML).join('')}
    ${puedo ? `<form class="inline-form" data-form="com" data-id="${d.id}"><input class="in" name="t" maxlength="400" placeholder="Sumá tu opinión" aria-label="Respuesta"><button class="btn small">Responder</button></form>` :
      `<p class="muted small">${S.user ? `Solo participan vecinos de ${esc(P.nombre)}.` : 'Registrate para responder.'}</p>`}
  </div>${pie()}`;
};

V.iniciativas = (pid) => {
  pid = PROV(pid) ? pid : (S.user?.prov || S.verProv || 'lumina');
  const P = PROV(pid), q = new URLSearchParams(location.hash.split('?')[1] || ''), nodo = q.get('nodo') || '', orden = q.get('orden') || 'apoyos';
  const lista = propuestasDe(pid).filter(p => !nodo || p.nodo === nodo).sort((a, b) => orden === 'recientes' ? a.dias - b.dias : apoyosDe(b) - apoyosDe(a));
  return `
  <div class="section-title"><h2>💡 Iniciativas populares</h2></div>
  <p class="muted" style="margin:0 2px 8px">Cualquier vecino puede presentar una iniciativa. Si junta apoyos del 0,5 % de la población de su provincia, el nodo competente debe tratarla.</p>
  <div class="chips">${PROVINCIAS.map(p => `<a class="chip ${p.id === pid ? 'on' : ''}" href="#/iniciativas/${p.id}">${esc(p.nombre)}</a>`).join('')}</div>
  <div class="glass tight"><div class="row">
    <select class="in" data-act="filtro-nodo" aria-label="Filtrar por nodo"><option value="">Todos los nodos</option>${NODOS.map(N => `<option value="${N.id}" ${nodo === N.id ? 'selected' : ''}>${N.icono} ${esc(N.nombre)}</option>`).join('')}</select>
    <select class="in" data-act="orden" aria-label="Ordenar" style="max-width:140px"><option value="apoyos">Más apoyadas</option><option value="recientes" ${orden === 'recientes' ? 'selected' : ''}>Recientes</option></select>
  </div></div>
  <div class="btn-row" style="margin-bottom:10px"><button class="btn green block" data-act="nueva" data-prov="${pid}" data-nodo="${nodo}">＋ Presentar una iniciativa</button></div>
  <div class="card-list">${lista.map(tarjetaPropuesta).join('')}</div>
  <p class="muted small" style="text-align:center">${lista.length} iniciativas en ${esc(P.nombre)}</p>${pie()}`;
};

V.nueva = () => {
  if (!S.user) { setTimeout(() => abrirRegistro(), 0); return `${volver('#/')}<div class="glass empty-note">Para presentar una iniciativa primero tenés que registrarte (registro ficticio de la demo).</div>`; }
  const q = new URLSearchParams(location.hash.split('?')[1] || ''), nodo = q.get('nodo') || '', P = PROV(S.user.prov);
  return `
  ${volver(history.length > 1 ? 'javascript:history.back()' : '#/', 'Volver')}
  <div class="section-title"><h2>＋ Nueva iniciativa popular</h2></div>
  <form class="glass" data-form="nueva">
    <p class="muted small" style="margin-top:0">La presentás como vecino/a de <b>${esc(S.user.loc)}, ${esc(P.nombre)}</b>.</p>
    <label class="f" for="ti">Título</label><input class="in" id="ti" name="titulo" maxlength="90" required placeholder="Ej.: Más frecuencias del tren a la mañana">
    <label class="f" for="cu">¿Qué proponés y por qué?</label><textarea class="in" id="cu" name="cuerpo" maxlength="1200" required placeholder="Contá el problema y tu propuesta. Ej.: el tren llega tarde todos los días…"></textarea>
    <div class="elysia-hint" id="hint"></div>
    <label class="f" for="no">Nodo</label><select class="in" id="no" name="nodo" required><option value="">Elegí un nodo</option>${NODOS.map(N => `<option value="${N.id}" ${nodo === N.id ? 'selected' : ''}>${N.icono} ${esc(N.nombre)}</option>`).join('')}</select>
    <label class="f" for="te">Tema</label><select class="in" id="te" name="tema" required>${opcionesTema(nodo)}</select>
    <label class="f" for="lo">Localidad</label><select class="in" id="lo" name="loc">${P.localidades.map(l => `<option ${l === S.user.loc ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>
    <div class="btn-row"><button class="btn green block">Publicar iniciativa</button></div>
    <p class="muted small">Elysia solo sugiere a qué nodo corresponde. La decisión de dónde publicarla es tuya.</p>
  </form>${pie()}`;
};
function opcionesTema(nid, sel) { const N = NODO(nid); return N ? N.temas.map(t => `<option ${t.n === sel ? 'selected' : ''}>${esc(t.n)}</option>`).join('') : '<option value="">Primero elegí un nodo</option>'; }

/* Consultas */
function opcionesConsulta(c, pid) { return c.opciones === '{localidades}' ? PROV(pid).localidades : c.opciones; }
function resultadosBase(c, pid) {
  if (c.base) return c.base;
  const r = rng(c.id + pid), raw = opcionesConsulta(c, pid).map(() => 10 + r() * 40), t = raw.reduce((a, b) => a + b, 0);
  return raw.map(v => v / t * 100);
}
const fillProv = (s, pid) => s.replaceAll('{prov}', PROV(pid).nombre);
function estadoConsulta(c) {
  return c.estado === 'deliberacion' ? '<span class="badge purple">En deliberación</span>' : c.estado === 'votacion' ? '<span class="badge green">Votación abierta</span>' : '<span class="badge gray">Cerrada</span>';
}
function tarjetaConsulta(c, pid) {
  const cierre = fechaEn(c.diasCierre);
  return `<a class="item" href="#/consulta/${c.id}/${pid}">
    <div class="meta">${estadoConsulta(c)}<span class="badge ${c.vinculante ? 'orange' : 'outline'}">${c.vinculante ? 'Vinculante' : 'No vinculante'}</span><span class="badge outline">${c.alcance === 'nacional' ? 'Nacional' : esc(PROV(pid).nombre)}</span></div>
    <h3>${esc(fillProv(c.pregunta, pid))}</h3>
    <div class="muted small">Convoca: ${esc(fillProv(c.convoca, pid))} · ${c.diasCierre >= 0 ? (c.estado === 'deliberacion' ? 'deliberación hasta el ' : 'cierra el ') + fechaCorta(cierre) : 'cerró el ' + fechaCorta(cierre)}</div>
  </a>`;
}
V.consultas = (pid) => {
  pid = PROV(pid) ? pid : (S.user?.prov || S.verProv || 'lumina');
  return `
  <div class="photo-strip" style="--img:url(perfil.webp)"><span>Tu voz decide</span></div>
  <div class="section-title"><h2>🗳️ Consultas populares</h2></div>
  <div class="glass tight small">✨ <b>Elysia publica las consultas</b> y da soporte técnico, pero las preguntas las redacta el órgano que convoca. Antes de votar hay un período de deliberación con fuentes plurales.</div>
  <h3 style="margin:16px 2px 8px">Nacionales</h3>
  <div class="card-list">${CONSULTAS_MODELO.filter(c => c.alcance === 'nacional').map(c => tarjetaConsulta(c, pid)).join('')}</div>
  <h3 style="margin:18px 2px 8px">Provinciales</h3>
  <div class="chips">${PROVINCIAS.map(p => `<a class="chip ${p.id === pid ? 'on' : ''}" href="#/consultas/${p.id}">${esc(p.nombre)}</a>`).join('')}</div>
  <div class="card-list">${CONSULTAS_MODELO.filter(c => c.alcance === 'provincial').map(c => tarjetaConsulta(c, pid)).join('')}</div>
  ${pie()}`;
};
V.consulta = (cid, pid) => {
  const c = CONSULTAS_MODELO.find(x => x.id === cid); if (!c || !PROV(pid)) return noEncontrado();
  const ops = opcionesConsulta(c, pid), base = resultadosBase(c, pid), key = `${cid}:${c.alcance === 'nacional' ? 'nac' : pid}`, mio = S.votos[key];
  const habilitado = S.user && (c.alcance === 'nacional' || S.user.prov === pid);
  const padron = c.alcance === 'nacional' ? PROVINCIAS.reduce((a, p) => a + p.poblacion, 0) * 0.74 : PROV(pid).poblacion * 0.74;
  const particip = Math.round(padron * (0.28 + rng(key)() * 0.3));
  const res = `<h3>${c.estado === 'cerrada' ? 'Resultado final' : 'Resultados parciales simulados'}</h3>
    ${ops.map((o, i) => `<div class="result"><div class="lbl"><span>${esc(o)} ${mio === i ? '· <span class="badge green">Tu voto</span>' : ''}</span><span>${pct(base[i])}</span></div><div class="progress ${i === base.indexOf(Math.max(...base)) ? '' : 'turq'}"><i style="width:${base[i]}%"></i></div></div>`).join('')}
    <p class="muted small">Participación simulada: ${num(particip)} personas (${pct(particip / padron * 100)} del padrón).</p>`;
  let accion = '';
  if (c.estado === 'deliberacion') accion = `<div class="glass"><h3>🗣️ Período de deliberación</h3><p>La votación abre cuando termina la deliberación, el <b>${fechaCorta(fechaEn(c.diasCierre))}</b>. Mientras tanto podés leer las fuentes y opinar en el foro del Nodo de ${esc(NODO(c.nodo).nombre)}.</p>
    <a class="btn ghost" href="#/provincia/${S.user?.prov || pid}/nodo/${c.nodo}/debates">Ir al foro del nodo</a></div>`;
  else if (c.estado === 'votacion' && mio === undefined) accion = `<form class="glass" data-form="votar" data-key="${key}"><h3>Tu voto</h3>
    ${ops.map((o, i) => `<label class="opt"><input type="radio" name="op" value="${i}" ${habilitado ? '' : 'disabled'}> ${esc(o)}</label>`).join('')}
    ${habilitado ? '<button class="btn green block">Votar (simulación)</button>' : S.user ? `<p class="muted small">Esta consulta es solo para vecinos de ${esc(PROV(pid).nombre)}.</p>` : `<button type="button" class="btn green block" data-act="registro" data-prov="${pid}">Registrarme para votar</button>`}
    <p class="muted small">Voto ficticio guardado solo en este dispositivo. No es un sistema de votación real ni seguro.</p></form>`;
  else accion = `<div class="glass">${res}</div>`;
  return `
  ${volver('#/consultas/' + pid, 'Consultas')}
  <article class="glass">
    <div class="meta" style="display:flex;gap:6px;flex-wrap:wrap">${estadoConsulta(c)}<span class="badge ${c.vinculante ? 'orange' : 'outline'}">${c.vinculante ? 'Vinculante' : 'No vinculante'}</span><span class="badge outline">${c.alcance === 'nacional' ? 'Nacional' : esc(PROV(pid).nombre)}</span></div>
    <h2 style="margin:10px 0;color:#06606f">${esc(fillProv(c.pregunta, pid))}</h2>
    <p class="small"><b>Convoca y redacta:</b> ${esc(fillProv(c.convoca, pid))}<br><b>Publica:</b> Elysia (soporte técnico)<br>
    ${c.vinculante ? '✅ <b>Vinculante:</b> el resultado obliga a los órganos, siempre que no afecte derechos fundamentales (lo controla el Tribunal Superior).' : 'ℹ️ <b>No vinculante:</b> orienta la decisión del órgano, pero no lo obliga.'}</p>
  </article>
  <div class="glass"><h3>📚 Fuentes plurales</h3><ul class="list-check">${c.fuentes.map(f => `<li>${esc(f)}</li>`).join('')}</ul></div>
  ${accion}${pie()}`;
};

/* Elysia */
V.elysia = () => `
  <section class="glass hero photo-bg" style="padding-top:20px;--img:url(elysia.webp)">
    <div class="orb lg" style="--c:#8a5cd6;margin:0 auto">✨</div>
    <h1 style="font-size:26px">Elysia</h1>
    <p class="sub">Sistema público de coordinación y procesamiento de información de la República de Niki. Su orientación surge del Perfil Programático que vota la ciudadanía.</p>
    <span class="badge purple">Perfil vigente: ${esc(MANDATO.programa)}</span>
  </section>
  ${DEMO}
  <div class="glass">
    <img class="deco-sphere" src="esfera.webp" alt="">
    <h3>⏱️ Tiempo de mandato cumplido</h3>
    <p class="muted small" style="margin:0">Cuenta progresiva desde el ${fechaLarga(MANDATO.inicio)}</p>
    ${contadorHTML('lleva')}
    <h3 style="margin-top:14px">⏳ Tiempo que le queda</h3>
    <p class="muted small" style="margin:0">Hasta la próxima elección del Perfil Programático, el ${fechaLarga(MANDATO.fin)}</p>
    ${contadorHTML('resta')}
    <div class="progress orange" style="margin-top:12px"><i data-avance style="width:${avanceMandato()}%"></i></div>
    <p class="small" style="text-align:center;margin-top:6px">Mandato cumplido: <b data-avance-txt>${avanceMandato().toFixed(4).replace('.', ',')} %</b> de 4 años</p>
  </div>
  <div class="glass"><h3>🛠️ Cómo se crea Elysia</h3>
    <ol class="steps">
      <li><b>La ciudadanía aprueba el Módulo Tecnológico</b> de Evanescence, que fija qué puede y qué no puede hacer.</li>
      <li><b>La construye un consorcio público</b> de universidades públicas y un instituto técnico estatal, con código abierto. Ninguna empresa puede desarrollar su núcleo.</li>
      <li><b>Funciona un período de prueba</b> sin efectos reales.</li>
      <li><b>Se activa</b> con dos tercios del Plenario de Nodos, el acuerdo del Consejo Federal y un referendo.</li>
      <li><b>Cada 4 años se elige su personalidad</b> con el voto del Perfil Programático.</li>
    </ol></div>
  <div class="glass"><h3>🗳️ Cómo se elige su personalidad</h3>
    <p>Partidos y agrupaciones presentan programas de gobierno. Elysia publica un análisis comparativo neutral, auditado por Prisma, y la ciudadanía vota en secreto. Si ningún programa logra un apoyo amplio, hay segunda vuelta. El programa ganador fija sus prioridades durante 4 años; sus valores están fijados en Evanescence.</p>
    <a class="btn" href="#/perfil">Simular la elección del Perfil Programático</a></div>
  <div class="glass"><h3>✅ Qué hace</h3><ul class="list-check">
    <li>Detecta problemas y vacíos normativos (el nodo tiene 90 días para tratarlos).</li><li>Elabora informes de impacto no vinculantes.</li>
    <li>Coordina a los nodos y da soporte técnico a las consultas.</li><li>Publica sus fuentes y criterios.</li></ul>
    <h3 style="margin-top:12px">⛔ Qué no puede hacer</h3><ul class="list-check no">
    <li>Decidir sin la firma de una persona responsable.</li><li>Usar la fuerza, manejar fondos o armas.</li><li>Hacer propaganda o enviar mensajes políticos personalizados.</li>
    <li>Moderar los debates entre ciudadanos.</li><li>Modificar su propio código: hacen falta 3 de 4 custodios (Prisma, Tribunal Superior, Consejo Federal y un comité de universidades).</li></ul></div>
  ${pie()}`;

/* Perfil Programático */
V.perfil = () => {
  const pf = S.perfil, r1 = [27.4, 22.1, 33.6, 16.9];
  const top = PROGRAMAS.map((p, i) => ({ p, v: r1[i] })).sort((a, b) => b.v - a.v), finalistas = [top[0].p, top[1].p];
  const filaCmp = N => `<tr><td>${N.icono} ${esc(CORTO[N.id])}</td><td><div class="bars">${PROGRAMAS.map(p => `<i style="width:${p.prioridades[N.id]}%;background:${p.color}" title="${esc(p.nombre)}: ${p.prioridades[N.id]}"></i>`).join('')}</div></td></tr>`;
  let paso = '';
  if (!pf.r1) paso = `<form class="glass" data-form="perfil1"><h3>3. Tu voto · primera vuelta</h3>
      ${PROGRAMAS.map(p => `<label class="opt"><input type="radio" name="op" value="${p.id}"> <span><span style="color:${p.color}">●</span> ${esc(p.nombre)} <span class="muted small">· ${esc(p.agrupacion)}</span></span></label>`).join('')}
      <button class="btn green block">Votar (simulación)</button></form>`;
  else {
    paso = `<div class="glass"><h3>Resultado simulado · primera vuelta</h3>
      ${PROGRAMAS.map((p, i) => `<div class="result"><div class="lbl"><span>${esc(p.nombre)} ${pf.r1 === p.id ? '<span class="badge green">Tu voto</span>' : ''}</span><span>${String(r1[i]).replace('.', ',')} %</span></div><div class="progress"><i style="width:${r1[i]}%;background:${p.color}"></i></div></div>`).join('')}
      <p class="small">Ningún programa superó el 50 %: hay <b>segunda vuelta</b> entre <b>${esc(finalistas[0].nombre)}</b> y <b>${esc(finalistas[1].nombre)}</b>.</p></div>`;
    if (!pf.r2) paso += `<form class="glass" data-form="perfil2"><h3>4. Segunda vuelta</h3>
      ${finalistas.map(p => `<label class="opt"><input type="radio" name="op" value="${p.id}"> <span style="color:${p.color}">●</span> ${esc(p.nombre)}</label>`).join('')}
      <button class="btn green block">Votar en la segunda vuelta</button></form>`;
    else {
      const r2 = { [finalistas[0].id]: 54.3, [finalistas[1].id]: 45.7 };
      paso += `<div class="glass"><h3>🏆 Resultado simulado · segunda vuelta</h3>
        ${finalistas.map(p => `<div class="result"><div class="lbl"><span>${esc(p.nombre)} ${pf.r2 === p.id ? '<span class="badge green">Tu voto</span>' : ''}</span><span>${String(r2[p.id]).replace('.', ',')} %</span></div><div class="progress"><i style="width:${r2[p.id]}%;background:${p.color}"></i></div></div>`).join('')}
        <p><b>${esc(finalistas[0].nombre)}</b> fija las prioridades de Elysia por los próximos 4 años. Prisma audita el escrutinio y publica su informe.</p>
        <button class="btn ghost" data-act="reset-perfil">Repetir la simulación</button></div>`;
    }
  }
  return `
  ${volver('#/elysia', 'Elysia')}
  <div class="photo-strip" style="--img:url(perfil.webp)"><span>Cada 4 años elegimos el rumbo de Elysia</span></div>
  <div class="section-title"><h2>🗳️ Elección del Perfil Programático</h2></div>
  ${DEMO}
  <p class="muted" style="margin:0 2px">Cada 4 años la ciudadanía elige el programa que define las prioridades de Elysia. Próxima elección: <b>${fechaCorta(MANDATO.fin)} ${MANDATO.fin.getFullYear()}</b>.</p>
  <h3 style="margin:16px 2px 8px">1. Los programas</h3>
  <div class="card-list">${PROGRAMAS.map(p => { const tops = Object.entries(p.prioridades).sort((a, b) => b[1] - a[1]).slice(0, 3);
    return `<div class="item" style="border-left:5px solid ${p.color}"><h3>${esc(p.nombre)}</h3><div class="muted small">${esc(p.agrupacion)}</div><p>«${esc(p.lema)}»</p>
    <div class="meta">${tops.map(([n]) => `<span class="badge" style="background:${NODO(n).color}">${NODO(n).icono} ${esc(CORTO[n])}</span>`).join('')}</div></div>`; }).join('')}</div>
  <div class="glass"><h3>2. Análisis comparativo de Elysia</h3>
    <p class="muted small" style="margin-top:0">Peso que cada programa le da a cada nodo (0 a 100). <span class="badge purple">Auditado por Prisma</span></p>
    <table class="cmp"><tbody>${NODOS.map(filaCmp).join('')}</tbody></table>
    <div class="legend">${PROGRAMAS.map(p => `<span><i style="background:${p.color}"></i>${esc(p.nombre)}</span>`).join('')}</div></div>
  ${paso}${pie()}`;
};

/* Tendencias */
V.tendencias = (pid) => {
  const nac = !PROV(pid);
  const datos = NODOS.map(N => {
    const provs = nac ? PROVINCIAS.map(p => p.id) : [pid];
    const t = provs.map(x => datosProv(x).tend[N.id]);
    return { N, crit: t.reduce((a, x) => a + x.criticas, 0), ideas: t.reduce((a, x) => a + x.ideas, 0), mej: t.reduce((a, x) => a + x.mejoras, 0),
      serie: Array.from({ length: 12 }, (_, i) => t.reduce((a, x) => a + x.serie[i], 0)) };
  });
  const total = Array.from({ length: 12 }, (_, i) => datos.reduce((a, d) => a + d.serie[i], 0));
  return `
  <div class="section-title"><h2>📈 Tendencias ciudadanas</h2></div>
  <div class="chips"><a class="chip ${nac ? 'on' : ''}" href="#/tendencias">Todo el país</a>${PROVINCIAS.map(p => `<a class="chip ${p.id === pid ? 'on' : ''}" href="#/tendencias/${p.id}">${esc(p.nombre)}</a>`).join('')}</div>
  <div class="glass"><h3>Participación por nodo</h3><p class="muted small" style="margin-top:0">Críticas, ideas y mejoras publicadas en el último año${nac ? '' : ' en ' + esc(PROV(pid).nombre)}.</p>
    ${barrasH(datos.map(d => ({ l: CORTO[d.N.id], v: d.crit + d.ideas + d.mej, c: d.N.color })).sort((a, b) => b.v - a.v))}</div>
  <div class="glass"><h3>¿Qué tipo de participación hay en cada nodo?</h3>${barrasApiladas(datos.map(d => ({ l: CORTO[d.N.id], p: [d.crit, d.ideas, d.mej] })))}</div>
  <div class="glass"><h3>Actividad total · últimos 12 meses</h3>${linea(total, '#14b8c4')}</div>
  <p class="muted small" style="text-align:center">Datos simulados con fines educativos. Elysia publica estas tendencias, pero no las usa para enviar mensajes personalizados.</p>${pie()}`;
};

V.prisma = () => {
  const r = rng('bitacora');
  const acciones = ['Auditó el informe de impacto sobre la Ley de Transporte Nocturno', 'Revisó las detecciones de Elysia en Piastri', 'Publicó el análisis de sesgos de clasificación', 'Verificó la firma de 3 custodios en una actualización de Elysia', 'Auditó el escrutinio de la consulta sobre bibliotecas', 'Recibió 12 temas propuestos por el panel ciudadano'];
  return `
  <section class="glass hero photo-bg" style="padding-top:20px;--img:url(prisma.webp)"><div class="orb lg" style="--c:#6a3fb8;margin:0 auto">🔷</div><h1 style="font-size:26px">Prisma</h1>
    <p class="sub">Órgano independiente de auditoría. Regula y audita Ágora, las cuentas públicas, el cumplimiento de las leyes por parte de los nodos y el funcionamiento de Elysia.</p></section>
  <div class="glass"><h3>👥 Composición</h3><ul class="list-check">
    <li>9 auditores con mandato único de 6 años: 3 por concurso técnico, 3 propuestos por la oposición y 3 por el Consejo Federal.</li>
    <li>La presidencia corresponde a la oposición, para que el controlado no elija a su controlador.</li>
    <li>Un panel de 30 ciudadanos sorteados propone temas para auditar.</li></ul></div>
  <div class="glass"><h3>📜 Reglas de Ágora</h3><ul class="list-check">
    <li>Elysia no modera los debates ni envía mensajes políticos personalizados.</li>
    <li>Toda decisión apoyada en Elysia se puede revisar ante una persona.</li>
    <li>Cada municipio tiene puntos de atención presencial para quien no usa internet.</li>
    <li>Se prohíbe el perfilamiento político individual de los usuarios.</li>
    <li>Los reportes de contenido los revisan moderadores humanos, bajo control de Prisma.</li></ul></div>
  <div class="glass"><h3>📒 Bitácora pública</h3>${acciones.map((a, i) => `<div class="ev"><div class="d">${fechaEn(-(i * 3 + Math.floor(r() * 3))).getDate()}<small>${fechaEn(-(i * 3)).toLocaleDateString('es-AR', { month: 'short' }).replace('.', '')}</small></div><div>${esc(a)}</div></div>`).join('')}</div>
  ${pie()}`;
};

V.acerca = () => `
  <div class="photo-strip" style="--img:url(acerca.webp)"><span>Hecho con nostalgia de los 2000</span></div>
  <div class="section-title"><h2>ℹ️ Sobre esta demo</h2></div>
  <div class="glass">
    <p><b>Ágora</b> es una demostración educativa creada para un trabajo práctico sobre formas de gobierno. Muestra cómo podría funcionar la participación ciudadana en la <b>Lumencracia</b>, una forma de gobierno democrática ficticia.</p>
    <ul class="list-check no"><li>No es un sistema electoral oficial ni seguro.</li><li>No verifica identidades: el registro es ficticio.</li><li>Niki, sus provincias, personas, propuestas y resultados son inventados.</li></ul>
    <p class="small">Lo que hacés (apoyos, votos, comentarios) se guarda solo en este navegador.</p>
    <div class="btn-row"><button class="btn orange" data-act="borrar">Borrar mis datos de la demo</button></div>
  </div>
  <div class="glass" id="instalar"><h3>📲 Instalar Ágora en el celular</h3>
    <p class="small"><b>Android (Chrome):</b> menú ⋮ › «Instalar app» o «Agregar a la pantalla principal».<br><b>iPhone (Safari):</b> botón Compartir › «Agregar a inicio».</p>
    <button class="btn green" data-act="instalar" ${instalarEvt ? '' : 'hidden'}>Instalar ahora</button></div>
  ${pie()}`;

function pie() {
  return `<footer class="foot"><div class="prisma">🔷 Plataforma regulada y auditada por Prisma</div>
    <div>Ágora · República de Niki · Demo educativa con datos ficticios</div>
    <div><a class="link" href="#/acerca">Sobre esta demo</a> · <a class="link" href="#/prisma">Reglas y bitácora</a></div></footer>`;
}
function noEncontrado() { return `${volver('#/')}<div class="glass empty-note">No encontramos esa página.</div>`; }

/* ---------- menú lateral ---------- */
function renderDrawer(ruta) {
  const it = (href, ico, txt, key) => `<a href="${href}" class="${ruta === key ? 'on' : ''}"><span class="ico">${ico}</span>${txt}</a>`;
  $('#drawer').innerHTML = `
    <div class="dhead"><img src="logo.webp" width="40" height="40" alt=""><b>Ágora</b><button class="icon-btn" data-act="cerrar-menu" aria-label="Cerrar menú">✕</button></div>
    <a class="glass tight item" href="#/elysia" style="display:block;margin:0 0 12px">
      <div class="small"><b>✨ Elysia</b> · mandato ${MANDATO.inicio.getFullYear()}–${MANDATO.fin.getFullYear()}</div>
      <div class="small muted">Quedan <span data-resta-txt>${textoResta()}</span></div>
      <div class="progress orange" style="margin-top:6px;height:10px"><i data-avance style="width:${avanceMandato()}%"></i></div></a>
    <nav>
      ${it('#/', '🏠', 'Inicio', 'inicio')}
      ${it('#/boletin', '📰', 'Boletín Oficial y calendario', 'boletin')}
      <button class="dl" data-act="sub"><span class="ico">🗺️</span>Provincias <span style="margin-left:auto">▾</span></button>
      <div class="sub ${ruta === 'provincia' ? 'open' : ''}">${PROVINCIAS.map(p => `<a href="#/provincia/${p.id}">${esc(p.nombre)}</a>`).join('')}</div>
      ${it('#/elysia', '✨', 'Elysia: mandato y creación', 'elysia')}
      ${it('#/perfil', '🗳️', 'Perfil Programático', 'perfil')}
      ${it('#/consultas', '📋', 'Consultas populares', 'consultas')}
      ${it('#/iniciativas', '💡', 'Iniciativas populares', 'iniciativas')}
      ${it('#/tendencias', '📈', 'Tendencias', 'tendencias')}
      ${it('#/prisma', '🔷', 'Prisma y reglas', 'prisma')}
      ${it('#/acerca', 'ℹ️', 'Sobre esta demo', 'acerca')}
      ${S.user ? `<button class="dl" data-act="salir"><span class="ico">🚪</span>Salir (${esc(S.user.alias)})</button>` : `<button class="dl" data-act="registro"><span class="ico">👤</span>Participar</button>`}
    </nav>`;
}
function menu(abrir) { $('#drawer').classList.toggle('open', abrir); $('#scrim').classList.toggle('open', abrir); }

/* ---------- modales ---------- */
function modal(html) { $('#modalBody').innerHTML = html; $('#modal').classList.add('open'); }
function cerrarModal() { $('#modal').classList.remove('open'); }
function abrirRegistro(prov) {
  const pid = prov || S.verProv || 'lumina';
  modal(`<h2>Participar en Ágora</h2><p class="muted small">Registro ficticio de la demo: no se verifica la identidad y los datos quedan solo en este dispositivo.</p>
    <form data-form="registro">
      <label class="f" for="al">Nombre o alias</label><input class="in" id="al" name="alias" maxlength="30" required placeholder="Ej.: Sofi">
      <label class="f" for="pr">Provincia donde vivís</label><select class="in" id="pr" name="prov">${PROVINCIAS.map(p => `<option value="${p.id}" ${p.id === pid ? 'selected' : ''}>${esc(p.nombre)}</option>`).join('')}</select>
      <label class="f" for="lc">Localidad</label><select class="in" id="lc" name="loc">${PROV(pid).localidades.map(l => `<option>${esc(l)}</option>`).join('')}</select>
      <div class="btn-row"><button class="btn green" style="flex:1">Entrar</button><button type="button" class="btn ghost" data-act="cerrar-modal">Cancelar</button></div>
    </form>`);
}
function abrirNuevoDebate(pid, nid) {
  if (!S.user) return abrirRegistro(pid);
  if (S.user.prov !== pid) return toast('Solo podés debatir en tu provincia');
  const N = NODO(nid);
  modal(`<h2>Abrir un debate</h2><p class="muted small">Nodo de ${esc(N.nombre)} · ${esc(PROV(pid).nombre)}</p>
    <form data-form="debate" data-prov="${pid}" data-nodo="${nid}">
      <label class="f" for="tp">Tipo</label><select class="in" id="tp" name="tipo"><option>Crítica</option><option>Idea</option><option>Mejora</option><option>Pregunta</option></select>
      <label class="f" for="tm">Tema</label><select class="in" id="tm" name="tema">${opcionesTema(nid)}</select>
      <label class="f" for="dt">Título</label><input class="in" id="dt" name="titulo" maxlength="90" required>
      <label class="f" for="dx">Contá más</label><textarea class="in" id="dx" name="texto" maxlength="1200" required></textarea>
      <div class="btn-row"><button class="btn" style="flex:1">Publicar</button><button type="button" class="btn ghost" data-act="cerrar-modal">Cancelar</button></div>
    </form>`);
}
let tt;
function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('show'), 2400); }

/* ---------- router ---------- */
let timers = [];
function render() {
  timers.forEach(clearInterval); timers = [];
  const [ruta] = (location.hash.slice(1) || '/').split('?');
  const seg = ruta.split('/').filter(Boolean);
  let html, key = seg[0] || 'inicio';
  if (!seg.length) html = V.inicio();
  else if (seg[0] === 'provincia' && seg[2] === 'nodo') { html = V.nodo(seg[1], seg[3], seg[4] || 'info'); key = 'provincia'; if ((seg[4] || 'info') === 'vivo') setTimeout(() => iniciarChat(seg[1], seg[3]), 0); }
  else if (seg[0] === 'provincia') html = V.provincia(seg[1]);
  else if (seg[0] === 'consulta') html = V.consulta(seg[1], seg[2]);
  else if (V[seg[0]]) html = V[seg[0]](seg[1]);
  else html = noEncontrado();
  $('#view').innerHTML = html;
  $('#userChip').textContent = S.user ? `👤 ${S.user.alias}` : 'Participar';
  renderDrawer(key); menu(false); tickContadores();
  if (!location.hash.includes('#provincias')) window.scrollTo(0, 0);
}
window.addEventListener('hashchange', () => { calSel = null; render(); });

/* chat simulado de la sesión en vivo */
const CHAT = ['¿Cuándo se trata la iniciativa de las guardias?', 'Muy buena la explicación del ministro 👏', 'En mi localidad esto no se cumple', 'Gracias por transmitir, así podemos seguirlo desde casa', '¿Van a publicar el informe completo?', 'Apoyo la propuesta, ojalá la aprueben', 'Pido que la próxima sesión sea en el interior de la provincia', 'Prisma debería auditar esto', '¿Se puede presentar una iniciativa en conjunto?', 'Desde el punto de atención presencial también lo estamos mirando 🙌'];
function iniciarChat(pid, nid) {
  const box = $('#chat'); if (!box) return; const r = rng(Date.now());
  const add = (autor, texto, mio) => { box.insertAdjacentHTML('beforeend', `<div class="msg ${mio ? 'mine' : ''}"><b>${esc(autor)}:</b> ${esc(texto)}</div>`); box.scrollTop = box.scrollHeight; if (box.children.length > 60) box.firstChild.remove(); };
  for (let i = 0; i < 4; i++) add(persona(r), pick(r, CHAT));
  let ult = ''; timers.push(setInterval(() => { let m; do { m = pick(r, CHAT); } while (m === ult); ult = m; add(persona(r), m); const v = $('#viewers'); if (v) v.textContent = num(Number(v.textContent.replace(/\D/g, '')) + Math.floor(r() * 7) - 2); }, 3200));
  box._add = add;
}

/* ---------- eventos ---------- */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const a = b.dataset.act;
  if (a === 'toggle') b.classList.toggle('open');
  else if (a === 'mapa') { mapaSel = b.dataset.prov; document.querySelectorAll('.prov-shape').forEach(g => g.classList.toggle('on', g.dataset.prov === mapaSel)); $('#mapaInfo').innerHTML = infoMapa(); }
  else if (a === 'cal') { calSel = Number(b.dataset.dia); $('#cal').innerHTML = calendarioHTML(); }
  else if (a === 'loc') { S.locFiltro = b.dataset.loc || null; guardar(); render(); }
  else if (a === 'registro') abrirRegistro(b.dataset.prov);
  else if (a === 'cerrar-modal') cerrarModal();
  else if (a === 'cerrar-menu') menu(false);
  else if (a === 'sub') b.nextElementSibling.classList.toggle('open');
  else if (a === 'salir') { S.user = null; guardar(); toast('Saliste de Ágora'); render(); }
  else if (a === 'nueva') {
    if (!S.user) return abrirRegistro(b.dataset.prov);
    if (b.dataset.prov && S.user.prov !== b.dataset.prov) return toast(`Solo podés proponer en ${PROV(S.user.prov).nombre}`);
    location.hash = '#/nueva' + (b.dataset.nodo ? '?nodo=' + b.dataset.nodo : '');
  }
  else if (a === 'nuevo-debate') abrirNuevoDebate(b.dataset.prov, b.dataset.nodo);
  else if (a === 'apoyar') { const id = b.dataset.id; if (S.apoyos[id]) delete S.apoyos[id]; else S.apoyos[id] = true; guardar(); toast(S.apoyos[id] ? '¡Gracias por tu apoyo!' : 'Quitaste tu apoyo'); render(); }
  else if (a === 'compartir') { const url = location.href; if (navigator.share) navigator.share({ title: 'Ágora', url }).catch(() => {}); else { navigator.clipboard?.writeText(url); toast('Link copiado'); } }
  else if (a === 'usar-sugerencia') { const f = b.closest('form'); f.nodo.value = b.dataset.nodo; f.tema.innerHTML = opcionesTema(b.dataset.nodo, b.dataset.tema); toast('Sugerencia aplicada'); }
  else if (a === 'reset-perfil') { S.perfil = {}; guardar(); render(); }
  else if (a === 'borrar') { if (confirm('¿Borrar todos tus datos de la demo en este dispositivo?')) { S = vacio(); guardar(); toast('Datos borrados'); location.hash = '#/'; render(); } }
  else if (a === 'instalar' && instalarEvt) { instalarEvt.prompt(); instalarEvt = null; }
});
$('#menuBtn').addEventListener('click', () => menu(true));
$('#scrim').addEventListener('click', () => menu(false));
$('#userChip').addEventListener('click', () => S.user ? (location.hash = '#/provincia/' + S.user.prov) : abrirRegistro());
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') cerrarModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { cerrarModal(); menu(false); } if ((e.key === 'Enter' || e.key === ' ') && e.target.classList?.contains('prov-shape')) { e.preventDefault(); e.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });

document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.act === 'filtro-nodo' || t.dataset.act === 'orden') {
    const pid = location.hash.split('?')[0].split('/')[2] || S.user?.prov || 'lumina';
    const q = new URLSearchParams(location.hash.split('?')[1] || ''); q.set(t.dataset.act === 'orden' ? 'orden' : 'nodo', t.value);
    location.hash = `#/iniciativas/${pid}?${q}`;
  }
  if (t.name === 'prov' && t.form?.dataset.form === 'registro') t.form.loc.innerHTML = PROV(t.value).localidades.map(l => `<option>${esc(l)}</option>`).join('');
  if (t.name === 'nodo' && t.form?.dataset.form === 'nueva') t.form.tema.innerHTML = opcionesTema(t.value);
  if (t.type === 'radio') t.closest('form').querySelectorAll('.opt').forEach(o => o.classList.toggle('on', o.contains(t) && t.checked));
});
document.addEventListener('input', e => {
  const f = e.target.form; if (!f || f.dataset.form !== 'nueva' || !['titulo', 'cuerpo'].includes(e.target.name)) return;
  const s = clasificar(f.titulo.value + ' ' + f.cuerpo.value), h = $('#hint');
  if (!s) { h.classList.remove('show'); return; }
  const N = NODO(s.nodo); h.classList.add('show');
  h.innerHTML = `✨ <b>Elysia sugiere:</b> Nodo de ${esc(N.nombre)} › ${esc(s.tema)}
    ${f.nodo.value === s.nodo && f.tema.value === s.tema ? '<span class="badge green">Aplicada</span>' : `<button type="button" class="btn small" style="margin-left:6px" data-act="usar-sugerencia" data-nodo="${s.nodo}" data-tema="${esc(s.tema)}">Usar sugerencia</button>`}`;
});

document.addEventListener('submit', e => {
  const f = e.target, tipo = f.dataset.form; if (!tipo) return; e.preventDefault();
  const v = n => (f[n]?.value || '').trim();
  if (tipo === 'registro') {
    if (v('alias').length < 2) return toast('Escribí un nombre o alias');
    S.user = { alias: v('alias'), prov: v('prov'), loc: v('loc') }; guardar(); cerrarModal();
    toast(`¡Hola, ${S.user.alias}! Participás desde ${S.user.loc}`); render();
  } else if (tipo === 'nueva') {
    if (v('titulo').length < 8) return toast('El título es muy corto');
    if (v('cuerpo').length < 20) return toast('Contá un poco más tu propuesta');
    if (!v('nodo')) return toast('Elegí el nodo');
    const D = datosProv(S.user.prov), id = 'u-' + S.user.prov + '-' + Date.now().toString(36);
    S.propias.push({ id, prov: S.user.prov, nodo: v('nodo'), tema: v('tema'), loc: v('loc'), titulo: v('titulo'), cuerpo: v('cuerpo'), autor: S.user.alias, apoyos: 0, umbral: D.umbral, estado: 'apoyos', dias: 0 });
    S.apoyos[id] = true; guardar(); toast('¡Iniciativa publicada!'); location.hash = '#/propuesta/' + id;
  } else if (tipo === 'com') {
    if (!v('t')) return; (S.coms[f.dataset.id] ||= []).push({ autor: S.user.alias, texto: v('t'), dias: 0 }); guardar(); render();
  } else if (tipo === 'chat') {
    if (!v('t')) return; $('#chat')?._add(S.user.alias, v('t'), true); f.t.value = '';
  } else if (tipo === 'debate') {
    if (v('titulo').length < 5 || v('texto').length < 10) return toast('Completá el título y el texto');
    const id = 'ud-' + f.dataset.prov + '-' + Date.now().toString(36);
    S.debates.push({ id, prov: f.dataset.prov, nodo: f.dataset.nodo, tipo: v('tipo'), tema: v('tema'), loc: S.user.loc, titulo: v('titulo'), texto: v('texto'), autor: S.user.alias, coms: [], vistas: 1, dias: 0 });
    guardar(); cerrarModal(); toast('Debate publicado'); location.hash = '#/debate/' + id;
  } else if (tipo === 'votar') {
    const op = f.querySelector('input[name=op]:checked'); if (!op) return toast('Elegí una opción');
    S.votos[f.dataset.key] = Number(op.value); guardar(); toast('Voto registrado (simulación)'); render();
  } else if (tipo === 'perfil1' || tipo === 'perfil2') {
    const op = f.querySelector('input[name=op]:checked'); if (!op) return toast('Elegí un programa');
    S.perfil[tipo === 'perfil1' ? 'r1' : 'r2'] = op.value; guardar(); render();
  }
});

/* ---------- música: reproductor oficial de YouTube, sigue sonando al navegar ---------- */
const CANCION = { id: 'RlV-ZFyVH3c', titulo: 'Beast of Burden', artista: 'The Rolling Stones' };
function musicaCerrada() {
  $('#musica').innerHTML = `<button class="music-btn" data-act="musica-abrir" aria-label="Escuchar ${CANCION.titulo}">🎵 <span>${CANCION.titulo}</span></button>`;
}
function musicaAbierta() {
  const src = `https://www.youtube-nocookie.com/embed/${CANCION.id}?autoplay=1&loop=1&playlist=${CANCION.id}&rel=0&playsinline=1`;
  $('#musica').innerHTML = `<div class="music-card">
    <div class="music-head"><span>🎵 <b>${CANCION.titulo}</b><br><small>${CANCION.artista}</small></span>
      <span class="music-ctrl"><button class="icon-btn" data-act="musica-min" aria-label="Minimizar o mostrar el reproductor">▾</button>
      <button class="icon-btn" data-act="musica-cerrar" aria-label="Cerrar música">✕</button></span></div>
    <iframe src="${src}" title="${CANCION.titulo} · ${CANCION.artista}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
  </div>`;
}
musicaCerrada();
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act^="musica-"]'); if (!b) return;
  if (b.dataset.act === 'musica-abrir') musicaAbierta();
  else if (b.dataset.act === 'musica-min') { const c = $('.music-card'); c.classList.toggle('min'); b.textContent = c.classList.contains('min') ? '▴' : '▾'; }
  else musicaCerrada();
});

/* ---------- burbujas, PWA e inicio ---------- */
(function burbujas() {
  const c = $('.bubbles'); const r = rng('burbujas');
  const nueva = (delay = true) => { const s = 14 + Math.random() * 50; c.insertAdjacentHTML('beforeend', `<span style="left:${Math.random() * 100}%;width:${s}px;height:${s}px;animation-duration:${14 + Math.random() * 18}s;animation-delay:${delay ? '-' + (Math.random() * 30).toFixed(1) : '0'}s"></span>`); };
  for (let i = 0; i < 14; i++) nueva();
  c.addEventListener('pointerdown', e => {
    const b = e.target.closest('span'); if (!b || b.classList.contains('pop')) return;
    const m = new DOMMatrix(getComputedStyle(b).transform);
    b.style.translate = `${m.m41}px ${m.m42}px`; b.classList.add('pop');
    setTimeout(() => { b.remove(); nueva(false); }, 360);
  });
})();
let instalarEvt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); instalarEvt = e; const b = document.querySelector('[data-act=instalar]'); if (b) b.hidden = false; });
if ('serviceWorker' in navigator && location.protocol !== 'file:') window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
render();
