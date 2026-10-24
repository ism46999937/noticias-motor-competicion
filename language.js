(() => {
  const translations = [
    ["La actualidad, a fondo.", "The latest, in depth."],
    ["Noticias, calendarios y clasificaciones de Fórmula 1, Fórmula 2, Fórmula 3, WEC y motociclismo.", "News, calendars and standings for Formula 1, Formula 2, Formula 3, WEC and motorcycle racing."],
    ["Eventos en directo", "Live events"],
    ["Calendario 2026", "2026 calendar"],
    ["Clasificaciones", "Standings"],
    ["Alineación 2027", "2027 line-up"],
    ["Noticias destacadas", "Featured news"],
    ["LO ÚLTIMO", "LATEST NEWS"],
    ["MOTORSPORT · TEMPORADA 2026", "MOTORSPORT · 2026 SEASON"],
    ["La pasión", "The passion"],
    ["LA PASIÓN", "THE PASSION"],
    ["NO TIENE", "HAS NO"],
    ["LÍMITES.", "LIMITS."],
    ["Actualidad, análisis y resultados de la Fórmula 1, F2, F3 y el Mundial de Resistencia.", "News, analysis and results from Formula 1, F2, F3 and the World Endurance Championship."],
    ["Explorar actualidad", "Explore the latest"],
    ["COBERTURA", "COVERAGE"],
    ["LO ÚLTIMO", "LATEST NEWS"],
    ["Todo", "All"],
    ["Cargando fuentes…", "Loading sources…"],
    ["Los titulares y extractos pertenecen a sus fuentes originales. Consulta cada medio para leer el artículo completo.", "Headlines and excerpts belong to their original sources. Visit each outlet to read the full article."],
    ["GUARDA LA FECHA", "SAVE THE DATE"],
    ["Fechas sujetas a cambios oficiales", "Dates subject to official changes"],
    ["Todas las rondas", "All rounds"],
    ["Próximas", "Upcoming"],
    ["Celebradas", "Completed"],
    ["RONDA", "ROUND"],
    ["EVENTO", "EVENT"],
    ["CIRCUITO / PAÍS", "CIRCUIT / COUNTRY"],
    ["FECHAS", "DATES"],
    ["ESTADO", "STATUS"],
    ["Calendario inicial de estructura. Las fechas deben verificarse contra el calendario oficial antes de publicarse como definitivas.", "Initial calendar structure. Dates must be checked against the official calendar before being published as final."],
    ["LA LUCHA POR EL TÍTULO", "THE TITLE FIGHT"],
    ["Datos de demostración", "Demo data"],
    ["Pilotos", "Drivers"],
    ["Equipos / constructores", "Teams / constructors"],
    ["Categoría", "Class"],
    ["Transparencia de datos", "Data transparency"],
    ["Las filas de muestra no son una clasificación oficial. Para automatizar resultados es necesario configurar una API o fuente autorizada.", "Sample rows are not official standings. An API or authorised source must be configured to automate results."],
    ["PRÓXIMA TEMPORADA", "NEXT SEASON"],
    ["Solo anuncios confirmados oficialmente", "Officially confirmed announcements only"],
    ["Los asientos sin nombre siguen pendientes de anuncio. Consulta la fuente enlazada en cada fila; la parrilla se irá completando conforme se publiquen nuevas confirmaciones.", "Seats without a name are awaiting confirmation. Check the linked source in each row; the grid will be updated as new announcements are made."],
    ["PERIODISMO Y DATOS", "JOURNALISM & DATA"],
    ["Fuentes de referencia", "Reference sources"],
    ["Actualidad en español", "Spanish-language news"],
    ["Noticias internacionales", "International news"],
    ["Motor británico y global", "British and global motorsport"],
    ["Información deportiva", "Sports coverage"],
    ["Reglamentos y fuentes oficiales", "Regulations and official sources"],
    ["Se muestran enlaces a los medios. La carga automática de titulares requiere RSS/API disponible y compatible con las condiciones de cada fuente; no se copian artículos completos.", "Links to media outlets are provided. Automatic headlines require an available RSS/API compatible with each source's terms; full articles are not copied."],
    ["Proyecto independiente · Temporada 2026", "Independent project · 2026 season"],
    ["Fuentes y transparencia ↑", "Sources & transparency ↑"],
    ["EN PISTA · TEMPORADA 2026", "ON TRACK · 2026 SEASON"],
    ["Sigue las próximas citas de cada campeonato y abre su panel de seguimiento.", "Follow upcoming rounds for each championship and open its live dashboard."],
    ["SELECCIONA UNA CATEGORÍA", "SELECT A CATEGORY"],
    ["Próximas carreras", "Upcoming races"],
    ["Consultando calendarios…", "Checking calendars…"],
    ["Cargando eventos…", "Loading events…"],
    ["Las fechas indican el fin de semana de competición. Los paneles y cronometrajes pueden depender de servicios externos.", "Dates refer to the race weekend. Dashboards and timing may depend on external services."],
    ["Volver a la portada ↑", "Back to home ↑"],
    ["← Eventos en directo", "← Live events"],
    ["PANEL DE CAMPEONATO", "CHAMPIONSHIP DASHBOARD"],
    ["DASHBOARD", "DASHBOARD"],
    ["EN DIRECTO", "LIVE"],
    ["Sigue la acción del campeonato seleccionado.", "Follow the action from the selected championship."],
    ["← Volver a eventos en directo", "← Back to live events"],
    ["Horarios del Gran Premio", "Grand Prix schedule"],
    ["← Volver al calendario", "← Back to calendar"],
    ["← Calendario 2026", "← 2026 calendar"],
    ["GRAN PREMIO · TEMPORADA 2026", "GRAND PRIX · 2026 SEASON"],
    ["Cargando horarios", "Loading schedule"],
    ["PROGRAMA DE SESIONES", "SESSION SCHEDULE"],
    ["Horarios del fin de semana", "Weekend schedule"],
    ["Cargando programa…", "Loading schedule…"],
    ["SESIÓN", "SESSION"],
    ["HORA MADRID", "MADRID TIME"],
    ["HORA LONDRES", "LONDON TIME"],
    ["Se muestra la hora local con su desfase UTC vigente en la fecha de cada sesión. En invierno, Madrid es UTC+1 y Londres UTC+0.", "Local times are shown with the UTC offset in effect on each session date. In winter, Madrid is UTC+1 and London is UTC+0."],
    ["Abrir horario del campeonato", "Open championship schedule"],
    ["Noticias", "News"],
    ["Fuentes", "Sources"],
    ["Instalar app", "Install app"],
    ["MOTOGP", "MOTOGP"],
    ["Clasificación", "Standings"],
    ["Pos.", "Pos."],
    ["NOMBRE", "NAME"],
    ["EQUIPO", "TEAM"],
    ["PTS.", "PTS."],
    ["No hay datos disponibles", "No data available"],
    ["Sin datos", "No data"],
    ["Pendiente de confirmación", "Awaiting confirmation"],
    ["Próxima carrera", "Next race"],
    ["Fin de semana", "Race weekend"],
    ["Sin evento próximo confirmado", "No upcoming event confirmed"],
    ["Abrir panel", "Open dashboard"],
    ["Ver horario", "View schedule"],
    ["Fuente oficial", "Official source"],
    ["Confirmado", "Confirmed"],
    ["Pendiente", "Pending"],
    ["Celebrado", "Completed"],
    ["En directo", "Live"],
    ["Próximamente", "Upcoming"],
    ["No se han encontrado noticias", "No news found"],
    ["No hay carreras próximas disponibles", "No upcoming races available"],
    ["Datos no disponibles", "Data unavailable"]
  ];
  const esToEn = new Map(translations);
  const enToEs = new Map(translations.map(([es, en]) => [en, es]));
  let language = "es";
  const translateString = value => {
    let output = value;
    const map = language === "en" ? esToEn : enToEs;
    for (const [from, to] of map) output = output.split(from).join(to);
    return output;
  };
  const skipTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT", "CODE"]);
  function translateTree(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) if (!skipTags.has(walker.currentNode.parentElement?.tagName)) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const translated = translateString(node.nodeValue);
      if (translated !== node.nodeValue) node.nodeValue = translated;
    });
    if (root.nodeType === 1) {
      for (const attr of ["placeholder", "title", "aria-label"]) {
        if (root.hasAttribute?.(attr)) {
          const value = root.getAttribute(attr);
          const translated = translateString(value);
          if (value !== translated) root.setAttribute(attr, translated);
        }
      }
      root.querySelectorAll?.("[placeholder], [title], [aria-label]").forEach(el => {
        for (const attr of ["placeholder", "title", "aria-label"]) {
          if (el.hasAttribute(attr)) el.setAttribute(attr, translateString(el.getAttribute(attr)));
        }
      });
    }
  }
  function setLanguage(next) {
    language = next === "en" ? "en" : "es";
    document.documentElement.lang = language;
    document.documentElement.setAttribute("data-language", language);
    try { localStorage.setItem("mc-language", language); } catch (_) {}
    translateTree(document.body);
    const picker = document.getElementById("languagePicker");
    if (picker) picker.value = language;
    const title = document.title;
    document.title = translateString(title);
  }
  function addPicker() {
    const header = document.querySelector(".site-header");
    if (!header || document.getElementById("languagePicker")) return;
    const wrap = document.createElement("div");
    wrap.className = "language-switch";
    wrap.innerHTML = '<label class="language-label" for="languagePicker">Idioma / Language</label><select id="languagePicker" aria-label="Select language"><option value="es">🇪🇸 Español</option><option value="en">🇬🇧 English</option></select>';
    const nav = header.querySelector("nav");
    header.appendChild(wrap);
    wrap.querySelector("select").addEventListener("change", event => setLanguage(event.target.value));
  }
  function init() {
    addPicker();
    let saved = "es";
    try { saved = localStorage.getItem("mc-language") || "es"; } catch (_) {}
    setLanguage(saved);
    const observer = new MutationObserver(records => {
      if (language !== "en") return;
      records.forEach(record => {
        if (record.type === "childList") record.addedNodes.forEach(node => {
          if (node.nodeType === 3) node.nodeValue = translateString(node.nodeValue);
          else if (node.nodeType === 1) translateTree(node);
        });
        else if (record.type === "characterData") record.target.nodeValue = translateString(record.target.nodeValue);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();