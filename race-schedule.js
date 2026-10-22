const params=new URLSearchParams(location.search);
const series=params.get("series")||"F1";
const round=Number(params.get("round"));
const $=selector=>document.querySelector(selector);
const esc=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const seriesNames={F1:"Fórmula 1",F2:"Fórmula 2",F3:"Fórmula 3",WEC:"FIA WEC"};
const officialLinks={F1:"https://www.formula1.com/en/racing/2026",F2:"https://www.fiaformula2.com/en/racing/2026",F3:"https://www.fiaformula3.com/en/racing/2026",WEC:"https://www.fiawec.com/en/page/official-programme"};
const f1EventSlugs={MELBOURNE:"australia",SHANGHAI:"china",SUZUKA:"japan",MIAMI:"miami",MONTREAL:"canada",MONTECARLO:"monaco",BARCELONA:"barcelona-catalunya",SPIELBERG:"austria",SILVERSTONE:"great-britain",SPA:"belgium",BUDAPEST:"hungary",ZANDVOORT:"netherlands",MONZA:"italy",MADRID:"spain",BAKU:"azerbaijan",SINGAPUR:"singapore",AUSTIN:"united-states",MEXICO:"mexico","SÃO PAULO":"brazil","LAS VEGAS":"las-vegas",LUSAIL:"qatar","YAS MARINA":"abu-dhabi"};
const raceAliases={"MELBOURNE":"AUSTRALIAN GP","SHANGHAI":"CHINESE GP","SUZUKA":"JAPANESE GP","MIAMI":"MIAMI GP","MONTREAL":"CANADIAN GP","MONTECARLO":"MONACO GP","BARCELONA":"BARCELONA-CATALUNYA GP","SPIELBERG":"AUSTRIAN GP","SILVERSTONE":"BRITISH GP","SPA-FRANCORCHAMPS":"BELGIAN GP","BUDAPEST":"HUNGARIAN GP","ZANDVOORT":"DUTCH GP","MONZA":"ITALIAN GP","MADRID":"SPANISH GP","BAKU":"AZERBAIJAN GP","SINGAPUR":"SINGAPORE GP","AUSTIN":"UNITED STATES GP","CIUDAD DE MÉXICO":"MEXICO CITY GP","SÃO PAULO":"SÃO PAULO GP","LAS VEGAS":"LAS VEGAS GP","LUSAIL":"QATAR GP","YAS MARINA":"ABU DHABI GP"};
const sessionNames={fp1:"Entrenamientos libres 1",fp2:"Entrenamientos libres 2",fp3:"Entrenamientos libres 3",qualifying:"Clasificación",sprint_qualifying:"Clasificación sprint",sprint_shootout:"Clasificación sprint",sprint:"Sprint",race:"Carrera"};
function normalize(value){return String(value??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase();}
function formatTime(value,zone){const date=new Date(value);if(Number.isNaN(date.getTime()))return "—";const parts=new Intl.DateTimeFormat("es-ES",{timeZone:zone,weekday:"short",day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23",timeZoneName:"shortOffset"}).formatToParts(date);const get=type=>parts.find(part=>part.type===type)?.value||"";const offset=get("timeZoneName").replace("GMT","UTC")||"UTC+0";return get("weekday")+" "+get("day")+" "+get("month")+" · "+get("hour")+":"+get("minute")+" ("+(offset==="UTC"?"UTC+0":offset)+")";}
function renderRows(sessions){const body=$("#scheduleBody");const rows=Object.entries(sessions||{}).filter(([,time])=>time).sort((a,b)=>new Date(a[1])-new Date(b[1]));if(!rows.length)return false;body.innerHTML=rows.map(([key,time])=>'<tr><td>'+esc(sessionNames[key]||key.replaceAll("_"," "))+'</td><td>'+esc(formatTime(time,"Europe/Madrid"))+'</td><td>'+esc(formatTime(time,"Europe/London"))+'</td></tr>').join("");return true;}
async function init(){
  try{
    const response=await fetch("data/site-data.json");if(!response.ok)throw new Error("No se pudo leer el calendario");
    const data=await response.json();const event=(data.calendars?.[series]||[]).find(item=>Number(item.round)===round);
    if(!event)throw new Error("No se encontró la ronda seleccionada");
    $("#scheduleSeries").textContent=(seriesNames[series]||series)+" · TEMPORADA 2026";
    $("#scheduleTitle").innerHTML=esc(event.event);
    $("#scheduleLocation").textContent=event.location+" · "+event.date;
    const locationKey=Object.keys(f1EventSlugs).find(place=>normalize(event.location).includes(normalize(place)));
    $("#officialSchedule").href=series==="F1"&&locationKey?"https://www.formula1.com/en/racing/2026/"+f1EventSlugs[locationKey]:(officialLinks[series]||officialLinks.F1);
    if(series!=="F1"){
      $("#scheduleStatus").textContent="El calendario local no incluye las horas detalladas de estas sesiones. Consulta el programa oficial actualizado.";
      $("#scheduleBody").innerHTML='<tr><td colspan="3">Abre el programa oficial del campeonato para ver las horas de entrenamientos, clasificación y carreras.</td></tr>';
      $("#scheduleSource").innerHTML='Fuente: <a href="'+esc(officialLinks[series])+'" target="_blank" rel="noopener">programa oficial de '+esc(seriesNames[series]||series)+'</a>.';
      return;
    }
    $("#scheduleTitle").innerHTML=esc(event.event);
    $("#scheduleStatus").textContent="Buscando los horarios publicados para esta ronda…";
    const feedResponse=await fetch("https://whenstherace.com/schedule.json");if(!feedResponse.ok)throw new Error("El horario de F1 no está disponible ahora");
    const races=await feedResponse.json();const normalizedLocation=normalize(event.location);const aliasEntry=Object.entries(raceAliases).find(([place])=>normalizedLocation.includes(normalize(place)));const alias=aliasEntry?.[1];
    const race=races.find(item=>normalize(item.name).includes(normalize(alias||"")))||races.find(item=>normalize(item.circuit).includes(normalize(event.location)));
    if(!race||!renderRows({...race.sessions,race:race.sessions?.race||race.utc}))throw new Error("Todavía no se han publicado las sesiones de esta ronda");
    $("#scheduleStatus").textContent="Horas convertidas automáticamente desde UTC.";
    $("#scheduleSource").innerHTML='Fuente: <a href="https://whenstherace.com/schedule.json" target="_blank" rel="noopener">When’s the Race</a>, con datos de <a href="https://github.com/f1db/f1db" target="_blank" rel="noopener">F1DB</a> y <a href="https://github.com/sportstimes/f1" target="_blank" rel="noopener">sportstimes/f1</a> (CC BY 4.0). Fuente independiente, no afiliada a Fórmula 1.';
  }catch(error){
    $("#scheduleStatus").textContent=error.message;
    $("#scheduleBody").innerHTML='<tr><td colspan="3">Abre el programa oficial para consultar las sesiones y sus cambios de última hora.</td></tr>';
    $("#scheduleSource").textContent="Consulta la fuente oficial para verificar los horarios antes de cada sesión.";
  }
}
init();
