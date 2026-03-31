<?php
/* ============================================
   FreshBites - User Logout
   ============================================ */

require_once 'config.php';

// Clear session
session_unset();
session_destroy();

// Clear remember me cookie
if (isset($_COOKIE['remember_token'])) {
    setcookie('remember_token', '', time() - 3600, '/', '', false, true);
}

// Redirect to login page
header('Location: ../login.html');
exit;
?>
