/* Ágora — Información electoral (demo educativa, datos ficticios)
   Se carga DESPUÉS de app.js: agrega la ruta #/electoral y su entrada en el menú lateral. */
'use strict';

/* ---------- Configuración: cambiá acá las fechas de las elecciones ---------- */
const ELEC = {
  gob:  { nombre: 'Gobernadores y gobernadoras', cada: 4, proxima: new Date('2027-10-24T08:00:00-03:00'), icono: '🏛️', color: '#ff922e' },
  cons: { nombre: 'Consejo Federal',             cada: 5, proxima: new Date('2030-10-27T08:00:00-03:00'), icono: '🤝', color: '#8a5cd6' },
};
/* Si la fecha ya pasó, la cuenta salta sola a la elección siguiente. */
function elecSiguiente(e) { const f = new Date(e.proxima); while (f <= hoy()) f.setFullYear(f.getFullYear() + e.cada); return f; }
function elecAnterior(e, f) { const a = new Date(f); a.setFullYear(a.getFullYear() - e.cada); return a; }
function elecAvance(e) { const f = elecSiguiente(e), a = elecAnterior(e, f); return Math.min(100, Math.max(0, (hoy() - a) / (f - a) * 100)); }

function elecContador(clave) {
  const p = partes(hoy(), elecSiguiente(ELEC[clave]));
  return `<div class="counter six down" data-elec="${clave}">${UNID.map(([k, l]) => `<div><b data-u="${k}">${p[k]}</b><span>${l}</span></div>`).join('')}</div>`;
}
function tickElec() {
  const t = hoy();
  document.querySelectorAll('[data-elec]').forEach(el => {
    const p = partes(t, elecSiguiente(ELEC[el.dataset.elec]));
    el.querySelectorAll('[data-u]').forEach(b => { b.textContent = String(p[b.dataset.u]).padStart(['a', 'm', 'd'].includes(b.dataset.u) ? 1 : 2, '0'); });
  });
  document.querySelectorAll('[data-elec-bar]').forEach(el => { el.style.width = elecAvance(ELEC[el.dataset.elecBar]).toFixed(2) + '%'; });
  document.querySelectorAll('[data-elec-pct]').forEach(el => { el.textContent = elecAvance(ELEC[el.dataset.elecPct]).toFixed(1).replace('.', ','); });
}
setInterval(tickElec, 1000);

/* ---------- Nikita, la asistente virtual de cada máquina ---------- */
function sol({ feliz = false, size = 92 } = {}) {
  return `<img class="el-avatar ${feliz ? 'feliz' : ''}" src="nikita-avatar.webp" width="${size}" height="${size}" alt="Nikita, la asistente virtual con casco">`;
}
const soli = (texto, opts) => `<div class="el-soli"><div class="el-sol">${sol(opts)}</div><div class="el-bubble"><b>Nikita</b>${texto}</div></div>`;

