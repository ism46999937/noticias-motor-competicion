(() => {
  const translations = [
    ["La actualidad, a fondo.", "The latest, in depth."],
    ["Tu agenda de carreras, noticias y clasificaciones de F1 a MotoGP, WEC y Superbikes. Elige qué sigues y consulta las fechas y fuentes oficiales desde un mismo sitio.", "Your race calendar, news and standings for F1, MotoGP, WEC and Superbikes. Choose what you follow and check dates and official sources in one place."],
    ["Configurar mi agenda", "Set up my calendar"],
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
    ["Datos no disponibles", "Data unavailable"],
    ["Titulares oficiales", "Official headlines"],
    ["No hay titulares en el último feed disponible", "No headlines in the latest available feed"],
    ["No hay titulares recientes de ", "No recent headlines for "],
    ["en el feed oficial", "in the official feed"],
    ["FUENTES OFICIALES", "OFFICIAL SOURCES"],
    ["ACTUALIDAD", "LATEST"],
    ["Noticias de motor", "Motorsport news"],
    ["Leer en la fuente", "Read at source"],
    ["Web oficial", "Official website"],
    ["No hay rondas publicadas para este campeonato.", "No rounds published for this championship."],
    ["Celebrado", "Completed"],
    ["Próximo", "Upcoming"],
    ["Calendario 2026 de fuente oficial. Revisa cambios de última hora en la web: ", "2026 calendar from official sources. Check the website for last-minute changes: "],
    ["Todavía no hay una tabla verificada para esta categoría. Consulta la clasificación oficial en el enlace inferior.", "There is no verified table for this category yet. Check the official standings using the link below."],
    ["Datos consultados: ", "Data checked: "],
    ["Sin sincronización de esta categoría", "This category has not been synced"],
    ["Datos de la última clasificación cargada. ", "Data from the latest loaded standings. "],
    ["Sin tabla local verificada todavía. ", "No verified local table yet. "],
    ["Comprueba cualquier cambio en ", "Check for changes in "],
    ["la clasificación oficial de ", "the official standings for "],
    ["Aún no hay pilotos confirmados para 2027 en esta categoría.", "No drivers have been confirmed for this category in 2027 yet."],
    ["piloto confirmado", "confirmed driver"],
    ["pilotos confirmados", "confirmed drivers"],
    [" equipo", " team"],
    [" temporada 2027", " 2027 season"],
    ["Piloto 1", "Driver 1"],
    ["Piloto 2", "Driver 2"],
    ["Piloto 3", "Driver 3"],
    ["Piloto 4", "Driver 4"],
    ["Piloto 5", "Driver 5"],
    ["Piloto 6", "Driver 6"],
    ["Equipo", "Team"],
    ["Situación", "Status"],
    ["Por confirmar", "To be confirmed"],
    ["Pilotos confirmados", "Confirmed drivers"],
    ["Alineación confirmada", "Line-up confirmed"],
    ["Un asiento pendiente", "One seat pending"],
    [" asientos pendientes", " seats pending"],
    ["Fuente", "Source"],
    ["Sin anuncios confirmados todavía", "No confirmed announcements yet"],
    ["Cuando los equipos publiquen sus pilotos para 2027, aparecerán aquí con su fuente oficial.", "When teams announce their 2027 drivers, they will appear here with their official source."],
    ["Web oficial de ", "Official website for "],
    ["Panel de cronometraje y datos en directo de Fórmula 1.", "Live timing and data dashboard for Formula 1."],
    ["Sigue la actividad y los resultados oficiales de Fórmula 2.", "Follow Formula 2 activity and official results."],
    ["Sigue la actividad y los resultados oficiales de Fórmula 3.", "Follow Formula 3 activity and official results."],
    ["Cargando datos…", "Loading data…"],
    ["No se han encontrado eventos", "No events found"],
    ["Ver detalles", "View details"],
    ["Consulta el horario oficial", "Check the official schedule"],
    ["Abrir fuente oficial", "Open official source"],
    ["Mi agenda", "My calendar"],
    ["Elige las categorías que sigues", "Choose the series you follow"],
    ["Añadir carreras al calendario", "Add races to calendar"],
    ["Guardar mis preferencias con una cuenta", "Save my preferences with an account"],
    ["Las fechas reflejan el fin de semana del evento, no la hora de la primera sesión. Consulta el enlace oficial de cada prueba para confirmar horarios y cambios.", "Dates show the race weekend, not the first session time. Check each event’s official link for session times and changes."],
    ["Iniciar sesión", "Sign in"],
    ["Tu cuenta", "Your account"],
    ["Crea tu cuenta", "Create your account"],
    ["Regístrate para guardar tus categorías y preferencias de avisos entre dispositivos. Las cuentas requieren el servicio PHP del sitio.", "Register to save your series and alert preferences across devices. Accounts require the site’s PHP service."],
    ["Correo electrónico", "Email address"],
    ["Contraseña", "Password"],
    ["Mínimo 12 caracteres.", "At least 12 characters."],
    ["Crear cuenta", "Create account"],
    ["Ya tengo cuenta", "I already have an account"],
    ["Categorías para tu agenda", "Series for your calendar"],
    ["Avisos mientras la app está abierta", "Alerts while the app is open"],
    ["Avisarme al comenzar el fin de semana de carrera", "Alert me when a race weekend begins"],
    ["Avisarme si se actualiza el panel de noticias", "Alert me when the news feed updates"],
    ["Ocultar resultados para evitar spoilers", "Hide results to avoid spoilers"],
    ["Antelación", "Reminder lead time"],
    ["15 minutos", "15 minutes"],
    ["30 minutos", "30 minutes"],
    ["1 hora", "1 hour"],
    ["Guardar preferencias", "Save preferences"],
    ["Cerrar sesión", "Sign out"],
    ["Eliminar mi cuenta", "Delete my account"],
    ["Al crear una cuenta se almacenan tu correo, una contraseña protegida mediante hash y tus preferencias.", "Creating an account stores your email, a hashed password and your preferences."],
    ["Leer privacidad y eliminación de cuenta", "Read privacy and account deletion details"],
    ["Equipos que quieres seguir", "Teams you want to follow"],
    ["Se usan para priorizar avisos de noticias. Las listas cambian según los datos cargados.", "Used to prioritize news alerts. Team lists depend on the loaded data."],
    ["Elige categorías para cargar equipos.", "Choose series to load teams."],
    ["Sesión iniciada como ", "Signed in as "],
    ["Preferencias guardadas en tu cuenta. Los avisos del navegador funcionan mientras la app está abierta.", "Preferences saved to your account. Browser alerts work while the app is open."],
    ["La sesión de seguridad ha caducado. Recarga la página.", "The security session has expired. Reload the page."],
    ["El servidor de cuentas no está disponible. GitHub Pages no ejecuta PHP; se necesita alojar api.php en un servidor PHP.", "The account service is unavailable. GitHub Pages does not run PHP; api.php must be hosted on a PHP server."]
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
    window.dispatchEvent(new CustomEvent("site-language-change", { detail: { language } }));
    translateTree(document.body);
    document.querySelectorAll("[data-ui-language]").forEach(button => { button.classList.toggle("active", button.dataset.uiLanguage === language); button.setAttribute("aria-pressed", String(button.dataset.uiLanguage === language)); });
    const title = document.title;
    document.title = translateString(title);
  }
  function addPicker() {
    const header = document.querySelector(".site-header");
    if (!header || document.getElementById("languagePicker")) return;
    const wrap = document.createElement("div");
    wrap.className = "language-switch";
    wrap.id = "languagePicker";
    wrap.innerHTML = '<span class="language-label">Idioma / Language</span><button type="button" class="language-button" data-ui-language="es" aria-label="Cambiar a castellano" title="Castellano">🇪🇸</button><button type="button" class="language-button" data-ui-language="en" aria-label="Switch to English" title="English">🇬🇧</button>';
    const nav = header.querySelector("nav");
    header.appendChild(wrap);
    wrap.querySelectorAll("[data-ui-language]").forEach(button => button.addEventListener("click", () => setLanguage(button.dataset.uiLanguage)));
    document.addEventListener("news-language-select", event => {
      if (event.detail?.language === "es" || event.detail?.language === "en") setLanguage(event.detail.language);
    });
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
          if (node.nodeType === 3) {
            const translated = translateString(node.nodeValue);
            if (translated !== node.nodeValue) node.nodeValue = translated;
          }
          else if (node.nodeType === 1) translateTree(node);
        });
        else if (record.type === "characterData") {
          const translated = translateString(record.target.nodeValue);
          if (translated !== record.target.nodeValue) record.target.nodeValue = translated;
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
