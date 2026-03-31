/* ============================================
   FreshBites - Authentication JavaScript
   Login & Register Functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Check URL parameters for register view
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('register') === 'true') {
        showRegister();
    }

    // Login Form Validation
    const loginForm = document.querySelector('#loginForm form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const remember = document.querySelector('input[name="remember"]').checked;

            // Basic validation
            if (!validateEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }

            if (password.length < 6) {
                showError('Password must be at least 6 characters');
                return;
            }

            // Simulate login (replace with actual API call)
            simulateLogin(email, password, remember);
        });
    }

    // Register Form Validation
    const registerForm = document.querySelector('#registerForm form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('registerEmail').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const terms = document.querySelector('input[name="terms"]').checked;

            // Validation
            if (firstName.length < 2) {
                showError('Please enter your first name');
                return;
            }

            if (lastName.length < 2) {
                showError('Please enter your last name');
                return;
            }

            if (!validateEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }

            if (!validatePhone(phone)) {
                showError('Please enter a valid phone number');
                return;
            }

            if (password.length < 8) {
                showError('Password must be at least 8 characters');
                return;
            }

            if (!validatePassword(password)) {
                showError('Password must contain letters and numbers');
                return;
            }

            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }

            if (!terms) {
                showError('Please accept the Terms of Service');
                return;
            }

            // Simulate registration (replace with actual API call)
            simulateRegister({
                firstName,
                lastName,
                email,
                phone,
                password
            });
        });
    }

    // Social Login Buttons
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
            showNotification(`${provider} login coming soon!`);
        });
    });

    // Forgot Password Link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            showForgotPasswordModal();
        });
    }
});

// Toggle between Login and Register forms
function showLogin() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm && registerForm) {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        
        // Add fade animation
        loginForm.style.opacity = '0';
        loginForm.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            loginForm.style.transition = 'all 0.3s ease';
            loginForm.style.opacity = '1';
            loginForm.style.transform = 'translateX(0)';
        }, 10);
        
        // Update URL
        window.history.replaceState({}, '', 'login.html');
    }
}

function showRegister() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm && registerForm) {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        
        // Add fade animation
        registerForm.style.opacity = '0';
        registerForm.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            registerForm.style.transition = 'all 0.3s ease';
            registerForm.style.opacity = '1';
            registerForm.style.transform = 'translateX(0)';
        }, 10);
        
        // Update URL
        window.history.replaceState({}, '', 'login.html?register=true');
    }
}

// Toggle Password Visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.toggle-password i');
    
    if (input.type === 'password') {
        input.type = 'text';
        button.classList.remove('fa-eye');
        button.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        button.classList.remove('fa-eye-slash');
        button.classList.add('fa-eye');
    }
}

// Validation Functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function validatePassword(password) {
    // At least one letter and one number
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasLetter && hasNumber;
}

// Show Error Message
function showError(message) {
    // Remove existing error
    const existingError = document.querySelector('.auth-error');
    if (existingError) {
        existingError.remove();
    }

    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'auth-error';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;

    // Add styles
    errorDiv.style.cssText = `
        background-color: rgba(220, 53, 69, 0.1);
        color: crimson;
        padding: 12px 15px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 20px;
        font-size: 14px;
        animation: shake 0.5s ease;
    `;

    // Insert after form header
    const form = document.querySelector('.auth-form:not(.hidden) form');
    if (form) {
        form.insertBefore(errorDiv, form.firstChild);
    }

    // Auto remove after 5 seconds
    setTimeout(() => {
        errorDiv.style.opacity = '0';
        errorDiv.style.transform = 'translateY(-10px)';
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}

// Show Success Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'auth-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
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

// Simulate Login
function simulateLogin(email, password, remember) {
    // Show loading state
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    submitBtn.disabled = true;

    // Simulate API delay
    setTimeout(() => {
        // Store user data (in real app, this would be a token)
        const userData = {
            email: email,
            name: 'Demo User',
            role: 'user',
            loggedIn: true
        };

        if (remember) {
            localStorage.setItem('freshbites_user', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('freshbites_user', JSON.stringify(userData));
        }

        showNotification('Login successful! Redirecting...');

        // Redirect to home
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 1500);
}

// Simulate Register
function simulateRegister(userData) {
    // Show loading state
    const submitBtn = document.querySelector('#registerForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    submitBtn.disabled = true;

    // Simulate API delay
    setTimeout(() => {
        // Store user data
        const newUser = {
            ...userData,
            role: 'user',
            loggedIn: true
        };

        localStorage.setItem('freshbites_user', JSON.stringify(newUser));

        showNotification('Account created successfully! Redirecting...');

        // Redirect to home
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 1500);
}

// Show Forgot Password Modal
function showForgotPasswordModal() {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Reset Password</h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p>Enter your email address and we'll send you a link to reset your password.</p>
                <form id="forgotPasswordForm">
                    <div class="form-group">
                        <label>Email Address</label>
                        <div class="input-group">
                            <i class="fas fa-envelope"></i>
                            <input type="email" placeholder="Enter your email" required>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full">
                        Send Reset Link
                    </button>
                </form>
            </div>
        </div>
    `;

    // Add styles
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

    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .modal {
            background-color: white;
            border-radius: 16px;
            width: 90%;
            max-width: 400px;
            animation: slideUp 0.3s ease;
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid whitesmoke;
        }
        .modal-header h3 {
            font-size: 20px;
            font-weight: 700;
        }
        .modal-close {
            background: none;
            border: none;
            font-size: 20px;
            color: gray;
            cursor: pointer;
        }
        .modal-body {
            padding: 20px;
        }
        .modal-body p {
            color: gray;
            margin-bottom: 20px;
            font-size: 14px;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;

    document.head.appendChild(modalStyles);
    document.body.appendChild(modal);

    // Handle form submission
    const forgotForm = modal.querySelector('#forgotPasswordForm');
    forgotForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        // Simulate sending reset link
        showNotification('Reset link sent to ' + email);
        closeModal();
    });

    // Close on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Close Modal
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    }
}

// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('freshbites_user') || sessionStorage.getItem('freshbites_user');
    return user ? JSON.parse(user) : null;
}

// Logout function
function logout() {
    localStorage.removeItem('freshbites_user');
    sessionStorage.removeItem('freshbites_user');
    window.location.href = 'login.html';
}

// Export functions
window.Auth = {
    showLogin,
    showRegister,
    togglePassword,
    checkAuth,
    logout,
    closeModal
};
