/* ============================================
   FreshBites - Products Page JavaScript
   Product Upload, Listing & Cart Functionality
   ============================================ */

// Cart State
let cart = [];

// Products Data
let products = [];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize products from DOM
    initializeProducts();

    // Mobile Navigation
    initMobileNav();

    // Image Upload
    initImageUpload();

    // Toggle Upload Section
    initToggleUpload();

    // Category Pills
    initCategoryPills();

    // Product Filters
    initProductFilters();

    // Add to Cart Buttons
    initAddToCart();

    // Favorite Buttons
    initFavoriteButtons();

    // Pagination
    initPagination();

    // Load cart from storage
    loadCart();
});

// Initialize Products from DOM
function initializeProducts() {
    const productCards = document.querySelectorAll('.product-card');
    products = Array.from(productCards).map((card, index) => {
        return {
            id: index + 1,
            name: card.querySelector('h3').textContent,
            price: parseFloat(card.querySelector('.price').textContent.replace('$', '')),
            category: card.dataset.category,
            restaurant: card.dataset.restaurant,
            image: card.querySelector('img').src,
            element: card
        };
    });
}

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            navActions.classList.toggle('active');
        });
    }
}

// Image Upload
function initImageUpload() {
    const imageInput = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');
    const removeBtn = document.querySelector('.remove-image');
    const uploadBox = document.getElementById('imageUploadBox');

    if (imageInput) {
        // Drag and drop
        uploadBox.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = 'mediumseagreen';
            this.style.backgroundColor = 'rgba(60, 179, 113, 0.05)';
        });

        uploadBox.addEventListener('dragleave', function() {
            this.style.borderColor = '';
            this.style.backgroundColor = '';
        });

        uploadBox.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '';
            this.style.backgroundColor = '';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleImageFile(files[0]);
            }
        });

        // File input change
        imageInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                handleImageFile(this.files[0]);
            }
        });
    }
}

// Handle Image File
function handleImageFile(file) {
    const imagePreview = document.getElementById('imagePreview');
    const removeBtn = document.querySelector('.remove-image');
    const uploadPlaceholder = document.querySelector('.upload-placeholder');

    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Image size should be less than 5MB', 'error');
        return;
    }

    // Preview image
    const reader = new FileReader();
    reader.onload = function(e) {
        imagePreview.src = e.target.result;
        imagePreview.classList.remove('hidden');
        removeBtn.classList.remove('hidden');
        uploadPlaceholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

// Remove Image
function removeImage() {
    const imageInput = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');
    const removeBtn = document.querySelector('.remove-image');
    const uploadPlaceholder = document.querySelector('.upload-placeholder');

    imageInput.value = '';
    imagePreview.src = '';
    imagePreview.classList.add('hidden');
    removeBtn.classList.add('hidden');
    uploadPlaceholder.style.display = 'block';
}

// Toggle Upload Section
function initToggleUpload() {
    const toggleBtn = document.querySelector('.btn-toggle');
    const uploadForm = document.getElementById('uploadForm');
    const toggleIcon = toggleBtn?.querySelector('i');

    if (toggleBtn && uploadForm) {
        toggleBtn.addEventListener('click', function() {
            uploadForm.classList.toggle('collapsed');
            if (uploadForm.classList.contains('collapsed')) {
                toggleIcon.classList.remove('fa-chevron-up');
                toggleIcon.classList.add('fa-chevron-down');
            } else {
                toggleIcon.classList.remove('fa-chevron-down');
                toggleIcon.classList.add('fa-chevron-up');
            }
        });
    }
}

function toggleUpload() {
    const uploadForm = document.getElementById('uploadForm');
    const toggleBtn = document.querySelector('.btn-toggle');
    const toggleIcon = toggleBtn?.querySelector('i');

    if (uploadForm) {
        uploadForm.classList.toggle('collapsed');
        if (uploadForm.classList.contains('collapsed')) {
            toggleIcon.classList.remove('fa-chevron-up');
            toggleIcon.classList.add('fa-chevron-down');
        } else {
            toggleIcon.classList.remove('fa-chevron-down');
            toggleIcon.classList.add('fa-chevron-up');
        }
    }
}

// Reset Form
function resetForm() {
    const form = document.getElementById('uploadForm');
    if (form) {
        form.reset();
        removeImage();
    }
}

// Category Pills
function initCategoryPills() {
    const pills = document.querySelectorAll('.pill');
    
    pills.forEach(pill => {
        pill.addEventListener('click', function() {
            // Update active state
            pills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');

            // Filter products
            const category = this.dataset.category;
            filterProductsByCategory(category);

            // Update select
            const categorySelect = document.getElementById('categoryFilter');
            if (categorySelect) {
                categorySelect.value = category;
            }
        });
    });
}

// Filter Products by Category
function filterProductsByCategory(category) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        if (!category || card.dataset.category === category) {
            card.style.display = '';
            card.style.animation = 'fadeIn 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// Product Filters
function initProductFilters() {
    const searchInput = document.getElementById('searchProducts');
    const categoryFilter = document.getElementById('categoryFilter');
    const restaurantFilter = document.getElementById('restaurantFilter');
    const sortFilter = document.getElementById('sortFilter');

    // Search
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            applyFilters();
        }, 300));
    }

    // Category Filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            // Update pills
            const pills = document.querySelectorAll('.pill');
            pills.forEach(pill => {
                pill.classList.remove('active');
                if (pill.dataset.category === this.value) {
                    pill.classList.add('active');
                }
            });
            applyFilters();
        });
    }

    // Restaurant Filter
    if (restaurantFilter) {
        restaurantFilter.addEventListener('change', applyFilters);
    }

    // Sort Filter
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }
}

