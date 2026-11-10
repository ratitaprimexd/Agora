/* Ágora — datos ficticios de la República de Niki (demo educativa) */
'use strict';

const MANDATO = {
  inicio: new Date('2025-12-10T10:00:00-03:00'),
  fin: new Date('2029-12-10T10:00:00-03:00'),
  programa: 'Comunidad Primero',
  agrupacion: 'Movimiento Solidario Nikiense',
};

const NODOS = [
  { id: 'salud', nombre: 'Salud', icono: '🩺', color: '#ef5a6f', temas: [
    { n: 'Hospitales y guardias', k: ['hospital', 'guardia', 'internación', 'cama', 'emergencia médica'] },
    { n: 'Atención primaria', k: ['salita', 'centro de salud', 'médico de cabecera', 'consultorio'] },
    { n: 'Medicamentos', k: ['medicamento', 'remedio', 'farmacia', 'receta'] },
    { n: 'Salud mental', k: ['salud mental', 'psicólogo', 'ansiedad', 'depresión'] },
    { n: 'Turnos y vacunación', k: ['turno', 'vacuna', 'vacunación', 'espera'] } ] },
  { id: 'educacion', nombre: 'Educación y Cultura', icono: '📚', color: '#f39a1e', temas: [
    { n: 'Escuelas', k: ['escuela', 'colegio', 'aula', 'alumno', 'primaria', 'secundaria'] },
    { n: 'Universidades', k: ['universidad', 'facultad', 'carrera', 'beca'] },
    { n: 'Docentes', k: ['docente', 'maestro', 'profesor', 'capacitación docente'] },
    { n: 'Bibliotecas y museos', k: ['biblioteca', 'museo', 'libro', 'archivo'] },
    { n: 'Cultura y eventos', k: ['cultura', 'teatro', 'música', 'festival', 'cine'] } ] },
  { id: 'ambiente', nombre: 'Medio Ambiente', icono: '🌿', color: '#3dbb5c', temas: [
    { n: 'Residuos y reciclaje', k: ['basura', 'residuo', 'reciclaje', 'contenedor', 'basural'] },
    { n: 'Agua', k: ['agua', 'río', 'contaminación del agua', 'cloaca', 'inundación'] },
    { n: 'Áreas protegidas', k: ['parque nacional', 'reserva', 'fauna', 'flora', 'humedal'] },
    { n: 'Calidad del aire', k: ['aire', 'humo', 'smog', 'quema'] },
    { n: 'Energía limpia', k: ['solar', 'eólica', 'energía renovable', 'panel'] } ] },
  { id: 'seguridad', nombre: 'Seguridad', icono: '🛡️', color: '#3b7fd9', temas: [
    { n: 'Prevención del delito', k: ['robo', 'delito', 'inseguridad', 'asalto'] },
    { n: 'Iluminación y espacio público', k: ['luz', 'iluminación', 'luminaria', 'plaza oscura'] },
    { n: 'Policía comunitaria', k: ['policía', 'patrullero', 'comisaría'] },
    { n: 'Seguridad vial', k: ['semáforo', 'accidente', 'tránsito', 'velocidad', 'senda peatonal'] } ] },
  { id: 'defensa', nombre: 'Defensa', icono: '🛰️', color: '#5d6fa8', temas: [
    { n: 'Protección civil', k: ['protección civil', 'evacuación', 'simulacro'] },
    { n: 'Desastres naturales', k: ['terremoto', 'incendio forestal', 'tormenta', 'sequía', 'alerta'] },
    { n: 'Fronteras', k: ['frontera', 'paso fronterizo', 'límite'] },
    { n: 'Ciberdefensa', k: ['ciberataque', 'hackeo', 'ciberseguridad'] } ] },
  { id: 'justicia', nombre: 'Justicia y Derechos Humanos', icono: '⚖️', color: '#8a5cd6', temas: [
    { n: 'Acceso a la justicia', k: ['juzgado', 'juicio', 'abogado', 'causa', 'demora judicial'] },
    { n: 'Derechos humanos', k: ['derechos humanos', 'discriminación', 'igualdad'] },
    { n: 'Sistema penitenciario', k: ['cárcel', 'penitenciario', 'preso', 'reinserción'] },
    { n: 'Derechos digitales', k: ['datos personales', 'privacidad', 'algoritmo', 'revisión humana'] } ] },
  { id: 'economia', nombre: 'Asuntos Económicos y Empleo', icono: '💼', color: '#d9a400', temas: [
    { n: 'Empleo', k: ['trabajo', 'empleo', 'desempleo', 'sueldo', 'salario'] },
    { n: 'Precios', k: ['precio', 'inflación', 'aumento', 'canasta'] },
    { n: 'Pymes y comercios', k: ['pyme', 'comercio', 'negocio', 'local'] },
    { n: 'Impuestos', k: ['impuesto', 'tributo', 'tasa', 'ingresos brutos'] } ] },
  { id: 'agro', nombre: 'Agricultura y Silvicultura', icono: '🌾', color: '#8bb52a', temas: [
    { n: 'Producción agrícola', k: ['cosecha', 'cultivo', 'siembra', 'campo'] },
    { n: 'Bosques', k: ['bosque', 'tala', 'forestación', 'árbol'] },
    { n: 'Riego', k: ['riego', 'canal', 'represa'] },
    { n: 'Agricultura familiar', k: ['huerta', 'productor familiar', 'feria', 'cooperativa'] } ] },
  { id: 'transporte', nombre: 'Transportes y Comunicaciones', icono: '🚆', color: '#13b5c8', temas: [
    { n: 'Trenes', k: ['tren', 'ferrocarril', 'estación', 'andén', 'vía'] },
    { n: 'Colectivos', k: ['colectivo', 'bondi', 'parada', 'micro', 'boleto'] },
    { n: 'Rutas y caminos', k: ['ruta', 'bache', 'camino', 'puente', 'autopista'] },
    { n: 'Internet y telefonía', k: ['internet', 'señal', 'celular', 'wifi', 'conectividad'] },
    { n: 'Correo', k: ['correo', 'paquete', 'envío', 'encomienda'] } ] },
  { id: 'exteriores', nombre: 'Asuntos Exteriores', icono: '🌐', color: '#1f8fd6', temas: [
    { n: 'Comercio internacional', k: ['exportación', 'importación', 'aduana'] },
    { n: 'Ciudadanos en el exterior', k: ['consulado', 'pasaporte', 'en el exterior'] },
    { n: 'Cooperación regional', k: ['tratado', 'cooperación', 'país vecino'] },
    { n: 'Migraciones', k: ['migrante', 'residencia', 'migración', 'refugiado'] } ] },
  { id: 'social', nombre: 'Desarrollo Social', icono: '🤝', color: '#ff7a59', temas: [
    { n: 'Vivienda', k: ['vivienda', 'casa', 'alquiler', 'barrio'] },
    { n: 'Niñez y adolescencia', k: ['niño', 'niña', 'adolescente', 'infancia'] },
    { n: 'Personas mayores', k: ['jubilado', 'adulto mayor', 'jubilación', 'geriátrico'] },
    { n: 'Discapacidad', k: ['discapacidad', 'accesibilidad', 'rampa', 'silla de ruedas'] },
    { n: 'Alimentación', k: ['comedor', 'alimento', 'merendero', 'hambre'] } ] },
];

