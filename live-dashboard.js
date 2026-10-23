const dashboardSeries = {
  F1: { name: "Fórmula 1", description: "Panel de cronometraje y datos en directo de Fórmula 1.", provider: "F1Dash", url: "https://f1dash.net/dashboard" },
  F2: { name: "Fórmula 2", description: "Sigue la actividad y los resultados oficiales de Fórmula 2.", provider: "FIA · Fórmula 2", url: "https://api.fia.com/events/formula-2-championship/season-2026/standings" },
  F3: { name: "Fórmula 3", description: "Sigue la actividad y los resultados oficiales de Fórmula 3.", provider: "FIA · Fórmula 3", url: "https://api.fia.com/events/fia-formula-3-championship/season-2026/2026-standings" },
  WEC: { name: "WEC", description: "Sigue la actividad y los resultados oficiales del Mundial de Resistencia.", provider: "FIA · WEC", url: "https://api.fia.com/events/world-endurance-championship/season-2026/standings" },
  MotoGP: { name: "MotoGP", description: "Consulta la clasificación oficial de MotoGP.", provider: "MotoGP Stats", url: "https://stats.motogp.com/en/world-standing/2026/MotoGP/RidersChampionship" },
  Moto2: { name: "Moto2", description: "Consulta la clasificación oficial de Moto2.", provider: "MotoGP Stats", url: "https://stats.motogp.com/en/world-standing/2026/Moto2/RidersChampionship" },
  Moto3: { name: "Moto3", description: "Consulta la clasificación oficial de Moto3.", provider: "MotoGP Stats", url: "https://stats.motogp.com/en/world-standing/2026/Moto3/RidersChampionship" },
  Superbikes: { name: "WorldSBK", description: "Consulta la información oficial del campeonato WorldSBK.", provider: "WorldSBK", url: "https://www.worldsbk.com/" }
};

const seriesId = new URLSearchParams(location.search).get("series") || "F1";
const info = dashboardSeries[seriesId] || dashboardSeries.F1;
document.title = `${info.name} · Eventos en directo | Motor Competición`;
document.querySelector("#dashboardTitle").innerHTML = `${info.name === "Fórmula 1" ? "FÓRMULA 1" : info.name.toUpperCase()} <em>EN DIRECTO</em>`;
document.querySelector("#dashboardIntro").textContent = info.description;
document.querySelector("#dashboardProvider").innerHTML = `<p class="eyebrow">PANEL DISPONIBLE</p><h2>${info.provider}</h2><p>${seriesId === "F1" ? "Abre el dashboard interactivo de F1Dash para consultar los datos de carrera." : "Este espacio está preparado para añadir un dashboard específico de la categoría. Mientras tanto, consulta los datos oficiales disponibles."}</p><a class="primary-btn" href="${info.url}" target="_blank" rel="noopener noreferrer">${seriesId === "F1" ? "Abrir dashboard F1Dash" : `Abrir fuente oficial de ${info.name}`} <span>↗</span></a>`;
