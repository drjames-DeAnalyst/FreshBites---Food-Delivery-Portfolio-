<?php
/* ============================================
   FreshBites - User Login
   ============================================ */

require_once 'config.php';

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Invalid request method');
}

// Get POST data
$email = isset($_POST['email']) ? $_POST['email'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';
$remember = isset($_POST['remember']) ? true : false;

// Validate input
if (empty($email) || empty($password)) {
    sendResponse(false, 'Please enter both email and password');
}

if (!validateEmail($email)) {
    sendResponse(false, 'Please enter a valid email address');
}

// Get database connection
$conn = getDBConnection();

// Sanitize input
$email = sanitize($conn, $email);

// Prepare and execute query
$stmt = $conn->prepare("SELECT id, first_name, last_name, email, password, role, phone FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

// Check if user exists
if ($result->num_rows === 0) {
    $stmt->close();
    closeDBConnection($conn);
    sendResponse(false, 'Invalid email or password');
}

// Fetch user data
$user = $result->fetch_assoc();
$stmt->close();

// Verify password
if (!password_verify($password, $user['password'])) {
    closeDBConnection($conn);
    sendResponse(false, 'Invalid email or password');
}

// Check if user is active
if (isset($user['status']) && $user['status'] !== 'active') {
    closeDBConnection($conn);
    sendResponse(false, 'Your account has been deactivated. Please contact support.');
}

// Set session variables
$_SESSION['user_id'] = $user['id'];
$_SESSION['user_name'] = $user['first_name'] . ' ' . $user['last_name'];
$_SESSION['user_email'] = $user['email'];
$_SESSION['user_role'] = $user['role'];
$_SESSION['logged_in'] = true;

// Set remember me cookie if requested
if ($remember) {
    $token = generateUniqueId('remember_');
    $expires = time() + (30 * 24 * 60 * 60); // 30 days
    
    // Store token in database
    $stmt = $conn->prepare("UPDATE users SET remember_token = ?, token_expires = ? WHERE id = ?");
    $expires_date = date('Y-m-d H:i:s', $expires);
    $stmt->bind_param("ssi", $token, $expires_date, $user['id']);
    $stmt->execute();
    $stmt->close();
    
    // Set cookie
    setcookie('remember_token', $token, $expires, '/', '', false, true);
}

// Update last login
$stmt = $conn->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
$stmt->bind_param("i", $user['id']);
$stmt->execute();
$stmt->close();

closeDBConnection($conn);

// Prepare user data for response
$userData = [
    'id' => $user['id'],
    'name' => $user['first_name'] . ' ' . $user['last_name'],
    'email' => $user['email'],
    'role' => $user['role'],
    'phone' => $user['phone']
];

sendResponse(true, 'Login successful', $userData);
?>