/* 13 provincias. poly = silueta en el mapa con forma de casco (viewBox 0 0 560 440) */
const PROVINCIAS = [
  { id: 'lumina', nombre: 'Lumina', tipo: 'Distrito Capital', capital: 'Lumen', poblacion: 3120000, color: '#f5c518',
    lema: 'Distrito de la luz: en su capital, Lumen, sesionan el Plenario de Nodos y el Tribunal Superior de Evanescence.',
    localidades: ['Lumen', 'Puerto Lumen', 'Barrio Prisma', 'Altos de Lumina', 'Villa Faro'],
    poly: '178,183 238,142 300,157 325,280 245,310 145,245', lbl: [245, 215] },
  { id: 'senna', nombre: 'Senna', capital: 'Stones', poblacion: 2050000, color: '#FF922E',
    lema: 'El corazón agrícola de Niki, junto a la capital.',
    localidades: ['Stones', 'Trigales', 'Cruz del Viento', 'General Espiga', 'Laguna Larga'],
    poly: '325,280 372,243 450,213 448,310 375,350', lbl: [395, 285] },
  { id: 'lauda', nombre: 'Lauda', capital: 'Lennon', poblacion: 520000, color: '#2fc4bd',
    lema: 'Cumbres nevadas, pasos de montaña y energía de deshielo.',
    localidades: ['Lennon', 'Paso Alto', 'Valle Blanco'],
    poly: '75,93 98,63 150,35 235,17 238,142 178,183', lbl: [170, 90] },
  { id: 'vettel', nombre: 'Vettel', capital: 'Sade', poblacion: 870000, color: '#6cc24b',
    lema: 'Viñedos, frutales y oasis al pie de la montaña.',
    localidades: ['Sade', 'Viñas del Valle', 'Los Sauces', 'Agua Clara'],
    poly: '235,17 352,45 350,117 300,157 238,142', lbl: [292, 85] },
  { id: 'rosberg', nombre: 'Rosberg', capital: 'Abbey', poblacion: 980000, color: '#2bb5e0',
    lema: 'Tierra de amaneceres, yerbales y ríos anchos.',
    localidades: ['Abbey', 'San Brisa', 'Puerto Albor', 'Colonia Alba'],
    poly: '352,45 410,73 432,105 448,133 420,173 350,117', lbl: [398, 110] },
  { id: 'verstappen', nombre: 'Verstappen', capital: 'Floyd', poblacion: 1610000, color: '#3b7fd9',
    lema: 'La visera del casco: puertos, playas y pesca artesanal.',
    localidades: ['Floyd', 'Bahía Azul', 'Punta Gaviota', 'Médanos'],
    poly: '448,133 495,150 532,157 548,185 538,217 510,227 496,233 450,213 420,173', lbl: [488, 188] },
  { id: 'russell', nombre: 'Russell', capital: 'Spiro', poblacion: 1460000, color: '#16b39a',
    lema: 'Sierras, turismo y universidades.',
    localidades: ['Spiro', 'Cumbres', 'La Quebrada', 'Dique Azul'],
    poly: '300,157 350,117 420,173 450,213 372,243 325,280', lbl: [362, 192] },
  { id: 'piastri', nombre: 'Piastri', capital: 'Dreams', poblacion: 1240000, color: '#3dbb7a',
    lema: 'Cascadas, selva húmeda y ríos turquesa.',
    localidades: ['Dreams', 'Río Verdeagua', 'Cascadas', 'Monte Lapacho'],
    poly: '450,213 496,233 492,250 510,295 525,360 505,380 448,310', lbl: [484, 290] },
  { id: 'ricciardo', nombre: 'Ricciardo', capital: 'Cohen', poblacion: 310000, color: '#ef6f8a',
    lema: 'Arrecifes, bahías y comunidades isleñas.',
    localidades: ['Cohen', 'Coralina', 'Faro Sur'],
    poly: '375,350 448,310 505,380 450,410 372,423', lbl: [432, 378] },
  { id: 'raikkonen', nombre: 'Räikkönen', capital: 'Bowie', poblacion: 1130000, color: '#8a7fe0',
    lema: 'Ríos, canales y transporte fluvial.',
    localidades: ['Bowie', 'Islas del Delta', 'Puerto Junco', 'Arroyo Manso'],
    poly: '245,310 325,280 375,350 372,423 235,413', lbl: [305, 365] },
  { id: 'alonso', nombre: 'Alonso', capital: 'Morrison', poblacion: 950000, color: '#a8c93a',
    lema: 'Lagunas rosadas, molinos y ganadería.',
    localidades: ['Morrison', 'Laguna Rosada', 'Molinos', 'Santa Pradera'],
    poly: '145,245 245,310 235,413 110,403', lbl: [180, 340] },
  { id: 'fangio', nombre: 'Fangio', capital: 'Osbourne', poblacion: 410000, color: '#4fae5a',
    lema: 'Glaciares, estepa y viento.',
    localidades: ['Osbourne', 'Puerto Glaciar', 'Estepa', 'Bahía Final'],
    poly: '15,250 145,245 110,403 50,400 20,335', lbl: [72, 305] },
  { id: 'schumacher', nombre: 'Schumacher', capital: 'Clapton', poblacion: 690000, color: '#4cb8ea',
    lema: 'Salares y los parques solares más grandes del país.',
    localidades: ['Clapton', 'Salinas', 'Pueblo Cóndor', 'Tres Cerros'],
    poly: '75,93 178,183 145,245 15,250 20,165 40,125', lbl: [92, 190] },
];
const SILUETA = '75,93 98,63 150,35 235,17 352,45 410,73 432,105 448,133 495,150 532,157 548,185 538,217 510,227 496,233 492,250 510,295 525,360 505,380 450,410 372,423 235,413 110,403 50,400 20,335 15,250 20,165 40,125';
const CAPITAL_XY = [245, 262];

