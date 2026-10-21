# Noticias de Motor Competición

Web de inicio para noticias, calendarios y clasificaciones de F1, F2, F3 y WEC con HTML, CSS, JavaScript y PHP.

## Archivos
- `index.html`: estructura y secciones de la web.
- `styles.css`: diseño responsive.
- `app.js`: filtros, tablas y carga de datos desde PHP.
- `api.php`: endpoint JSON del servidor.
- `data/site-data.json`: datos que se pueden completar con información verificada.

## Ejecutar en local
Necesitas PHP 8 o superior. Desde la carpeta del proyecto:
```bash
php -S localhost:8000
```
Abre `http://localhost:8000`.

## Automatización real de resultados
La web **todavía no recibe resultados oficiales automáticamente**. Para activarlo:
1. Selecciona un proveedor de datos con cobertura confirmada para cada categoría (F1, F2, F3 y WEC). Revisa condiciones de uso, coste y límites de llamadas.
2. Configura sus credenciales como variables de entorno del servidor; nunca las pongas en JavaScript ni las subas a GitHub.
3. Añade un proceso del lado del servidor que consulte resultados y standings después de cada evento y/o con una tarea programada (cron).
4. Valida respuestas, registra la hora de actualización, conserva la última copia válida si falla la API y muestra el estado de sincronización.
5. Comprueba pilotos/equipos y categorías Hypercar y LMGT3 del WEC por separado.

Este proyecto evita deliberadamente inventar puntos o fechas. Las tablas vacías y el texto de estado indican que la fuente aún no está configurada.

## Calendarios 2026
No se han rellenado fechas no verificadas. Añade rondas tras contrastarlas con las webs oficiales de cada campeonato:
- F1: https://www.formula1.com/
- F2: https://www.fiaformula2.com/
- F3: https://www.fiaformula3.com/
- WEC: https://www.fiawec.com/

## Noticias y atribución
La página ofrece enlaces a SoyMotor, Motorsport.com España, Autosport, MARCA Motor, AS Motor y FIA. Para mostrar automáticamente titulares, integra RSS/API oficial cuando esté disponible y permitido por las condiciones del medio. No raspes ni reproduzcas artículos completos; conserva atribución, fecha y enlace al original.

## Publicación
El frontend estático puede alojarse en GitHub Pages, pero **PHP no se ejecuta en GitHub Pages**. Para usar `api.php`, aloja el proyecto en un servidor compatible con PHP (o usa un backend separado). No se ha desplegado ni publicado nada desde este paquete.