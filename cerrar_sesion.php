<?php
// Inicia la sesión
session_start();

// Desconfigura todas las variables de sesión
$_SESSION = array();

// Borra la cookie de sesión si está configurada
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
}

// Destruye la sesión
session_destroy();

// Redirige a la página de inicio de sesión o a otra página deseada
header("Location: login.html");
exit();
?>