const NOMBRES = ['Lucía', 'Mateo', 'Valentina', 'Benjamín', 'Camila', 'Joaquín', 'Martina', 'Tomás', 'Sofía', 'Santiago', 'Julieta', 'Facundo', 'Abril', 'Nicolás', 'Mía', 'Thiago', 'Renata', 'Lautaro', 'Catalina', 'Bruno', 'Agustina', 'Ignacio', 'Florencia', 'Emilia', 'Ramiro', 'Paula', 'Gael', 'Malena'];
const APELLIDOS = ['Ferreyra', 'Quiroga', 'Benítez', 'Sosa', 'Aguirre', 'Medina', 'Ríos', 'Paz', 'Correa', 'Villalba', 'Ledesma', 'Ponce', 'Olmedo', 'Acosta', 'Godoy', 'Vera', 'Luna', 'Cabrera', 'Ojeda', 'Funes', 'Arce', 'Salas', 'Torres', 'Maidana'];

/* Iniciativas modelo por nodo: t = índice de tema. {loc} = localidad, {prov} = provincia */
const PROPUESTAS_MODELO = {
  salud: [
    { t: 0, ti: 'Guardia pediátrica las 24 horas en {loc}', cu: 'Hoy la guardia pediátrica más cercana está a más de una hora. Proponemos que el hospital de {loc} tenga pediatra de guardia todos los días.' },
    { t: 4, ti: 'Turnos por teléfono y en ventanilla, no solo por la app', cu: 'Muchas personas mayores no pueden sacar turno en línea. Pedimos un número gratuito y una ventanilla presencial en cada centro de salud.' },
    { t: 3, ti: 'Equipos de salud mental en las escuelas secundarias', cu: 'Proponemos que cada escuela secundaria de {prov} tenga un equipo con psicólogo al menos dos días por semana.' },
    { t: 2, ti: 'Farmacia pública con medicamentos esenciales', cu: 'Una farmacia estatal en {loc} que entregue medicamentos esenciales a bajo costo con receta del sistema público.' },
  ],
  educacion: [
    { t: 3, ti: 'Biblioteca pública abierta hasta las 22 h', cu: 'Estudiantes que trabajan no llegan a usar la biblioteca de {loc}. Proponemos extender el horario de lunes a viernes.' },
    { t: 0, ti: 'Calefacción y mantenimiento de las escuelas antes del invierno', cu: 'Varias escuelas de {loc} empiezan el invierno con estufas rotas. Pedimos un plan de revisión cada marzo.' },
    { t: 4, ti: 'Festival de música joven de {prov}', cu: 'Un festival anual y gratuito con bandas locales menores de 25 años, rotando entre las localidades de la provincia.' },
    { t: 1, ti: 'Sede universitaria en {loc}', cu: 'Los jóvenes de {loc} tienen que mudarse para estudiar. Proponemos una sede con dos carreras vinculadas a la producción local.' },
  ],
  ambiente: [
    { t: 0, ti: 'Puntos verdes de reciclaje en cada barrio de {loc}', cu: 'Contenedores diferenciados y un día fijo de recolección de reciclables por barrio.' },
    { t: 1, ti: 'Monitoreo público de la calidad del agua del río', cu: 'Que los análisis del agua de {loc} se publiquen cada mes en Ágora, con los valores y lo que significan.' },
    { t: 4, ti: 'Paneles solares en edificios públicos de {prov}', cu: 'Instalar paneles en escuelas y hospitales para bajar el gasto en energía y reinvertir el ahorro.' },
    { t: 2, ti: 'Ampliar la reserva natural cercana a {loc}', cu: 'El humedal cercano a {loc} pierde superficie cada año. Proponemos sumarlo al área protegida.' },
  ],
  seguridad: [
    { t: 1, ti: 'Iluminación LED en plazas y paradas de {loc}', cu: 'Hay plazas y paradas de colectivo totalmente oscuras. Pedimos un relevamiento y luminarias LED.' },
    { t: 3, ti: 'Semáforo y senda peatonal frente a la escuela', cu: 'En la avenida principal de {loc}, frente a la escuela, los autos pasan rápido. Pedimos semáforo y reductores.' },
    { t: 2, ti: 'Mesas de seguridad barriales mensuales', cu: 'Reuniones abiertas cada mes entre vecinos y la policía comunitaria de {loc}.' },
  ],
  defensa: [
    { t: 1, ti: 'Sistema de alerta temprana de incendios forestales', cu: 'Torres de vigilancia y alertas por mensaje para las zonas rurales de {prov}.' },
    { t: 0, ti: 'Simulacros de evacuación anuales en {loc}', cu: 'Un simulacro por año en escuelas y edificios públicos, coordinado con protección civil.' },
    { t: 3, ti: 'Capacitación en ciberseguridad para municipios', cu: 'Los municipios de {prov} sufrieron ataques informáticos. Proponemos capacitación y un equipo de respuesta.' },
  ],
  justicia: [
    { t: 0, ti: 'Juzgado de paz itinerante para las zonas rurales', cu: 'Un juzgado de paz que recorra las localidades más alejadas de {prov} una vez por mes.' },
    { t: 3, ti: 'Aviso claro cuando un trámite usa a Elysia', cu: 'Que cada resolución diga si se apoyó en Elysia y cómo pedir revisión humana, en lenguaje simple.' },
    { t: 2, ti: 'Talleres de oficios en la unidad penitenciaria', cu: 'Para favorecer la reinserción, proponemos talleres de oficios con certificación oficial.' },
  ],
  economia: [
    { t: 2, ti: 'Feria permanente de emprendedores en {loc}', cu: 'Un espacio fijo los fines de semana para que emprendedores locales vendan sin pagar alquiler.' },
    { t: 0, ti: 'Programa de primer empleo para jóvenes de {prov}', cu: 'Incentivos a pymes que contraten jóvenes de 18 a 24 años en su primer trabajo formal.' },
    { t: 3, ti: 'Simplificar la tasa municipal para pequeños comercios', cu: 'Una sola tasa fija mensual para comercios de menos de tres empleados.' },
  ],
  agro: [
    { t: 3, ti: 'Mercado de productores familiares en {loc}', cu: 'Venta directa del productor al vecino, sin intermediarios, una vez por semana.' },
    { t: 2, ti: 'Reparación de los canales de riego', cu: 'Los canales que abastecen a {loc} pierden casi la mitad del agua. Pedimos su revestimiento.' },
    { t: 1, ti: 'Plan de reforestación con especies nativas', cu: 'Plantar especies nativas en las zonas taladas de {prov}, con participación de las escuelas.' },
  ],
  transporte: [
    { t: 0, ti: 'Más frecuencias del tren en hora pico', cu: 'El tren que pasa por {loc} va lleno y llega tarde. Proponemos sumar frecuencias de 6 a 9 y de 17 a 20.' },
    { t: 1, ti: 'Colectivo nocturno los fines de semana', cu: 'Después de medianoche no hay colectivos en {loc}. Proponemos una línea nocturna viernes y sábados.' },
    { t: 2, ti: 'Bacheo de la ruta de acceso a {loc}', cu: 'La ruta que conecta {loc} con la capital provincial tiene baches peligrosos. Pedimos repavimentación.' },
    { t: 3, ti: 'Wifi gratuito en plazas y estaciones', cu: 'Conectividad gratuita en espacios públicos de {loc} para reducir la brecha digital.' },
  ],
  exteriores: [
    { t: 1, ti: 'Turnos consulares en línea y por teléfono', cu: 'Los nikienses en el exterior esperan meses un turno. Proponemos un sistema único con atención telefónica.' },
    { t: 0, ti: 'Oficina de apoyo a exportadores de {prov}', cu: 'Asesoramiento gratuito a pymes de {prov} que quieran exportar por primera vez.' },
    { t: 3, ti: 'Ventanilla única para personas migrantes', cu: 'Un lugar en {loc} donde hacer todos los trámites de residencia, con información en varios idiomas.' },
  ],
  social: [
    { t: 0, ti: 'Plan de viviendas cooperativas en {loc}', cu: 'Terrenos fiscales para cooperativas de vivienda, con créditos a tasa baja.' },
    { t: 3, ti: 'Rampas y veredas accesibles en el centro de {loc}', cu: 'Relevar y adaptar las esquinas del centro para personas en silla de ruedas y con cochecitos.' },
    { t: 2, ti: 'Centro de día para personas mayores', cu: 'Un espacio con actividades, comida y acompañamiento para personas mayores que viven solas.' },
    { t: 4, ti: 'Refuerzo alimentario en comedores comunitarios', cu: 'Aumentar las raciones y sumar frutas y verduras de productores locales.' },
  ],
};

