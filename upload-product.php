<?php
/* ============================================
   FreshBites - Product Upload
   ============================================ */

require_once 'config.php';

// Check if user is logged in and is admin
if (!isset($_SESSION['logged_in']) || $_SESSION['user_role'] !== 'admin') {
    sendResponse(false, 'Unauthorized access');
}

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Invalid request method');
}

// Get POST data
$productName = isset($_POST['productName']) ? $_POST['productName'] : '';
$productCategory = isset($_POST['productCategory']) ? $_POST['productCategory'] : '';
$productPrice = isset($_POST['productPrice']) ? $_POST['productPrice'] : '';
$productRestaurant = isset($_POST['productRestaurant']) ? $_POST['productRestaurant'] : '';
$productDescription = isset($_POST['productDescription']) ? $_POST['productDescription'] : '';
$options = isset($_POST['options']) ? $_POST['options'] : [];

// Validate input
if (empty($productName) || empty($productCategory) || empty($productPrice) || empty($productRestaurant) || empty($productDescription)) {
    sendResponse(false, 'Please fill in all required fields');
}

if (strlen($productName) < 3) {
    sendResponse(false, 'Product name must be at least 3 characters long');
}

if (!is_numeric($productPrice) || $productPrice <= 0) {
    sendResponse(false, 'Please enter a valid price');
}

if (strlen($productDescription) < 10) {
    sendResponse(false, 'Description must be at least 10 characters long');
}

// Handle image upload
$imagePath = '';
if (isset($_FILES['productImage']) && $_FILES['productImage']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = '../uploads/products/';
    
    // Create directory if it doesn't exist
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Validate file type
    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    $fileType = $_FILES['productImage']['type'];
    
    if (!in_array($fileType, $allowedTypes)) {
        sendResponse(false, 'Invalid file type. Only JPG, PNG, and WEBP are allowed');
    }
    
    // Validate file size (5MB max)
    $maxSize = 5 * 1024 * 1024;
    if ($_FILES['productImage']['size'] > $maxSize) {
        sendResponse(false, 'File size must be less than 5MB');
    }
    
    // Generate unique filename
    $fileExtension = pathinfo($_FILES['productImage']['name'], PATHINFO_EXTENSION);
    $fileName = generateUniqueId('product_') . '.' . $fileExtension;
    $targetPath = $uploadDir . $fileName;
    
    // Move uploaded file
    if (move_uploaded_file($_FILES['productImage']['tmp_name'], $targetPath)) {
        $imagePath = 'uploads/products/' . $fileName;
    } else {
        sendResponse(false, 'Failed to upload image');
    }
} else {
    sendResponse(false, 'Please upload a product image');
}

// Get database connection
$conn = getDBConnection();

// Sanitize input
$productName = sanitize($conn, $productName);
$productCategory = sanitize($conn, $productCategory);
$productRestaurant = sanitize($conn, $productRestaurant);
$productDescription = sanitize($conn, $productDescription);
$imagePath = sanitize($conn, $imagePath);

// Convert options array to JSON
$optionsJson = json_encode($options);

// Insert product into database
$stmt = $conn->prepare("INSERT INTO products (name, category, price, restaurant, description, image, options, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())");
$stmt->bind_param("ssdssssi", $productName, $productCategory, $productPrice, $productRestaurant, $productDescription, $imagePath, $optionsJson, $_SESSION['user_id']);

if ($stmt->execute()) {
    $productId = $stmt->insert_id;
    $stmt->close();
    closeDBConnection($conn);
    
    // Prepare response data
    $productData = [
        'id' => $productId,
        'name' => $productName,
        'category' => $productCategory,
        'price' => $productPrice,
        'restaurant' => $productRestaurant,
        'image' => $imagePath
    ];
    
    sendResponse(true, 'Product added successfully', $productData);
} else {
    $stmt->close();
    closeDBConnection($conn);
    
    // Remove uploaded image if database insert failed
    if (file_exists($targetPath)) {
        unlink($targetPath);
    }
    
    sendResponse(false, 'Failed to add product. Please try again.');
}
?>