// Apply All Filters
function applyFilters() {
    const searchQuery = document.getElementById('searchProducts')?.value.toLowerCase() || '';
    const category = document.getElementById('categoryFilter')?.value || '';
    const restaurant = document.getElementById('restaurantFilter')?.value || '';
    const sort = document.getElementById('sortFilter')?.value || 'popular';

    const productCards = document.querySelectorAll('.product-card');
    let visibleCards = [];

    productCards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.description')?.textContent.toLowerCase() || '';
        const cardCategory = card.dataset.category;
        const cardRestaurant = card.dataset.restaurant;

        // Filter by search
        const matchesSearch = name.includes(searchQuery) || description.includes(searchQuery);
        
        // Filter by category
        const matchesCategory = !category || cardCategory === category;
        
        // Filter by restaurant
        const matchesRestaurant = !restaurant || cardRestaurant === restaurant;

        if (matchesSearch && matchesCategory && matchesRestaurant) {
            card.style.display = '';
            visibleCards.push(card);
        } else {
            card.style.display = 'none';
        }
    });

    // Sort visible cards
    sortProducts(visibleCards, sort);
}

// Sort Products
function sortProducts(cards, sortType) {
    const container = document.getElementById('productsGrid');
    
    const sortedCards = Array.from(cards).sort((a, b) => {
        switch(sortType) {
            case 'price-low':
                return getPrice(a) - getPrice(b);
            case 'price-high':
                return getPrice(b) - getPrice(a);
            case 'rating':
                return getRating(b) - getRating(a);
            case 'newest':
                return b.classList.contains('new') ? 1 : -1;
            default:
                return 0;
        }
    });

    sortedCards.forEach(card => {
        container.appendChild(card);
    });
}

// Get Price from Card
function getPrice(card) {
    const priceText = card.querySelector('.price').textContent;
    return parseFloat(priceText.replace('$', ''));
}

// Get Rating from Card
function getRating(card) {
    const ratingText = card.querySelector('.rating span')?.textContent || '0';
    return parseFloat(ratingText);
}

// Add to Cart
function initAddToCart() {
    const addButtons = document.querySelectorAll('.add-to-cart');
    
    addButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const product = {
                id: Date.now(),
                name: card.querySelector('h3').textContent,
                price: getPrice(card),
                image: card.querySelector('img').src,
                restaurant: card.querySelector('.restaurant').textContent,
                quantity: 1
            };

            addToCart(product);
        });
    });
}

// Add Item to Cart
function addToCart(product) {
    // Check if item already exists
    const existingItem = cart.find(item => item.name === product.name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(product);
    }

    saveCart();
    updateCartUI();
    showNotification(product.name + ' added to cart!');
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Save Cart to Storage
function saveCart() {
    localStorage.setItem('freshbites_cart', JSON.stringify(cart));
}

// Load Cart from Storage
function loadCart() {
    const savedCart = localStorage.getItem('freshbites_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Update Cart UI
function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTax = document.getElementById('cartTax');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 200);
    }

    // Update items list
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Your cart is empty</p>
                    <span>Add items to get started</span>
                </div>
            `;
            if (checkoutBtn) checkoutBtn.disabled = true;
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>${item.restaurant}</p>
                        <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                        <div class="cart-item-actions">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                            <span class="remove-item" onclick="removeFromCart(${item.id})">
                                <i class="fas fa-trash"></i>
                            </span>
                        </div>
                    </div>
                </div>
            `).join('');
            if (checkoutBtn) checkoutBtn.disabled = false;
        }
    }

    // Update totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax + 2.99;

    if (cartSubtotal) cartSubtotal.textContent = '$' + subtotal.toFixed(2);
    if (cartTax) cartTax.textContent = '$' + tax.toFixed(2);
    if (cartTotal) cartTotal.textContent = '$' + total.toFixed(2);
}

// Toggle Cart Sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');

    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.toggle('open');
        cartOverlay.classList.toggle('open');
        document.body.style.overflow = cartSidebar.classList.contains('open') ? 'hidden' : '';
    }
}

// Favorite Buttons
function initFavoriteButtons() {
    const favoriteBtns = document.querySelectorAll('.favorite-btn');
    
    favoriteBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const icon = this.querySelector('i');
            const isFavorite = icon.classList.contains('fas');
            
            if (isFavorite) {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.classList.remove('active');
            } else {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.classList.add('active');
            }
        });
    });
}

// Pagination
function initPagination() {
    const pageBtns = document.querySelectorAll('.page-btn');
    
    pageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
            
            // Update active state
            document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
            
            if (!this.classList.contains('prev') && !this.classList.contains('next')) {
                this.classList.add('active');
            }
            
            // Show notification
            showNotification('Loading page...');
        });
    });
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'product-notification';
    
    const icon = type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle';
    const color = type === 'error' ? 'crimson' : 'mediumseagreen';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: ${color};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions
window.Products = {
    toggleUpload,
    removeImage,
    resetForm,
    toggleCart,
    addToCart,
    removeFromCart,
    updateQuantity
};
