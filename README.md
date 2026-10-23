# Noticias de Motor Competición

Web en español para F1, F2, F3, WEC, MotoGP, Moto2, Moto3 y WorldSBK (Superbikes), construida con HTML, CSS y JavaScript. El repositorio incluye PHP como base opcional para un alojamiento con servidor; **GitHub Pages no ejecuta PHP**.

## Publicación en GitHub Pages
1. Abre **Settings → Pages** en el repositorio.
2. En **Build and deployment**, selecciona **GitHub Actions** como fuente.
3. En **Actions**, comprueba que el workflow **Deploy website to GitHub Pages** finalice correctamente.
4. La URL pública aparecerá en Settings → Pages y en el resumen del workflow.

El workflow publica solo el frontend estático y el JSON de datos. No publica ni ejecuta `api.php`. Cada cambio en `main` dispara un nuevo despliegue.

## Datos conectados
- Calendarios de F1, F2, F3 y WEC transcritos de publicaciones oficiales FIA de 2026, incluidos los cambios anunciados para F2 en Miami y Montreal. La aplicación también muestra los calendarios 2026 de MotoGP/Moto2/Moto3 y WorldSBK desde sus publicaciones oficiales.
- La alineación de 2027 incluye pilotos anunciados oficialmente de MotoGP, Moto2, Moto3 y WorldSBK; deja las plazas sin confirmar visibles como pendientes.
- Los estados de las rondas se calculan en el navegador según la fecha actual.
- Un workflow diario actualiza clasificaciones de F1 con la API pública Jolpica (compatible con Ergast), F2/F3/WEC con las fuentes FIA disponibles y MotoGP/Moto2/Moto3 con las tablas oficiales de MotoGP Stats. Cada campeonato solo sustituye sus datos si la fuente devuelve una tabla plausible; si falla, conserva la última tabla válida. WorldSBK conserva la última clasificación oficial verificada mientras no haya un endpoint de clasificación legible para la sincronización automática.
- Las tablas se refrescan desde fuentes oficiales cuando están disponibles; las clasificaciones guardadas se conservan si una fuente falla o cambia de formato.
- El importador diario recoge titulares y extractos breves del RSS público de la FIA y de las secciones oficiales de noticias de MotoGP.com. MotoGP se toma de su sección dedicada; las noticias del carril conjunto Moto2/Moto3 se asignan cuando el titular identifica la categoría o menciona pilotos de su clasificación. Publica fecha, atribución y enlace original; si una fuente falla o no hay artículos clasificables, conserva las noticias anteriores de esas categorías.

## Fuentes oficiales de calendarios
- Calendarios FIA 2026: https://www.fia.com/news/2026-fia-sporting-calendars-approved-world-motor-sport-council
- Calendario F1 oficial: https://www.formula1.com/en/racing/2026
- Calendario F2 revisado (Miami y Montreal): https://www.fia.com/news/miami-and-montreal-host-fia-formula-2-championship-rounds-2026
- Calendario F3: https://api.fia.com/news/fia-formula-3-championship-2026-season-calendar-revealed
- API pública de resultados F1 (licencia CC BY-NC-SA 4.0; revisar condiciones si la web se monetiza): https://api.jolpi.ca/ergast/f1/2026/driverStandings.json
- Clasificación oficial F1 FIA: https://api.fia.com/events/fia-formula-one-world-championship/season-2026/2026-classifications
- Clasificación oficial WEC FIA: https://api.fia.com/events/world-endurance-championship/season-2026/standings

## Desarrollo local
Los estilos se mantienen en `styles.scss`; antes de publicar cambios de estilo, regenera `styles.css`:
```bash
sass --no-source-map styles.scss styles.css
```

Para probar el frontend estático:
```bash
python3 -m http.server 8000
```
Abre http://localhost:8000. Para comprobar el endpoint PHP opcional, desde la carpeta del proyecto:
```bash
php -S localhost:8001
```

La página de horarios del Gran Premio convierte las sesiones de F1 a las zonas horarias de Madrid y Londres. Usa el feed de sesiones de When’s the Race (CC BY 4.0; atribución visible en la página). F2, F3 y WEC enlazan a sus programas oficiales porque el JSON local aún no contiene horarios de sesión para esos campeonatos.

## Limitaciones y siguientes pasos
- Para la publicación estática, el JSON debe estar disponible públicamente; nunca pongas claves privadas en `data/site-data.json` ni en JavaScript.
- La sincronización de clasificaciones F1 y titulares FIA se ejecuta diariamente y se puede lanzar manualmente desde Actions. La publicación estática también tiene un horario diario para recoger el JSON actualizado. Para actualizar inmediatamente tras cada carrera, ajusta la frecuencia o añade un trigger de calendario de eventos.
- Hay que confirmar la cobertura real de la API Jolpica para la temporada 2026 una vez que el proveedor publique sus datos.
- Revisar periódicamente cobertura y cambios de formato de las fuentes oficiales, especialmente en categorías con tablas de resultados dinámicas.
- La actualización automática de noticias requiere integrar feeds permitidos, conservar atribución y enlazar a los artículos originales; no se reproducen artículos completos.
