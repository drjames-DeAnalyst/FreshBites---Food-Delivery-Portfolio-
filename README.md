# FreshBites - Food Delivery Platform

A complete food delivery platform built with HTML, CSS, JavaScript, and PHP.

## Features

### User Features
- Browse restaurants and menus
- Search and filter products
- Add items to cart
- User registration and login
- Order tracking
- Favorite items

### Admin Features
- Dashboard with analytics
- Order management
- Product upload and listing
- Restaurant management
- Customer management
- Review management

## Pages

1. **Home (index.html)** - Landing page with hero section, categories, featured restaurants, testimonials
2. **Login/Register (login.html)** - User authentication
3. **Admin Dashboard (admin.html)** - Admin panel with charts and data tables
4. **Products (products.html)** - Product listing with cart functionality

## Color Scheme

- Primary: Green (Medium Sea Green)
- Secondary: White
- Accent: Orange
- Theme: Fresh & Modern

## File Structure

```
food-delivery/
├── index.html              # Home page
├── login.html              # Login & Register page
├── admin.html              # Admin dashboard
├── products.html           # Products listing & upload
├── css/
│   ├── style.css           # Main styles
│   ├── auth.css            # Authentication styles
│   ├── admin.css           # Admin dashboard styles
│   └── products.css        # Products page styles
├── js/
│   ├── main.js             # Main JavaScript
│   ├── auth.js             # Authentication JavaScript
│   ├── admin.js            # Admin dashboard JavaScript
│   └── products.js         # Products page JavaScript
├── php/
│   ├── config.php          # Database configuration
│   ├── database.sql        # Database schema
│   ├── login.php           # Login handler
│   ├── register.php        # Registration handler
│   ├── logout.php          # Logout handler
│   ├── upload-product.php  # Product upload handler
│   └── get-products.php    # Get products API
└── uploads/                # Upload directory
    └── products/           # Product images
```

## Installation

### Requirements
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server (Apache/Nginx)

### Setup Steps

1. **Create Database**
   ```sql
   -- Import the database schema
   mysql -u root -p < php/database.sql
   ```

2. **Configure Database**
   - Open `php/config.php`
   - Update database credentials:
     ```php
     define('DB_HOST', 'localhost');
     define('DB_USERNAME', 'your_username');
     define('DB_PASSWORD', 'your_password');
     define('DB_NAME', 'freshbites');
     ```

3. **Create Uploads Directory**
   ```bash
   mkdir -p uploads/products
   chmod 755 uploads/products
   ```

4. **Configure Web Server**
   - Point document root to the `food-delivery` folder
   - Ensure PHP is enabled

5. **Access the Application**
   - Frontend: `http://localhost/food-delivery/`
   - Admin: `http://localhost/food-delivery/admin.html`

### Default Admin Credentials
- Email: admin@freshbites.com
- Password: admin123

## Usage

### For Users
1. Browse the home page to see featured restaurants
2. Click on "Menu" to view all products
3. Add items to cart
4. Register/Login to place orders

### For Admins
1. Navigate to `admin.html`
2. Login with admin credentials
3. Manage orders, products, restaurants, and customers
4. Upload new products

## API Endpoints

### Authentication
- `POST /php/login.php` - User login
- `POST /php/register.php` - User registration
- `GET /php/logout.php` - User logout

### Products
- `GET /php/get-products.php` - Get all products
- `POST /php/upload-product.php` - Upload new product (Admin only)

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

This project is open source and available for personal and commercial use.