/* Debates modelo por nodo */
const DEBATES_MODELO = {
  salud: [['Crítica', 0, 'La guardia del hospital tarda más de 4 horas'], ['Idea', 4, '¿Y si los turnos se confirman por mensaje?'], ['Mejora', 1, 'Que el centro de salud abra los sábados']],
  educacion: [['Crítica', 0, 'Las aulas no tienen ventilación en verano'], ['Idea', 4, 'Muestras de arte de estudiantes en la plaza'], ['Mejora', 2, 'Más capacitación docente en tecnología']],
  ambiente: [['Crítica', 0, 'Basural a cielo abierto cerca del arroyo'], ['Idea', 4, 'Huertas solares comunitarias'], ['Mejora', 1, 'Publicar los análisis del agua']],
  seguridad: [['Crítica', 1, 'Calles sin luz desde hace semanas'], ['Idea', 2, 'Grupos de vecinos con la policía comunitaria'], ['Mejora', 3, 'Controles de velocidad en la avenida']],
  defensa: [['Pregunta', 1, '¿Qué hacemos si hay alerta por tormenta?'], ['Idea', 0, 'Kits de emergencia en escuelas'], ['Mejora', 3, 'Más protección para los datos municipales']],
  justicia: [['Crítica', 0, 'Las causas tardan años en resolverse'], ['Idea', 3, 'Un botón de "pedir revisión humana" en cada trámite'], ['Mejora', 1, 'Más defensores públicos']],
  economia: [['Crítica', 1, 'Los precios en el pueblo son más altos que en la capital'], ['Idea', 2, 'Sello "Hecho en la provincia"'], ['Mejora', 0, 'Bolsa de empleo local en Ágora']],
  agro: [['Crítica', 2, 'El agua de riego no alcanza'], ['Idea', 3, 'Compras públicas a productores familiares'], ['Mejora', 1, 'Control de la tala ilegal']],
  transporte: [['Crítica', 0, 'El tren de las 7:10 llegó tarde toda la semana'], ['Idea', 1, 'Pantallas con el horario real del colectivo'], ['Mejora', 3, 'Mejor señal de celular en la ruta']],
  exteriores: [['Pregunta', 1, '¿Cómo renuevo el pasaporte desde el exterior?'], ['Idea', 2, 'Intercambios estudiantiles con países vecinos'], ['Mejora', 0, 'Menos demoras en la aduana']],
  social: [['Crítica', 0, 'Los alquileres son imposibles'], ['Idea', 1, 'Más espacios recreativos para adolescentes'], ['Mejora', 3, 'Transporte adaptado para personas con discapacidad']],
};

