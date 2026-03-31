<?php
/* ============================================
   FreshBites - Get Products API
   ============================================ */

require_once 'config.php';

// Get query parameters
$category = isset($_GET['category']) ? $_GET['category'] : '';
$restaurant = isset($_GET['restaurant']) ? $_GET['restaurant'] : '';
$search = isset($_GET['search']) ? $_GET['search'] : '';
$sort = isset($_GET['sort']) ? $_GET['sort'] : 'newest';
$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 12;

// Calculate offset
$offset = ($page - 1) * $limit;

// Get database connection
$conn = getDBConnection();

// Build query
$sql = "SELECT p.*, c.name as category_name, r.name as restaurant_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        LEFT JOIN restaurants r ON p.restaurant_id = r.id 
        WHERE p.status = 'active'";

$params = [];
$types = '';

// Add filters
if (!empty($category)) {
    $sql .= " AND c.slug = ?";
    $params[] = $category;
    $types .= 's';
}

if (!empty($restaurant)) {
    $sql .= " AND r.slug = ?";
    $params[] = $restaurant;
    $types .= 's';
}

if (!empty($search)) {
    $sql .= " AND (p.name LIKE ? OR p.description LIKE ?)";
    $searchTerm = '%' . $search . '%';
    $params[] = $searchTerm;
    $params[] = $searchTerm;
    $types .= 'ss';
}

// Add sorting
switch ($sort) {
    case 'price-low':
        $sql .= " ORDER BY p.price ASC";
        break;
    case 'price-high':
        $sql .= " ORDER BY p.price DESC";
        break;
    case 'rating':
        $sql .= " ORDER BY r.rating DESC";
        break;
    case 'popular':
        $sql .= " ORDER BY p.id DESC";
        break;
    default:
        $sql .= " ORDER BY p.created_at DESC";
}

// Add pagination
$sql .= " LIMIT ? OFFSET ?";
$params[] = $limit;
$params[] = $offset;
$types .= 'ii';

// Prepare and execute query
$stmt = $conn->prepare($sql);

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

// Fetch products
$products = [];
while ($row = $result->fetch_assoc()) {
    $products[] = [
        'id' => $row['id'],
        'name' => $row['name'],
        'description' => $row['description'],
        'price' => floatval($row['price']),
        'category' => $row['category_name'],
        'restaurant' => $row['restaurant_name'],
        'image' => $row['image'],
        'options' => json_decode($row['options'], true),
        'is_vegetarian' => (bool)$row['is_vegetarian'],
        'is_vegan' => (bool)$row['is_vegan'],
        'is_gluten_free' => (bool)$row['is_gluten_free'],
        'is_spicy' => (bool)$row['is_spicy']
    ];
}

$stmt->close();

// Get total count for pagination
$countSql = "SELECT COUNT(*) as total FROM products p 
             LEFT JOIN categories c ON p.category_id = c.id 
             LEFT JOIN restaurants r ON p.restaurant_id = r.id 
             WHERE p.status = 'active'";

if (!empty($category)) {
    $countSql .= " AND c.slug = '" . $conn->real_escape_string($category) . "'";
}

if (!empty($restaurant)) {
    $countSql .= " AND r.slug = '" . $conn->real_escape_string($restaurant) . "'";
}

if (!empty($search)) {
    $searchTerm = '%' . $conn->real_escape_string($search) . '%';
    $countSql .= " AND (p.name LIKE '$searchTerm' OR p.description LIKE '$searchTerm')";
}

$countResult = $conn->query($countSql);
$totalCount = $countResult->fetch_assoc()['total'];

closeDBConnection($conn);

// Prepare response
$response = [
    'success' => true,
    'data' => [
        'products' => $products,
        'pagination' => [
            'current_page' => $page,
            'per_page' => $limit,
            'total_items' => intval($totalCount),
            'total_pages' => ceil($totalCount / $limit)
        ]
    ]
];

header('Content-Type: application/json');
echo json_encode($response);
?>
