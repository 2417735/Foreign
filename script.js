// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuButton = document.querySelector('.menu-button');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuButton) {
        menuButton.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Auth links handlers
    const authLinks = document.querySelectorAll('.auth-link');
    authLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const action = link.getAttribute('href').replace('#', '');
            // You can replace this with your actual auth logic
            alert(`${action} clicked! Add your ${action} form or redirect here.`);
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation to product cards on scroll
    const productCards = document.querySelectorAll('.product-card');
    
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    productCards.forEach(card => {
        observer.observe(card);
    });

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const cartCount = document.getElementById('cartCount');
        let count = 0;
        cart.forEach(item => count += item.quantity);
        if (cartCount) cartCount.textContent = count;
    }
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = this.getAttribute('data-product');
            const productCard = this.closest('.product-card');
            const priceText = productCard.querySelector('.product-price').textContent;
            const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existing = cart.find(item => item.name === productName);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ name: productName, quantity: 1, price });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            alert(`Added ${productName} to cart!`);
        });
    });
    updateCartCount();

    // Handle navigation links
    const signupLinks = document.querySelectorAll('a[href="#signup"]');
    const loginLinks = document.querySelectorAll('a[href="#login"]');

    signupLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'signup.html';
        });
    });

    loginLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    });

    // Google Sign-In
    function initializeGoogleSignIn() {
        const googleButtons = document.querySelectorAll('.google-btn');
        googleButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Initialize Google Sign-In
                google.accounts.id.initialize({
                    client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google Client ID
                    callback: handleGoogleSignIn
                });
                google.accounts.id.prompt();
            });
        });
    }

    function handleGoogleSignIn(response) {
        // Handle the Google Sign-In response
        console.log('Google Sign-In response:', response);
        // Here you would typically send this to your server for verification
        // and then create/login the user
        showLoadingState();
        setTimeout(() => {
            hideLoadingState();
            window.location.href = 'index.html';
        }, 1500);
    }

    // Apple Sign-In
    function initializeAppleSignIn() {
        const appleButtons = document.querySelectorAll('.apple-btn');
        appleButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Initialize Apple Sign-In
                // Note: You'll need to implement Apple Sign-In according to their guidelines
                console.log('Apple Sign-In clicked');
                showLoadingState();
                setTimeout(() => {
                    hideLoadingState();
                    window.location.href = 'index.html';
                }, 1500);
            });
        });
    }

    // Form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Here you would typically send this to your server for authentication
            console.log('Login attempt:', { email });
            showLoadingState();
            setTimeout(() => {
                hideLoadingState();
                window.location.href = 'index.html';
            }, 1500);
        });
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Validate password match
            if (password !== confirmPassword) {
                showError('confirm-password', 'Passwords do not match!');
                return;
            }

            // Validate password strength
            if (password.length < 8) {
                showError('password', 'Password must be at least 8 characters long!');
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError('email', 'Please enter a valid email address!');
                return;
            }

            // If all validations pass, create account
            const userData = { fullname, email, password };
            console.log('Creating account:', userData);
            
            showLoadingState();
            setTimeout(() => {
                hideLoadingState();
                window.location.href = 'index.html';
            }, 1500);
        });
    }

    // Helper functions
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        formGroup.classList.add('error');
        
        let errorMessage = formGroup.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            formGroup.appendChild(errorMessage);
        }
        errorMessage.textContent = message;
    }

    function showLoadingState() {
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }
    }

    function hideLoadingState() {
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    // Initialize social sign-in
    if (typeof google !== 'undefined') {
        initializeGoogleSignIn();
    }
    initializeAppleSignIn();

    // Explore Winner of the Month expand-once
    const exploreBtn = document.getElementById('exploreToggle');
    const winnerSection = document.getElementById('winnerSection');
    if (exploreBtn && winnerSection) {
        winnerSection.classList.remove('active'); // Ensure hidden by default
        exploreBtn.addEventListener('click', function() {
            winnerSection.classList.add('active');
            exploreBtn.style.display = 'none';
        }, { once: true });
    }

    // Glow Newsletter Subscription Popup & Google Sheets Integration
    const glowForm = document.getElementById('glowNewsletterForm');
    const glowEmailInput = document.getElementById('glowEmailInput');
    const glowPopup = document.getElementById('glowPopup');
    const closeGlowPopup = document.getElementById('closeGlowPopup');

    if (glowForm && glowEmailInput && glowPopup && closeGlowPopup) {
        glowForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Get email
            const email = glowEmailInput.value;
            // Get date
            const date = new Date().toLocaleString();
            // Get location (if available)
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    const location = position.coords.latitude + ',' + position.coords.longitude;
                    submitToGoogleSheets(email, location, date);
                }, function() {
                    submitToGoogleSheets(email, 'Permission denied', date);
                }, {timeout: 5000});
            } else {
                submitToGoogleSheets(email, 'Not supported', date);
            }
            // Show popup
            glowPopup.classList.add('active');
            glowForm.reset();
        });
        closeGlowPopup.addEventListener('click', function() {
            glowPopup.classList.remove('active');
        });
    }

    // Google Sheets Integration (via Google Apps Script endpoint)
    function submitToGoogleSheets(email, location, date) {
        const endpoint = 'https://script.google.com/macros/s/AKfycbzl_vZ_6p02P5KKkXHq4ZKyuv_XyrXAa6L1cnxykIc/dev';
        fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, location, date })
        });
    }

    // Product Carousel Logic
    const carousel = document.getElementById('productCarousel');
    const dotsContainer = document.getElementById('carouselDots');
    if (carousel && dotsContainer) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const nextBtn = document.getElementById('carouselNext');
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        let current = 0;
        let timer = null;
        function showSlide(idx) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === idx);
                dots[i].classList.toggle('active', i === idx);
            });
            current = idx;
        }
        function nextSlide() {
            showSlide((current + 1) % slides.length);
        }
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetTimer();
        });
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                showSlide(i);
                resetTimer();
            });
        });
        function resetTimer() {
            if (timer) clearInterval(timer);
            timer = setInterval(nextSlide, 5000);
        }
        resetTimer();
    }
}); 
