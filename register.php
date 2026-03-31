<?php
/* ============================================
   FreshBites - User Registration
   ============================================ */

require_once 'config.php';

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Invalid request method');
}

// Get POST data
$firstName = isset($_POST['firstName']) ? $_POST['firstName'] : '';
$lastName = isset($_POST['lastName']) ? $_POST['lastName'] : '';
$email = isset($_POST['email']) ? $_POST['email'] : '';
$phone = isset($_POST['phone']) ? $_POST['phone'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';
$confirmPassword = isset($_POST['confirmPassword']) ? $_POST['confirmPassword'] : '';

// Validate input
if (empty($firstName) || empty($lastName) || empty($email) || empty($phone) || empty($password)) {
    sendResponse(false, 'Please fill in all required fields');
}

if (strlen($firstName) < 2 || strlen($lastName) < 2) {
    sendResponse(false, 'Name must be at least 2 characters long');
}

if (!validateEmail($email)) {
    sendResponse(false, 'Please enter a valid email address');
}

if (strlen($password) < 8) {
    sendResponse(false, 'Password must be at least 8 characters long');
}

if (!preg_match('/[A-Za-z]/', $password) || !preg_match('/\d/', $password)) {
    sendResponse(false, 'Password must contain both letters and numbers');
}

if ($password !== $confirmPassword) {
    sendResponse(false, 'Passwords do not match');
}

// Get database connection
$conn = getDBConnection();

// Sanitize input
$firstName = sanitize($conn, $firstName);
$lastName = sanitize($conn, $lastName);
$email = sanitize($conn, $email);
$phone = sanitize($conn, $phone);

// Check if email already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $stmt->close();
    closeDBConnection($conn);
    sendResponse(false, 'An account with this email already exists');
}
$stmt->close();

// Hash password
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Insert new user
$stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, phone, password, role, created_at) VALUES (?, ?, ?, ?, ?, 'user', NOW())");
$stmt->bind_param("sssss", $firstName, $lastName, $email, $phone, $hashedPassword);

if ($stmt->execute()) {
    $userId = $stmt->insert_id;
    $stmt->close();
    
    // Set session variables
    $_SESSION['user_id'] = $userId;
    $_SESSION['user_name'] = $firstName . ' ' . $lastName;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_role'] = 'user';
    $_SESSION['logged_in'] = true;
    
    closeDBConnection($conn);
    
    // Prepare user data for response
    $userData = [
        'id' => $userId,
        'name' => $firstName . ' ' . $lastName,
        'email' => $email,
        'role' => 'user'
    ];
    
    sendResponse(true, 'Registration successful', $userData);
} else {
    $stmt->close();
    closeDBConnection($conn);
    sendResponse(false, 'Registration failed. Please try again.');
}
?>