const COMENTARIOS = {
  'Crítica': ['Me pasa lo mismo, ya hice el reclamo dos veces.', 'Coincido, y en mi barrio es peor.', 'Habría que pedir que el nodo informe cuándo se soluciona.', 'Gracias por subirlo, no sabía que era tan común.', 'Propongo convertirlo en iniciativa popular para que el nodo lo trate.'],
  'Idea': ['Muy buena idea, la apoyo.', '¿Cuánto costaría? Estaría bueno que Elysia haga el informe de impacto.', 'En otra provincia se hizo algo parecido y funcionó.', 'Sumaría que se pueda participar también de forma presencial.', 'Me gusta, pero habría que empezar con una prueba piloto.'],
  'Mejora': ['Totalmente, es un cambio chico con mucho impacto.', 'Se podría aplicar primero en la capital provincial y después extender.', 'Apoyo. Que el nodo publique un cronograma.', 'Buena propuesta, aunque hay que ver el presupuesto.'],
  'Pregunta': ['Hasta donde sé, hay información en la sección del nodo.', 'Yo también quisiera saberlo.', 'Lo pueden consultar en el punto de atención presencial del municipio.'],
};

const LEYES_MODELO = {
  salud: ['Ley de Guardias Mínimas Garantizadas', 'Ley de Salud Mental Comunitaria'],
  educacion: ['Ley de Bibliotecas Abiertas', 'Ley de Conectividad Escolar'],
  ambiente: ['Ley de Gestión Integral de Residuos', 'Ley de Protección de Humedales'],
  seguridad: ['Ley de Policía Comunitaria', 'Ley de Seguridad Vial Escolar'],
  defensa: ['Ley de Protección Civil', 'Ley de Ciberdefensa Municipal'],
  justicia: ['Ley de Revisión Humana de Decisiones Automatizadas', 'Ley de Juzgados de Paz Itinerantes'],
  economia: ['Ley de Primer Empleo', 'Ley de Ferias Emprendedoras'],
  agro: ['Ley de Agricultura Familiar', 'Ley de Bosques Nativos'],
  transporte: ['Ley de Transporte Nocturno', 'Ley de Conectividad Rural'],
  exteriores: ['Ley de Atención Consular Digital', 'Ley de Ventanilla Migrante'],
  social: ['Ley de Vivienda Cooperativa', 'Ley de Accesibilidad Urbana'],
};

