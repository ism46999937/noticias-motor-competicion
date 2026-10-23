const liveSeries = [
  { id: "F1", name: "Fórmula 1", label: "F1", dashboard: "https://f1dash.net/dashboard", kind: "external" },
  { id: "F2", name: "Fórmula 2", label: "F2" },
  { id: "F3", name: "Fórmula 3", label: "F3" },
  { id: "WEC", name: "World Endurance Championship", label: "WEC" },
  { id: "MotoGP", name: "MotoGP", label: "MotoGP" },
  { id: "Moto2", name: "Moto2", label: "Moto2" },
  { id: "Moto3", name: "Moto3", label: "Moto3" },
  { id: "Superbikes", name: "WorldSBK", label: "Superbikes" }
];

const liveMonths = { ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11 };
const liveEsc = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

function liveDateRange(dateText) {
  const text = String(dateText || "").toLowerCase();
  let match = text.match(/(\d{1,2})\s*(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)\s*[–-]\s*(\d{1,2})\s*(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)\s*(\d{4})/);
  if (match) return [new Date(+match[5], liveMonths[match[2]], +match[1]), new Date(+match[5], liveMonths[match[4]], +match[3], 23, 59, 59)];
  match = text.match(/(\d{1,2})\s*[–-]\s*(\d{1,2})\s*(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)\s*(\d{4})/);
  if (match) return [new Date(+match[4], liveMonths[match[3]], +match[1]), new Date(+match[4], liveMonths[match[3]], +match[2], 23, 59, 59)];
  match = text.match(/(\d{1,2})\s*(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)\s*(\d{4})/);
  if (match) return [new Date(+match[3], liveMonths[match[2]], +match[1]), new Date(+match[3], liveMonths[match[2]], +match[1], 23, 59, 59)];
  return null;
}

function getSeriesRaces(data, seriesId) {
  const scheduled = data.calendars?.[seriesId];
  if (Array.isArray(scheduled)) return scheduled;
  if (seriesId === "MotoGP" || seriesId === "Moto2" || seriesId === "Moto3" || seriesId === "Superbikes") {
    const motorCalendars = {
      MotoGP: [[1,"Gran Premio de Tailandia","Buriram, Tailandia","27 feb–1 mar 2026"],[2,"Gran Premio de Brasil","Goiânia, Brasil","20–22 mar 2026"],[3,"Gran Premio de las Américas","Austin, Estados Unidos","27–29 mar 2026"],[4,"Gran Premio de Qatar","Lusail, Catar","10–12 abr 2026"],[5,"Gran Premio de España","Jerez, España","24–26 abr 2026"],[6,"Gran Premio de Francia","Le Mans, Francia","8–10 may 2026"],[7,"Gran Premio de Catalunya","Barcelona, España","15–17 may 2026"],[8,"Gran Premio de Italia","Mugello, Italia","29–31 may 2026"],[9,"Gran Premio de Hungría","Balaton Park, Hungría","5–7 jun 2026"],[10,"Gran Premio de Chequia","Brno, Chequia","19–21 jun 2026"],[11,"Gran Premio de Países Bajos","Assen, Países Bajos","26–28 jun 2026"],[12,"Gran Premio de Alemania","Sachsenring, Alemania","10–12 jul 2026"],[13,"Gran Premio del Reino Unido","Silverstone, Reino Unido","7–9 ago 2026"],[14,"Gran Premio de Aragón","MotorLand, España","28–30 ago 2026"],[15,"Gran Premio de San Marino","Misano, Italia","11–13 sep 2026"],[16,"Gran Premio de Japón","Motegi, Japón","2–4 oct 2026"],[17,"Gran Premio de Indonesia","Mandalika, Indonesia","9–11 oct 2026"],[18,"Gran Premio de Australia","Phillip Island, Australia","23–25 oct 2026"],[19,"Gran Premio de Malasia","Sepang, Malasia","30 oct–1 nov 2026"],[20,"Gran Premio de Catar","Lusail, Catar","6–8 nov 2026"],[21,"Gran Premio de Portugal","Portimao, Portugal","20–22 nov 2026"],[22,"Gran Premio de Valencia","Cheste, España","27–29 nov 2026"]],
      Superbikes: [[1,"Ronda de Australia","Phillip Island, Australia","20–22 feb 2026"],[2,"Ronda de Portugal","Portimao, Portugal","27–29 mar 2026"],[3,"Ronda de los Países Bajos","Assen, Países Bajos","17–19 abr 2026"],[4,"Ronda de Hungría","Balaton Park, Hungría","1–3 may 2026"],[5,"Ronda de Chequia","Most, Chequia","15–17 may 2026"],[6,"Ronda de Aragón","MotorLand, España","29–31 may 2026"],[7,"Ronda de Emilia-Romaña","Misano, Italia","12–14 jun 2026"],[8,"Ronda del Reino Unido","Donington Park, Reino Unido","10–12 jul 2026"],[9,"Ronda de Francia","Magny-Cours, Francia","4–6 sep 2026"],[10,"Ronda de Italia","Cremona, Italia","25–27 sep 2026"],[11,"Ronda de Estoril","Estoril, Portugal","9–11 oct 2026"],[12,"Ronda de España","Jerez, España","16–18 oct 2026"]]
    };
    return (motorCalendars[seriesId] || motorCalendars.MotoGP).map(([round, event, location, date]) => ({ round, event, location, date }));
  }
  return [];
}

