# Noticias de Motor Competición

Web en español para F1, F2, F3 y WEC, construida con HTML, CSS y JavaScript. El repositorio incluye PHP como base opcional para un alojamiento con servidor; **GitHub Pages no ejecuta PHP**.

## Publicación en GitHub Pages
1. Abre **Settings → Pages** en el repositorio.
2. En **Build and deployment**, selecciona **GitHub Actions** como fuente.
3. En **Actions**, comprueba que el workflow **Deploy website to GitHub Pages** finalice correctamente.
4. La URL pública aparecerá en Settings → Pages y en el resumen del workflow.

El workflow publica solo el frontend estático y el JSON de datos. No publica ni ejecuta `api.php`. Cada cambio en `main` dispara un nuevo despliegue.

## Datos conectados
- Calendarios de F1, F2, F3 y WEC transcritos de publicaciones oficiales FIA de 2026, incluidos los cambios anunciados para F2 en Miami y Montreal.
- Los estados de las rondas se calculan en el navegador según la fecha actual.
- Un workflow programado consulta la API pública Jolpica (compatible con Ergast) para obtener las clasificaciones de pilotos y constructores de F1 de 2026. Si la API no responde o aún no tiene datos, conserva los datos existentes en lugar de publicar puntos inventados.
- Las clasificaciones de F2, F3 y WEC aún requieren una API o feed autorizado específico; no se inventan posiciones ni puntos.
- Las noticias automáticas siguen pendientes de una fuente RSS/API compatible y con condiciones de uso adecuadas. De momento se ofrecen enlaces a las fuentes.

## Fuentes oficiales de calendarios
- Calendarios FIA 2026: https://www.fia.com/news/2026-fia-sporting-calendars-approved-world-motor-sport-council
- Calendario F1 oficial: https://www.formula1.com/en/racing/2026
- Calendario F2 revisado (Miami y Montreal): https://www.fia.com/news/miami-and-montreal-host-fia-formula-2-championship-rounds-2026
- Calendario F3: https://api.fia.com/news/fia-formula-3-championship-2026-season-calendar-revealed
- API pública de resultados F1: https://api.jolpi.ca/ergast/f1/2026/driverStandings.json

## Desarrollo local
Para probar el frontend estático:
```bash
python3 -m http.server 8000
```
Abre http://localhost:8000. Para comprobar el endpoint PHP opcional, desde la carpeta del proyecto:
```bash
php -S localhost:8001
```

## Limitaciones y siguientes pasos
- Para la publicación estática, el JSON debe estar disponible públicamente; nunca pongas claves privadas en `data/site-data.json` ni en JavaScript.
- La sincronización F1 se ejecuta semanalmente y se puede lanzar manualmente desde Actions. Para actualizar inmediatamente tras cada carrera, ajusta la frecuencia o añade un trigger de calendario de eventos.
- Hay que confirmar la cobertura real de la API Jolpica para la temporada 2026 una vez que el proveedor publique sus datos.
- Antes de mostrar resultados de F2/F3/WEC, conectar una API autorizada y validar esquema, cobertura y condiciones de licencia.
- La actualización automática de noticias requiere integrar feeds permitidos, conservar atribución y enlazar a los artículos originales; no se reproducen artículos completos.