/* Boletín Oficial: d = días antes de hoy */
const BOLETIN = [
  { d: 0, cat: 'Plenario de Nodos', ti: 'El Plenario aprobó el Presupuesto Nacional 2027', cu: 'Con 41 votos a favor y 12 en contra, el Plenario de Nodos aprobó el presupuesto. El Consejo Federal tiene 30 días para revisarlo. El texto completo ya está en la carpeta Económica de Evanescence.', destacado: true },
  { d: 0, cat: 'Consultas', ti: 'Comienza la deliberación sobre la reforma del Módulo Ambiental', cu: 'Durante 20 días habrá foros abiertos y fuentes plurales sobre la propuesta de incorporar el acceso al agua potable como derecho fundamental. Después se vota en referendo.' },
  { d: 1, cat: 'Prisma', ti: 'Prisma publicó su informe trimestral sobre Elysia', cu: 'El informe revisó 1.204 detecciones de problemas hechas por Elysia. Encontró un sesgo en la clasificación de reclamos rurales, que ya fue corregido con la firma de tres custodios.' },
  { d: 2, cat: 'Nodo de Transportes', ti: 'Nuevo horario de trenes interprovinciales desde el lunes', cu: 'Se suman seis frecuencias diarias entre la capital, Lumina, y Senna. La medida responde a una iniciativa popular que superó el umbral de apoyos.' },
  { d: 4, cat: 'Consejo Federal', ti: 'El Consejo Federal aprobó el reparto de recursos entre regiones', cu: 'Las provincias con menor conectividad recibirán un 12 % adicional para infraestructura digital y puntos de atención presencial.' },
  { d: 6, cat: 'Poder Jurisdiccional', ti: 'El Tribunal Superior declaró inconstitucional una ordenanza municipal', cu: 'La norma usaba datos de Ágora para enviar mensajes políticos personalizados, algo que prohíbe el Módulo de Derechos.' },
  { d: 9, cat: 'Elysia', ti: 'Elysia detectó un vacío normativo sobre drones de reparto', cu: 'El Nodo de Transportes y Comunicaciones tiene 90 días para tratarlo. Cualquier ciudadano puede comentar en el foro del nodo.' },
  { d: 12, cat: 'Nodo de Salud', ti: 'Campaña nacional de vacunación antigripal', cu: 'Las vacunas están disponibles en todos los centros de salud. El turno se pide en Ágora, por teléfono o en ventanilla.' },
];