/* ---------- Sede de votación (ficticia) ---------- */
const EL = { tipo: 'gob', paso: 0, sel: null, prov: null, loc: null, hora: null, nro: null };
function sedeDe(pid, loc) {
  const r = rng('sede-' + pid + '-' + loc);
  const tipos = ['Escuela N°', 'Club Social', 'Centro Cívico', 'Biblioteca Popular', 'Polideportivo'];
  const calles = ['San Martín', 'Belgrano', 'Mitre', 'Sarmiento', 'Rivadavia', 'Moreno', 'Alberdi', 'Av. de la Lumencracia'];
  const t = pick(r, tipos);
  const nombre = t.endsWith('N°') ? `${t} ${Math.floor(r() * 80) + 1}` : `${t} ${pick(r, APELLIDOS)}`;
  return { nombre, dir: `${pick(r, calles)} ${100 + Math.floor(r() * 1900)}, ${loc}` };
}
function sedeHTML() {
  const pid = EL.prov, P = PROV(pid), loc = P.localidades.includes(EL.loc) ? EL.loc : P.localidades[0], s = sedeDe(pid, loc);
  return `<div class="row" style="gap:10px;flex-wrap:wrap">
      <div class="grow" style="min-width:140px"><label class="f" for="elProv">Provincia</label>
        <select class="in" id="elProv" data-el="prov">${PROVINCIAS.map(p => `<option value="${p.id}" ${p.id === pid ? 'selected' : ''}>${esc(p.nombre)}</option>`).join('')}</select></div>
      <div class="grow" style="min-width:140px"><label class="f" for="elLoc">Localidad</label>
        <select class="in" id="elLoc" data-el="loc">${P.localidades.map(l => `<option ${l === loc ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></div>
    </div>
    <div class="el-sede"><span class="el-pin">📍</span><div><b>${esc(s.nombre)}</b><div class="muted small">${esc(s.dir)}</div><div class="muted small">Domingo de elecciones · 8:00 a 18:00</div></div></div>`;
}

/* ---------- Simulador de la máquina de votación ---------- */
const PASOS = ['Recepción', 'Máquina', 'Elegir', 'Comprobante'];
function candidatos() {
  const pid = EL.prov;
  return PROGRAMAS.map(p => {
    const r = rng(`cand-${EL.tipo}-${pid}-${p.id}`);
    return { id: p.id, partido: p.nombre, agr: p.agrupacion, color: p.color, persona: persona(r) };
  });
}
function elecTitulo() { return EL.tipo === 'gob' ? `Gobernador/a de ${PROV(EL.prov).nombre}` : 'Integrante del Consejo Federal'; }
function simHTML() {
  const pasos = `<div class="el-pasos">${PASOS.map((n, i) => `<span class="${i === EL.paso ? 'on' : i < EL.paso ? 'ok' : ''}"><i>${i < EL.paso ? '✓' : i + 1}</i>${n}</span>`).join('')}</div>`;
  let pantalla = '';
  if (EL.paso === 0) {
    pantalla = `${soli('¡Hola! Soy <b>Nikita</b>, la asistente virtual que te va a ayudar. Primero presentá tu <b>DNI en recepción</b>: así queda constancia de que viniste a votar.')}
      <p class="muted small" style="margin:6px 0 10px">En la demo no se pide ningún dato real: es solo un botón.</p>
      <button class="btn orange block" data-el="dni">🪪 Mostrar mi DNI (simulado)</button>`;
  } else if (EL.paso === 1) {
    pantalla = `${soli('Listo, ya figurás como presente. Tu DNI <b>no queda unido</b> a tu voto. Pasá a una máquina y <b>ponete los auriculares</b>: te voy a ir explicando todo.')}
      <button class="btn block" style="margin-top:10px" data-el="auris">🎧 Ponerme los auriculares</button>`;
  } else if (EL.paso === 2) {
    const c = candidatos();
    pantalla = `${soli(`Tocá la opción que prefieras. Podés cambiar de idea todas las veces que quieras antes de enviar. <b>Nadie ve tu pantalla.</b>`)}
      <div class="el-cargo">${esc(elecTitulo())}</div>
      ${c.map(x => `<button class="el-opt ${EL.sel === x.id ? 'on' : ''}" data-el="op" data-id="${x.id}"><span class="el-dot" style="background:${x.color}"></span><span class="grow"><b>${esc(x.persona)}</b><br><span class="small muted">${esc(x.partido)} · ${esc(x.agr)}</span></span><span class="el-tick">${EL.sel === x.id ? '✔' : ''}</span></button>`).join('')}
      <button class="el-opt blanco ${EL.sel === 'blanco' ? 'on' : ''}" data-el="op" data-id="blanco"><span class="el-dot" style="background:#fff;border:2px solid #9bb"></span><span class="grow"><b>Voto en blanco</b></span><span class="el-tick">${EL.sel === 'blanco' ? '✔' : ''}</span></button>
      <button class="btn green block" style="margin-top:12px" data-el="enviar" ${EL.sel ? '' : 'disabled'}>Enviar mi voto</button>`;
  } else {
    const d = EL.hora, f = d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }), h = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    pantalla = `<div class="el-ok"><svg viewBox="0 0 52 52" width="84" height="84" aria-hidden="true"><circle class="c" cx="26" cy="26" r="23"/><path class="t" d="M15 27l8 8 15-17"/></svg>
        <h3>¡Voto enviado!</h3></div>
      ${soli('¡Muy bien! Tu voto quedó registrado. Retirá tu <b>comprobante</b> y listo. ¡Gracias por participar!', { feliz: true })}
      <div class="el-ticket" role="group" aria-label="Comprobante de votación">
        <div class="el-t-head">COMPROBANTE DE VOTACIÓN</div>
        <div class="el-t-row"><span>Elección</span><b>${EL.tipo === 'gob' ? 'Gobernador/a' : 'Consejo Federal'}</b></div>
        <div class="el-t-row"><span>Fecha</span><b>${f}</b></div>
        <div class="el-t-row"><span>Hora</span><b>${h}</b></div>
        <div class="el-t-row"><span>N° comprobante</span><b>${EL.nro}</b></div>
        <div class="el-t-ok">✔ La votación se realizó de forma correcta</div>
        <div class="el-t-note">Este comprobante no indica qué partido ni qué candidato elegiste.</div>
        <div class="el-t-bar" aria-hidden="true"></div>
      </div>
      <button class="btn ghost block" style="margin-top:12px" data-el="reset">Repetir la simulación</button>`;
  }
  return `${pasos}<div class="el-kiosk"><div class="el-kiosk-top">VOTO</div><div class="el-screen">${pantalla}</div></div>`;
}
function pintarSim() { const el = $('#elSim'); if (el) el.innerHTML = simHTML(); }

/* ---------- Vista #/electoral ---------- */
V.electoral = () => {
  EL.paso = 0; EL.sel = null; EL.hora = null;
  EL.prov = EL.prov || S.user?.prov || 'lumina'; if (!PROV(EL.prov)) EL.prov = 'lumina';
  EL.loc = EL.loc || S.user?.loc || null;
  const tarjeta = (k, txt) => {
    const e = ELEC[k], f = elecSiguiente(e);
    return `<div class="glass el-card">
      <div class="row" style="gap:12px;align-items:center"><div class="orb sm" style="--c:${e.color}">${e.icono}</div>
        <div class="grow"><h3 style="margin:0">Elección: ${e.nombre}</h3><span class="badge ${k === 'gob' ? 'orange' : 'purple'}">Cada ${e.cada} años</span></div></div>
      <p class="muted small" style="margin:10px 0 0">${txt}</p>
      <p style="margin:8px 0 0"><b>Próxima elección:</b> ${mayus(fechaLarga(f))}</p>
      ${elecContador(k)}
      <div class="progress ${k === 'gob' ? 'orange' : 'turq'}"><i data-elec-bar="${k}" style="width:${elecAvance(e).toFixed(2)}%"></i></div>
      <p class="small" style="text-align:center;margin:6px 0 0">Ciclo de ${e.cada} años recorrido: <b><span data-elec-pct="${k}">${elecAvance(e).toFixed(1).replace('.', ',')}</span> %</b></p>
    </div>`;
  };
  return `
  <section class="glass hero el-hero">
    <div class="orb lg" style="--c:#ff922e;margin:0 auto">🗳️</div>
    <h1 style="font-size:26px">Información electoral</h1>
    <p class="sub">Cuándo se vota, cómo se vota y qué te espera el día de la elección en la República de Niki.</p>
    <span class="badge green">Voto directo y presencial</span>
  </section>
  ${DEMO}
  <div class="el-banner"><img src="nikita.webp" alt="Nikita, la mascota de Ágora, junto a una máquina de votación" loading="lazy"><span>Nikita te muestra dónde se vota</span></div>

  <div class="section-title"><h2>⏳ Próximas elecciones</h2></div>
  ${tarjeta('gob', 'Cada provincia elige a su gobernador o gobernadora con el voto directo de quienes viven en ella.')}
  ${tarjeta('cons', 'Las personas que integran el Consejo Federal también se eligen por voto directo y presencial.')}

  <div class="section-title"><h2>🧭 ¿Cómo se vota?</h2></div>
  <div class="glass"><p style="margin-top:0">El voto es <b>directo</b> (elegís vos, sin intermediarios) y <b>presencial</b>: vas a la sede que te corresponde. Funciona parecido a un cajero de banco.</p>
    <ol class="steps">
      <li><b>Andá a tu sede de votación</b>, la que corresponde a tu localidad.</li>
      <li><b>Presentá tu DNI en recepción.</b> Sirve para dejar constancia de que fuiste a votar. No se anota qué votaste.</li>
      <li><b>Pasá a una de las máquinas</b> y <b>ponete los auriculares</b>.</li>
      <li><b>Elegí a tu candidato o candidata</b> entre los partidos que aparecen en pantalla.</li>
      <li><b>Enviá tu voto</b> sin ingresar ningún dato personal.</li>
      <li><b>Aparece una tilde verde</b> y la máquina imprime tu <b>comprobante</b> con fecha, hora y la confirmación de que votaste bien.</li>
    </ol></div>

  <div class="section-title"><h2>🖥️ La máquina de votación</h2></div>
  <div class="glass" style="text-align:center">
    <img class="el-machine" src="maquina.webp" alt="Máquina de votación con pantalla, auriculares y comprobante impreso" loading="lazy">
    <p class="muted small" style="margin:8px 0 0">Habrá máquinas como esta en cada sede. Cada una tiene pantalla táctil, auriculares y una impresora para el comprobante.</p>
  </div>

  <div class="section-title"><h2>🤖 Nikita, tu asistente</h2></div>
  <div class="glass">
    ${soli('¡Hola! Soy <b>Nikita</b>. Estoy en <b>cada máquina</b> para ayudarte. Si no usás mucho la tecnología, tranquilo/a: te muestro <b>paso a paso</b> qué tocar y te lo voy explicando por los auriculares.')}
    <ul class="list-check" style="margin-top:10px"><li>Te guía en cada pantalla, sin apuros.</li><li>Te recuerda que podés corregir antes de enviar.</li><li>Nunca te dice a quién votar.</li></ul>
  </div>

  <div class="section-title"><h2>📍 Tu sede de votación</h2></div>
  <div class="glass" id="elSede">${sedeHTML()}<p class="muted small" style="margin:8px 0 0">Sedes inventadas para la demo.</p></div>

  <div class="section-title"><h2>🎮 Probá la máquina</h2></div>
  <div class="glass">
    <p style="margin-top:0">Simulá el recorrido completo. <b>Nada de lo que elijas se guarda.</b></p>
    <div class="el-seg" role="tablist"><button data-el="tipo" data-t="gob" class="${EL.tipo === 'gob' ? 'on' : ''}">Gobernador/a</button><button data-el="tipo" data-t="cons" class="${EL.tipo === 'cons' ? 'on' : ''}">Consejo Federal</button></div>
    <div id="elSim">${simHTML()}</div>
  </div>

  <div class="glass"><h3>🔒 Qué queda registrado y qué no</h3>
    <ul class="list-check"><li>Que fuiste a votar (en recepción, con tu DNI).</li><li>Fecha y hora de tu votación en el comprobante.</li><li>Que tu voto se emitió correctamente.</li></ul>
    <ul class="list-check no"><li>A qué partido o candidato votaste.</li><li>Ningún dato personal dentro de la máquina.</li><li>Ningún vínculo entre tu DNI y tu voto.</li></ul></div>
  ${pie()}`;
};

/* ---------- Eventos ---------- */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-el]'); if (!b || b.tagName === 'SELECT') return;
  const a = b.dataset.el;
  if (a === 'tipo') { EL.tipo = b.dataset.t; EL.paso = 0; EL.sel = null; document.querySelectorAll('.el-seg button').forEach(x => x.classList.toggle('on', x.dataset.t === EL.tipo)); }
  else if (a === 'dni') EL.paso = 1;
  else if (a === 'auris') EL.paso = 2;
  else if (a === 'op') EL.sel = b.dataset.id;
  else if (a === 'enviar') { if (!EL.sel) return; EL.sel = null; EL.hora = new Date(); EL.nro = 'EL-' + Math.floor(100000 + Math.random() * 900000); EL.paso = 3; }
  else if (a === 'reset') { EL.paso = 0; EL.sel = null; }
  pintarSim();
});
document.addEventListener('change', e => {
  const t = e.target; if (!t.dataset || !t.dataset.el) return;
  if (t.dataset.el === 'prov') { EL.prov = t.value; EL.loc = null; }
  else if (t.dataset.el === 'loc') EL.loc = t.value;
  else return;
  $('#elSede').innerHTML = sedeHTML() + '<p class="muted small" style="margin:8px 0 0">Sedes inventadas para la demo.</p>';
  if (EL.paso < 3) pintarSim();
});

/* ---------- Entrada en el menú lateral ---------- */
const renderDrawerBase = renderDrawer;
renderDrawer = function (ruta) {
  renderDrawerBase(ruta);
  const ref = document.querySelector('#drawer a[href="#/perfil"]');
  if (ref) ref.insertAdjacentHTML('afterend', `<a href="#/electoral" class="${ruta === 'electoral' ? 'on' : ''}"><span class="ico">🏛️</span>Información electoral</a>`);
};
render();
