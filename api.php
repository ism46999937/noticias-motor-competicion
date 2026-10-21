<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
/**
 * API sencilla para la web. En este starter NO se inventan resultados ni calendarios.
 * Configura fuentes autorizadas y credenciales en variables de entorno del servidor.
 * No publiques claves API en app.js ni en el repositorio.
 */
$action = $_GET['action'] ?? 'all';
$dataFile = __DIR__ . '/data/site-data.json';
$stored = ['news'=>[], 'calendars'=>['F1'=>[],'F2'=>[],'F3'=>[],'WEC'=>[]], 'standings'=>[], 'updatedAt'=>null];
if (is_file($dataFile)) {
  $parsed = json_decode((string)file_get_contents($dataFile), true);
  if (is_array($parsed)) $stored = array_replace_recursive($stored, $parsed);
}
if ($action === 'health') {
  echo json_encode(['ok'=>true,'message'=>'PHP activo; las fuentes de datos aún deben configurarse.','updatedAt'=>$stored['updatedAt']], JSON_UNESCAPED_UNICODE);
  exit;
}
echo json_encode($stored, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);