/* Calendario: día del mes relativo (se ajusta al mes actual) */
const EVENTOS_MES = [
  { dia: 3, tipo: 'sesion', ti: 'Sesión abierta del Plenario de Nodos', lugar: 'Lumen, Lumina · transmisión en Ágora' },
  { dia: 7, tipo: 'consulta', ti: 'Abre la votación de la consulta sobre transporte nocturno', lugar: 'Nacional' },
  { dia: 10, tipo: 'prisma', ti: 'Audiencia pública de Prisma', lugar: 'Lumen, Lumina · presencial y en vivo' },
  { dia: 14, tipo: 'federal', ti: 'Reunión del Consejo Federal', lugar: 'Spiro, Russell' },
  { dia: 18, tipo: 'nodo', ti: 'Audiencia del Nodo de Salud sobre guardias', lugar: 'Todas las provincias' },
  { dia: 21, tipo: 'consulta', ti: 'Cierra la deliberación sobre el Módulo Ambiental', lugar: 'Nacional' },
  { dia: 24, tipo: 'feriado', ti: 'Día de la Lumencracia (feriado nacional)', lugar: 'Todo el país' },
  { dia: 28, tipo: 'elysia', ti: 'Elysia publica el balance mensual de detecciones', lugar: 'Bitácora pública' },
];

