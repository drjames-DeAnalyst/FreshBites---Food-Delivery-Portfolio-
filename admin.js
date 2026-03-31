/* ============================================
   FreshBites - Admin Dashboard JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Charts
    initCharts();

    // Sidebar Navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
            
            // Update active state
            sidebarLinks.forEach(l => l.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
        });
    });

    // Header Search
    const headerSearch = document.querySelector('.header-search input');
    if (headerSearch) {
        headerSearch.addEventListener('input', debounce(function() {
            const query = this.value.toLowerCase();
            searchContent(query);
        }, 300));
    }

    // Notification Buttons
    const notificationBtns = document.querySelectorAll('.header-btn');
    notificationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const badge = this.querySelector('.notification-badge');
            if (badge) {
                const count = parseInt(badge.textContent);
                showNotification(`You have ${count} new notifications`);
            }
        });
    });

    // User Profile Dropdown
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.addEventListener('click', function() {
            showUserDropdown();
        });
    }

    // Action Buttons in Tables
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = this.querySelector('i').classList;
            
            if (action.contains('fa-eye')) {
                showOrderDetails();
            } else if (action.contains('fa-edit')) {
                editItem(this);
            } else if (action.contains('fa-trash')) {
                deleteItem(this);
            }
        });
    });

    // Filter Selects
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            filterData();
        });
    });

    // Search Inputs
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('input', debounce(function() {
            filterData();
        }, 300));
    });

    // Chart Filters
    const chartFilters = document.querySelectorAll('.chart-filter');
    chartFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            updateCharts(this.value);
        });
    });

    // Initialize tooltips
    initTooltips();

    // Check for mobile
    checkMobile();
    window.addEventListener('resize', checkMobile);
});

// Show Section
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Add animation
        targetSection.style.opacity = '0';
        targetSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            targetSection.style.transition = 'all 0.3s ease';
            targetSection.style.opacity = '1';
            targetSection.style.transform = 'translateY(0)';
        }, 10);
    }

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.remove('open');
    }

    // Update page title
    updatePageTitle(sectionId);
}

// Toggle Sidebar (Mobile)
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

// Initialize Charts
function initCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Revenue',
                    data: [6500, 5900, 8000, 8100, 5600, 9500, 11000],
                    borderColor: 'mediumseagreen',
                    backgroundColor: 'rgba(60, 179, 113, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'mediumseagreen',
                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'darkslategray',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return '$' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value / 1000 + 'k';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Order Chart
    const orderCtx = document.getElementById('orderChart');
    if (orderCtx) {
        new Chart(orderCtx, {
            type: 'doughnut',
            data: {
                labels: ['Delivered', 'Preparing', 'On the Way', 'Pending'],
                datasets: [{
                    data: [65, 15, 12, 8],
                    backgroundColor: [
                        'mediumseagreen',
                        'orange',
                        'dodgerblue',
                        'lightgray'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }
}

// Update Charts
function updateCharts(period) {
    // This would fetch new data based on the selected period
    showNotification('Updating charts for: ' + period);
}

// Search Content
function searchContent(query) {
    // Search in tables
    const tables = document.querySelectorAll('.data-table tbody tr');
    tables.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(query)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Filter Data
function filterData() {
    // This would filter table data based on selected filters
    console.log('Filtering data...');
}

// Show Order Details
function showOrderDetails() {
    const modal = createModal('Order Details', `
        <div class="order-detail">
            <div class="detail-row">
                <span>Order ID:</span>
                <strong>#ORD-001</strong>
            </div>
            <div class="detail-row">
                <span>Customer:</span>
                <strong>Sarah Johnson</strong>
            </div>
            <div class="detail-row">
                <span>Restaurant:</span>
                <strong>Burger King</strong>
            </div>
            <div class="detail-row">
                <span>Items:</span>
                <strong>3 items</strong>
            </div>
            <div class="detail-row">
                <span>Total:</span>
                <strong>$32.50</strong>
            </div>
            <div class="detail-row">
                <span>Status:</span>
                <span class="status-badge delivered">Delivered</span>
            </div>
            <div class="detail-row">
                <span>Date:</span>
                <strong>Today, 2:30 PM</strong>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
}

// Edit Item
function editItem(btn) {
    const row = btn.closest('tr');
    const orderId = row.querySelector('.order-id')?.textContent || 'Item';
    showNotification('Editing ' + orderId);
}

// Delete Item
function deleteItem(btn) {
    const row = btn.closest('tr');
    const orderId = row.querySelector('.order-id')?.textContent || 'this item';
    
    if (confirm('Are you sure you want to delete ' + orderId + '?')) {
        row.style.transition = 'all 0.3s ease';
        row.style.opacity = '0';
        row.style.transform = 'translateX(-100%)';
        
        setTimeout(() => {
            row.remove();
            showNotification(orderId + ' deleted successfully');
        }, 300);
    }
}

// Show User Dropdown
function showUserDropdown() {
    // Remove existing dropdown
    const existingDropdown = document.querySelector('.user-dropdown');
    if (existingDropdown) {
        existingDropdown.remove();
        return;
    }

    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown';
    dropdown.innerHTML = `
        <a href="#profile"><i class="fas fa-user"></i> Profile</a>
        <a href="#settings"><i class="fas fa-cog"></i> Settings</a>
        <div class="dropdown-divider"></div>
        <a href="index.html" class="logout"><i class="fas fa-sign-out-alt"></i> Logout</a>
    `;

    dropdown.style.cssText = `
        position: absolute;
        top: 60px;
        right: 20px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
        min-width: 180px;
        z-index: 1000;
        animation: fadeIn 0.2s ease;
    `;

    // Add dropdown styles
    const style = document.createElement('style');
    style.textContent = `
        .user-dropdown a {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 15px;
            color: darkslategray;
            font-size: 14px;
            transition: all 0.2s ease;
        }
        .user-dropdown a:hover {
            background-color: whitesmoke;
            color: mediumseagreen;
        }
        .user-dropdown a.logout {
            color: crimson;
        }
        .user-dropdown a.logout:hover {
            background-color: rgba(220, 53, 69, 0.1);
        }
        .dropdown-divider {
            height: 1px;
            background-color: whitesmoke;
            margin: 5px 0;
        }
    `;
    document.head.appendChild(style);

    document.querySelector('.admin-header').appendChild(dropdown);

    // Close on outside click
    setTimeout(() => {
        document.addEventListener('click', function closeDropdown(e) {
            if (!e.target.closest('.user-profile') && !e.target.closest('.user-dropdown')) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    }, 10);
}

// Create Modal
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;

    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;

    modal.querySelector('.modal').style.cssText = `
        background-color: white;
        border-radius: 16px;
        width: 90%;
        max-width: 500px;
        animation: slideUp 0.3s ease;
    `;

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

    return modal;
}

// Update Page Title
function updatePageTitle(sectionId) {
    const titles = {
        'dashboard': 'Dashboard Overview',
        'orders': 'Orders Management',
        'products': 'Products Management',
        'restaurants': 'Restaurants',
        'customers': 'Customers',
        'reviews': 'Reviews',
        'analytics': 'Analytics',
        'settings': 'Settings'
    };

    document.title = titles[sectionId] + ' - FreshBites Admin';
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'admin-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: mediumseagreen;
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

// Initialize Tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.dataset.tooltip;
            document.body.appendChild(tooltip);

            const rect = this.getBoundingClientRect();
            tooltip.style.cssText = `
                position: absolute;
                background-color: darkslategray;
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 1000;
                top: ${rect.top - tooltip.offsetHeight - 8}px;
                left: ${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px;
            `;

            this._tooltip = tooltip;
        });

        el.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                this._tooltip = null;
            }
        });
    });
}

// Check Mobile
function checkMobile() {
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
    }
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
window.Admin = {
    showSection,
    toggleSidebar,
    showNotification,
    createModal
};
