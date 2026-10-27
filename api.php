<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, private');
header('X-Content-Type-Options: nosniff');

function respond(array $body, int $status = 200): never {
  http_response_code($status);
  echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

function private_store_path(): string {
  $configured = getenv('MC_PRIVATE_DIR');
  if (!$configured) throw new RuntimeException('El servidor aún no ha configurado el almacenamiento privado de cuentas.');
  if (!is_dir($configured) && !mkdir($configured, 0700, true) && !is_dir($configured)) throw new RuntimeException('No se pudo preparar el almacenamiento privado.');
  $directory = realpath($configured);
  $documentRoot = isset($_SERVER['DOCUMENT_ROOT']) ? realpath((string)$_SERVER['DOCUMENT_ROOT']) : false;
  if (!$directory || ($documentRoot && ($directory === $documentRoot || str_starts_with($directory, rtrim($documentRoot, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR)))) {
    throw new RuntimeException('MC_PRIVATE_DIR debe estar fuera del directorio público del sitio.');
  }
  return $directory . DIRECTORY_SEPARATOR . 'accounts.json';
}

function account_store(callable $operation): mixed {
  $path = private_store_path();
  $handle = fopen($path, 'c+');
  if (!$handle) throw new RuntimeException('No se pudo abrir el almacén privado de cuentas.');
  @chmod($path, 0600);
  try {
    if (!flock($handle, LOCK_EX)) throw new RuntimeException('No se pudo bloquear el almacén de cuentas.');
    rewind($handle);
    $raw = stream_get_contents($handle);
    $users = $raw ? json_decode($raw, true) : [];
    if (!is_array($users)) throw new RuntimeException('El almacén de cuentas no se pudo leer; se conservó el archivo existente.');
    $result = $operation($users);
    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, json_encode($users, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . "\n");
    fflush($handle);
    flock($handle, LOCK_UN);
    return $result;
  } finally { fclose($handle); }
}

function start_account_session(): void {
  ini_set('session.use_strict_mode', '1');
  session_name('mc_account');
  $publicOrigin = getenv('MC_PUBLIC_ORIGIN') ?: (getenv('RENDER_EXTERNAL_URL') ?: '');
  $secureCookie = (stripos($publicOrigin, 'https://') === 0) || (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
  session_set_cookie_params(['lifetime'=>0, 'path'=>'/', 'secure'=>$secureCookie, 'httponly'=>true, 'samesite'=>'Lax']);
  if (session_status() !== PHP_SESSION_ACTIVE) session_start();
  if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
}

function request_body(): array {
  $body = json_decode((string)file_get_contents('php://input'), true);
  return is_array($body) ? $body : [];
}

function safe_user(array $user): array {
  return ['email'=>$user['email'], 'preferences'=>$user['preferences'] ?? default_preferences()];
}

function default_preferences(): array {
  return ['series'=>['F1','MotoGP','WEC'], 'teams'=>[], 'raceWeekend'=>false, 'news'=>false, 'hideSpoilers'=>false, 'leadMinutes'=>30];
}

function clean_preferences(array $incoming): array {
  $validSeries = ['F1','F2','F3','WEC','MotoGP','Moto2','Moto3','Superbikes'];
  $seriesInput = is_array($incoming['series'] ?? null) ? $incoming['series'] : [];
  $teamsInput = is_array($incoming['teams'] ?? null) ? $incoming['teams'] : [];
  $series = array_values(array_intersect($validSeries, array_unique(array_filter($seriesInput, 'is_string'))));
  $teams = array_values(array_unique(array_filter($teamsInput, fn($team) => is_string($team) && strlen($team) <= 220 && preg_match('/^[\\p{L}\\p{N} .&’\'-]{1,120}::[\\p{L}\\p{N} .&’\'-]{1,120}$/u', $team) === 1)));
  $lead = (int)($incoming['leadMinutes'] ?? 30);
  if (!in_array($lead, [15,30,60], true)) $lead = 30;
  return ['series'=>$series, 'teams'=>$teams, 'raceWeekend'=>!empty($incoming['raceWeekend']), 'news'=>!empty($incoming['news']), 'hideSpoilers'=>!empty($incoming['hideSpoilers']), 'leadMinutes'=>$lead];
}

$action = $_GET['action'] ?? 'all';
if ($action === 'auth') {
  start_account_session();
  $op = $_GET['op'] ?? 'me';
  if ($op === 'csrf') respond(['ok'=>true, 'csrf'=>$_SESSION['csrf']]);
  if (!in_array($op, ['me'], true)) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(['ok'=>false,'error'=>'Método no permitido.'], 405);
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin) {
      $requestScheme = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https' : 'http';
      $expectedOrigin = getenv('MC_PUBLIC_ORIGIN') ?: (getenv('RENDER_EXTERNAL_URL') ?: ($requestScheme . '://' . (string)($_SERVER['HTTP_HOST'] ?? '')));
      $originParts = parse_url($origin);
      $expectedParts = parse_url($expectedOrigin);
      $originScheme = strtolower((string)($originParts['scheme'] ?? ''));
      $expectedScheme = strtolower((string)($expectedParts['scheme'] ?? ''));
      $originHost = strtolower((string)($originParts['host'] ?? ''));
      $expectedHost = strtolower((string)($expectedParts['host'] ?? ''));
      $originPort = $originParts['port'] ?? ($originScheme === 'https' ? 443 : 80);
      $expectedPort = $expectedParts['port'] ?? ($expectedScheme === 'https' ? 443 : 80);
      if (!$originHost || $originScheme !== $expectedScheme || $originHost !== $expectedHost || (int)$originPort !== (int)$expectedPort) respond(['ok'=>false,'error'=>'Origen no permitido.'], 403);
    }
    $provided = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!$provided || !hash_equals((string)$_SESSION['csrf'], $provided)) respond(['ok'=>false,'error'=>'La sesión de seguridad ha caducado. Recarga la página.'], 403);
  }
  if ($op === 'me') {
    if (empty($_SESSION['account_email'])) respond(['ok'=>true,'user'=>null,'csrf'=>$_SESSION['csrf']]);
    $email = (string)$_SESSION['account_email'];
    try { $user = account_store(fn(&$users) => $users[$email] ?? null); }
    catch (Throwable $error) { respond(['ok'=>false,'error'=>$error->getMessage()], 503); }
    if (!$user) { unset($_SESSION['account_email']); respond(['ok'=>true,'user'=>null,'csrf'=>$_SESSION['csrf']]); }
    respond(['ok'=>true,'user'=>safe_user($user),'csrf'=>$_SESSION['csrf']]);
  }
  if ($op === 'register' || $op === 'login') {
    $body = request_body();
    $email = strtolower(trim((string)($body['email'] ?? '')));
    $password = (string)($body['password'] ?? '');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254 || strlen($password) < 12 || strlen($password) > 200) respond(['ok'=>false,'error'=>'Revisa el correo y usa una contraseña de entre 12 y 200 caracteres.'], 422);
    $_SESSION['auth_attempts'] = (int)($_SESSION['auth_attempts'] ?? 0) + 1;
    if ($_SESSION['auth_attempts'] > 12) respond(['ok'=>false,'error'=>'Demasiados intentos. Espera y vuelve a probar.'], 429);
    try {
      $user = account_store(function (&$users) use ($op, $email, $password) {
        if ($op === 'register') {
          if (isset($users[$email])) throw new DomainException('Ya existe una cuenta con ese correo.');
          $user = ['email'=>$email, 'passwordHash'=>password_hash($password, PASSWORD_DEFAULT), 'preferences'=>default_preferences(), 'createdAt'=>gmdate('c')];
          $users[$email] = $user;
          return $user;
        }
        $user = $users[$email] ?? null;
        if (!$user || !password_verify($password, (string)$user['passwordHash'])) throw new DomainException('Correo o contraseña incorrectos.');
        if (password_needs_rehash((string)$user['passwordHash'], PASSWORD_DEFAULT)) $users[$email]['passwordHash'] = password_hash($password, PASSWORD_DEFAULT);
        return $users[$email];
      });
    } catch (DomainException $error) { respond(['ok'=>false,'error'=>$error->getMessage()], 409); }
    catch (Throwable $error) { respond(['ok'=>false,'error'=>$error->getMessage()], 503); }
    session_regenerate_id(true);
    $_SESSION['auth_attempts'] = 0;
    $_SESSION['account_email'] = $email;
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
    respond(['ok'=>true,'user'=>safe_user($user),'csrf'=>$_SESSION['csrf']]);
  }
  if ($op === 'save_preferences') {
    if (empty($_SESSION['account_email'])) respond(['ok'=>false,'error'=>'Inicia sesión para guardar tus preferencias.'], 401);
    $email = (string)$_SESSION['account_email'];
    $body = request_body();
    try {
      $user = account_store(function (&$users) use ($email, $body) {
        if (!isset($users[$email])) throw new DomainException('No se encontró la cuenta.');
        $preferences = $body['preferences'] ?? [];
        $users[$email]['preferences'] = clean_preferences(is_array($preferences) ? $preferences : []);
        return $users[$email];
      });
    } catch (Throwable $error) { respond(['ok'=>false,'error'=>$error->getMessage()], 503); }
    respond(['ok'=>true,'user'=>safe_user($user)]);
  }
  if ($op === 'logout') {
    $_SESSION = [];
    session_regenerate_id(true);
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
    respond(['ok'=>true,'csrf'=>$_SESSION['csrf']]);
  }
  if ($op === 'delete_account') {
    if (empty($_SESSION['account_email'])) respond(['ok'=>false,'error'=>'Inicia sesión para eliminar la cuenta.'], 401);
    $email = (string)$_SESSION['account_email'];
    try { account_store(function (&$users) use ($email) { unset($users[$email]); return true; }); }
    catch (Throwable $error) { respond(['ok'=>false,'error'=>$error->getMessage()], 503); }
    $_SESSION = [];
    session_regenerate_id(true);
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
    respond(['ok'=>true,'csrf'=>$_SESSION['csrf']]);
  }
  respond(['ok'=>false,'error'=>'Operación no reconocida.'], 404);
}

$dataFile = __DIR__ . '/data/site-data.json';
$stored = ['news'=>[], 'calendars'=>['F1'=>[],'F2'=>[],'F3'=>[],'WEC'=>[]], 'standings'=>[], 'updatedAt'=>null];
if (is_file($dataFile)) {
  $parsed = json_decode((string)file_get_contents($dataFile), true);
  if (is_array($parsed)) $stored = array_replace_recursive($stored, $parsed);
}
if ($action === 'health') respond(['ok'=>true,'message'=>'PHP activo.','updatedAt'=>$stored['updatedAt']]);
respond($stored);