const PROGRAMAS = [
  { id: 'horizonte', nombre: 'Horizonte Verde', agrupacion: 'Alianza Ecológica Federal', color: '#3dbb5c',
    lema: 'Un país que cuida su agua, sus bosques y su gente.',
    prioridades: { salud: 70, educacion: 65, ambiente: 95, seguridad: 45, defensa: 30, justicia: 60, economia: 50, agro: 85, transporte: 70, exteriores: 40, social: 65 } },
  { id: 'productiva', nombre: 'Niki Productiva', agrupacion: 'Frente del Trabajo', color: '#f39a1e',
    lema: 'Empleo, rutas y trenes para producir en todo el país.',
    prioridades: { salud: 60, educacion: 70, ambiente: 45, seguridad: 60, defensa: 45, justicia: 50, economia: 95, agro: 75, transporte: 90, exteriores: 70, social: 50 } },
  { id: 'comunidad', nombre: 'Comunidad Primero', agrupacion: 'Movimiento Solidario Nikiense', color: '#ef5a6f',
    lema: 'Nadie se queda afuera: salud, vivienda y educación.',
    prioridades: { salud: 90, educacion: 85, ambiente: 60, seguridad: 50, defensa: 30, justicia: 70, economia: 55, agro: 45, transporte: 55, exteriores: 35, social: 95 } },
  { id: 'red', nombre: 'Red Segura', agrupacion: 'Unión Cívica Nikiense', color: '#3b7fd9',
    lema: 'Orden, justicia rápida y fronteras protegidas.',
    prioridades: { salud: 55, educacion: 55, ambiente: 40, seguridad: 95, defensa: 80, justicia: 85, economia: 65, agro: 50, transporte: 50, exteriores: 60, social: 45 } },
];

/* Consultas: alcance 'nacional' o 'provincial' ({prov} se reemplaza) */
const CONSULTAS_MODELO = [
  { id: 'c-agua', alcance: 'nacional', vinculante: true, estado: 'deliberacion', convoca: 'Plenario de Nodos', nodo: 'ambiente',
    pregunta: '¿Aprobás la reforma del Módulo Ambiental de Evanescence para incorporar el acceso al agua potable como derecho fundamental?',
    opciones: ['Sí', 'No'], base: [61, 39], diasCierre: 12,
    fuentes: ['Informe de impacto de Elysia (no vinculante)', 'Dictamen de la Comisión de Codificación', 'Informe alternativo de la minoría', 'Opinión de universidades públicas'] },
  { id: 'c-nocturno', alcance: 'nacional', vinculante: false, estado: 'votacion', convoca: 'Nodo de Transportes y Comunicaciones', nodo: 'transporte',
    pregunta: '¿Qué debería priorizar el Nodo de Transportes en 2027?',
    opciones: ['Más frecuencias de trenes', 'Colectivos nocturnos', 'Arreglo de rutas', 'Internet en zonas rurales'], base: [34, 22, 27, 17], diasCierre: 5,
    fuentes: ['Datos de uso del transporte público', 'Informe de impacto de Elysia', 'Propuestas de las provincias'] },
  { id: 'c-hospital', alcance: 'provincial', vinculante: true, estado: 'votacion', convoca: 'Nodo de Salud de {prov}', nodo: 'salud',
    pregunta: '¿Dónde debería construirse el nuevo hospital regional de {prov}?',
    opciones: '{localidades}', base: null, diasCierre: 9,
    fuentes: ['Mapa de distancias a centros de salud', 'Informe técnico del Nodo de Salud', 'Informe de impacto de Elysia'] },
  { id: 'c-biblio', alcance: 'provincial', vinculante: false, estado: 'cerrada', convoca: 'Nodo de Educación y Cultura de {prov}', nodo: 'educacion',
    pregunta: '¿Estás de acuerdo con extender el horario de las bibliotecas públicas de {prov} hasta las 22 h?',
    opciones: ['Sí', 'No', 'Solo en época de exámenes'], base: [58, 14, 28], diasCierre: -6,
    fuentes: ['Encuesta de uso de bibliotecas', 'Costos estimados del Nodo'] },
];
