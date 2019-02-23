<?php
ini_set('display_error', 1);
ini_set('display_startup_errors', 1);
ini_set('max_execution_time', 300);

error_reporting(E_ALL);

define('OAUTH2_CLIENT_ID', $_ENV['CLIENT_ID']);
define('OAUTH2_CLIENT_SECRET', $_ENV['CLIENT_SECRET']);

$authorizeURL = 'https://discordapp.com/api/oauth2/authorize';
$tokenURL = 'https://discordapp.com/api/oauth2/token';
$apiURLBase = 'https://discordapp.com/api/users/@me';

session_start();

if (get('action') == 'login') {

    $params = array(
        'client_id' => OAUTH2_CLIENT_ID,
        'redirect_uri' => "https://pisscord.org",
        'response_type' => 'code',
        'scope' => 'identify guilds'
    );

    header("Location: https://discordapp.com/api/oauth2/authorize?".http_build_query($params));
    die();
}

if (get('code')) {

    $token = apiRequest($tokenURL, array(
        'grant_type' => 'authorization_code',
        'client_id' => OAUTH2_CLIENT_ID,
        'redirect_uri' => 'https://pisscord.org',
        'code' => get('code')
    ));

    $logout_token = $token->access_token;
    $_SESSION['access_token'] = $token->access_token;

    header('Location: '.$_SERVER['PHP_SELF']);
}

if (session('access_token')) {
    $user = apiRequest($apiURLBase);

    echo '<h3>Logged In</h3>';
    echo '<h4>Welcome, '.$user->username . '</h4>';
    echo '<pre>';
    print_r($user);
    echo '</pre>';
} else {
    echo '<script>window.location.href="https://pisscord/login.php?action=login";</script>';
}

if (get('action') == "logout") {
    $params = array(
        'access_token' => $logout_token
    );

    header('Location: https://discordapp.com/api/oauth2/token/revoke?'.http_build_query($params));
    die();
}

function apiRequest($url, $post=false, $headers=array()) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_UPRESOLVE_V4);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

    $response = curl_exec($ch);

    if ($post) 
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));

    $headers[] = 'Accept: application/json';

    if (session('access_token'))
        $headers[] = 'Authorization: Bearer'.session('access_token');
    
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);

    $response = curl_exec($ch);
    return json_decode($response);
}

function get($key, $default=NULL) {
    return array_key_exists($key, $_GET) ? $_GET[$key] : $default;
}

function session($key, $default=NULL) {
    return array_key_exists($key, $_SESSION) ? $_SESSION[$key] : $default;
}

?>