function renderLiveEvents(data) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const entries = liveSeries.map(series => {
    const races = getSeriesRaces(data, series.id).map(race => ({ ...race, range: liveDateRange(race.date) })).filter(race => race.range);
    const current = races.find(race => today >= race.range[0] && today <= race.range[1]);
    const next = current || races.find(race => race.range[1] >= today);
    return { ...series, race: next, isCurrent: Boolean(current) };
  });
  const container = document.querySelector("#liveEvents");
  container.innerHTML = entries.map(item => {
    const eventTitle = item.race ? liveEsc(item.race.event) : "Temporada finalizada";
    const eventDetail = item.race ? `${liveEsc(item.race.location)} · ${liveEsc(item.race.date)}` : "No quedan citas pendientes en el calendario 2026.";
    const destination = `live-dashboard.html?series=${encodeURIComponent(item.id)}`;
    const action = item.dashboard
      ? `<a class="live-card-action" href="${liveEsc(destination)}">Abrir panel <span>↗</span></a>`
      : `<a class="live-card-action" href="${liveEsc(destination)}">Ver eventos <span>↗</span></a>`;
    return `<article class="live-card ${item.isCurrent ? "is-current" : ""}"><div class="live-card-top"><span>${liveEsc(item.label)}</span>${item.isCurrent ? '<span class="live-status"><i></i> Fin de semana en curso</span>' : ""}</div><h3>${eventTitle}</h3><p>${eventDetail}</p>${action}</article>`;
  }).join("");
  document.querySelector("#liveUpdated").textContent = `Calendario consultado · ${new Date().toLocaleDateString("es-ES")}`;
}

fetch("data/site-data.json").then(response => { if (!response.ok) throw new Error("No se pudieron cargar los calendarios"); return response.json(); })
  .then(renderLiveEvents)
  .catch(() => { document.querySelector("#liveEvents").innerHTML = '<p class="live-loading">No se han podido cargar los calendarios. Recarga la página para intentarlo de nuevo.</p>'; });

document.querySelector("#menuToggle").addEventListener("click", event => {
  const expanded = event.currentTarget.getAttribute("aria-expanded") === "true";
  event.currentTarget.setAttribute("aria-expanded", String(!expanded));
  document.querySelector("#mainNav").classList.toggle("open", !expanded);
});
