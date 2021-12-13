<?php
// delta T for javascript code

define('SKIP_HEADER', true);
require_once $_SERVER['DOCUMENT_ROOT'].'/prepend.php';

// Start session
if (session_status() === PHP_SESSION_NONE) {
    @session_start();
}

//$_SESSION['lang'] = 'sp';
//$_SESSION['lang'] = 'fr';
// unset($_SESSION['lang']);// = 'en';

header('Content-Type: application/javascript; charset=utf-8');
echo 'window.EC_LANG = '.json_encode(@$_SESSION['lang']).';'.PHP_EOL;
