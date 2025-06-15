// Import the functions you need from the SDKs you need
// Make sure these imports match the SDKs you included in your HTML files (e.g., firebase-app-compat.js, firebase-auth-compat.js, etc.)
import { initializeApp } from "firebase/app";
// You will need to import other services as you use them, e.g.:
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBU4c8ZwP_Z1X97mMhcLKsynm5jMwio2yA",
    authDomain: "sample-firebase-ai-app-9f65a.firebaseapp.com",
    projectId: "sample-firebase-ai-app-9f65a",
    storageBucket: "sample-firebase-ai-app-9f65a.firebasestorage.app",
    messagingSenderId: "828986099352",
    appId: "1:828986099352:web:15385ff19df3f3aaf532ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// You can now access Firebase services like this:
// const auth = getAuth(app);
// const db = getFirestore(app);
// console.log("Firebase app initialized!", app);


// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // --- Header and Navigation Logic ---
    const menuButton = document.querySelector('.menu-button');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuButton && navLinks) {
        menuButton.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links (if they are internal anchors)
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

    // --- Product Search Logic ---
    // This is a client-side filter simulation. For a real AI search, you'd integrate with a backend.
    function searchProduct() {
        const searchInput = document.getElementById('searchInput').value.toLowerCase();
        const resultsSection = document.getElementById('results');
        const resultsGrid = resultsSection.querySelector('.product-grid');
        const featuredProductsSection = document.getElementById('products');

        // Clear previous results
        resultsGrid.innerHTML = '';

        const allProducts = [
            { id: 1, name: 'Hydrating Serum', price: '29.99', image: 'syrum.jpg' },
            { id: 2, name: 'Moisturizing Cream', price: '24.99', image: 'The.jpg' },
            { id: 3, name: 'Cleansing Gel', price: '19.99', image: 'kk.jpg' },
            { id: 4, name: 'Eye Cream', price: '34.99', image: 'vitac.jpg' },
            // Add more products if you have them, with relevant data
        ];

        const filteredProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchInput)
        );

        if (searchInput === '') {
            // If search bar is empty, show featured products and hide results
            featuredProductsSection.style.display = 'block';
            resultsSection.style.display = 'none';
        } else {
            // Hide featured products and show results
            featuredProductsSection.style.display = 'none';
            if (filteredProducts.length > 0) {
                filteredProducts.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.classList.add('product-card');
                    productCard.innerHTML = `
                        <img src="${product.image}" alt="${product.name}" class="product-image">
                        <div class="product-info">
                            <h3 class="product-title">${product.name}</h3>
                            <p class="product-price">$${product.price}</p>
                            <button class="add-to-cart-btn" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}" data-product-image="${product.image}">
                                Add to Cart
                            </button>
                        </div>
                    `;
                    resultsGrid.appendChild(productCard);
                });
                resultsSection.style.display = 'block'; // Show the results section
            } else {
                resultsGrid.innerHTML = '<p style="text-align:center; padding:2rem;">No products found for your search.</p>';
                resultsSection.style.display = 'block';
            }
        }
    }
    // Make searchProduct globally accessible for the onclick attribute
    window.searchProduct = searchProduct;


    // --- Add to Cart Functionality ---
    // This is a basic example using localStorage. For a real e-commerce site, you'd use a backend.
    const productCards = document.querySelectorAll('.product-card'); // Observe all product cards

    // Intersection Observer for product card animation (from your original script)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in'); // Assuming you have a fade-in CSS class
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    productCards.forEach(card => {
        observer.observe(card);
    });

    // Add to cart event listener
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const button = event.target;
            const productId = button.dataset.productId;
            const productName = button.dataset.productName;
            const productPrice = parseFloat(button.dataset.productPrice);
            const productImage = button.dataset.productImage;

            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            const existingItemIndex = cart.findIndex(item => item.id === productId);

            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            // Replace alert with a custom modal or message box for better UX
            // alert(`${productName} added to cart!`); 
            console.log(`${productName} added to cart!`); // For now, log to console
            // You might want to update a cart icon counter here
        }
    });

    // --- Cart Page Specific Logic (assuming cart.html uses this script) ---
    if (document.body.classList.contains('cart-page')) {
        renderCartItems();
        updateOrderSummary();
        renderPreviousOrders(); // Call this when cart page loads

        function renderCartItems() {
            const cartItemsContainer = document.getElementById('cartItems');
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            if (!cartItemsContainer) return; // Exit if not on cart page

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
                return;
            }

            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="item-image">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p class="item-price">$${item.price.toFixed(2)}</p>
                        <div class="quantity-controls">
                            <button class="decrease-quantity" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-quantity" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            `).join('');

            attachCartEventListeners();
        }

        function attachCartEventListeners() {
            document.querySelectorAll('.increase-quantity').forEach(button => {
                button.addEventListener('click', (e) => updateCartQuantity(e.target.dataset.id, 1));
            });
            document.querySelectorAll('.decrease-quantity').forEach(button => {
                button.addEventListener('click', (e) => updateCartQuantity(e.target.dataset.id, -1));
            });
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', (e) => removeItemFromCart(e.target.dataset.id));
            });
        }

        function updateCartQuantity(id, delta) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const itemIndex = cart.findIndex(item => item.id === id);

            if (itemIndex > -1) {
                cart[itemIndex].quantity += delta;
                if (cart[itemIndex].quantity <= 0) {
                    cart.splice(itemIndex, 1); // Remove if quantity is 0 or less
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCartItems();
                updateOrderSummary();
            }
        }

        function removeItemFromCart(id) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(item => item.id !== id);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems();
            updateOrderSummary();
        }

        function updateOrderSummary() {
            const subtotalEl = document.getElementById('subtotal');
            const shippingEl = document.getElementById('shipping');
            const taxEl = document.getElementById('tax');
            const totalEl = document.getElementById('total');
            const promoFeedback = document.getElementById('promoFeedback');

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            let shipping = subtotal > 0 ? 5.00 : 0; // Example: $5 shipping if cart not empty
            let taxRate = 0.08; // 8% tax
            let tax = subtotal * taxRate;
            let total = subtotal + shipping + tax;

            // Apply promo code discount (if any applied)
            const promoCode = localStorage.getItem('appliedPromoCode');
            if (promoCode === 'SAVE10') { // Example promo code
                total *= 0.90; // 10% discount
                if (promoFeedback) { // Check if promoFeedback element exists
                    promoFeedback.textContent = '10% discount applied!';
                    promoFeedback.style.color = '#174A2B';
                }
            } else {
                if (promoFeedback) { // Check if promoFeedback element exists
                    promoFeedback.textContent = ''; // Clear feedback if no valid promo applied
                }
            }

            if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
            if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
            if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
            if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
        }

        const promoCodeInput = document.getElementById('promoCode');
        const applyPromoBtn = document.getElementById('applyPromo');
        const promoFeedback = document.getElementById('promoFeedback');

        if (applyPromoBtn) {
            applyPromoBtn.addEventListener('click', () => {
                const code = promoCodeInput.value.trim().toUpperCase();
                if (code === 'SAVE10') { // Example promo code
                    localStorage.setItem('appliedPromoCode', code);
                    updateOrderSummary();
                } else if (code === '') {
                    if (promoFeedback) {
                        promoFeedback.textContent = 'Please enter a promo code.';
                        promoFeedback.style.color = '#CD5C5C';
                    }
                    localStorage.removeItem('appliedPromoCode'); // Clear applied promo if input is empty
                    updateOrderSummary();
                } else {
                    if (promoFeedback) {
                        promoFeedback.textContent = 'Invalid promo code.';
                        promoFeedback.style.color = '#CD5C5C';
                    }
                    localStorage.removeItem('appliedPromoCode');
                    updateOrderSummary();
                }
            });
        }

        // --- Checkout Logic ---
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                if (cart.length > 0) {
                    const orderDate = new Date().toISOString().split('T')[0]; //YYYY-MM-DD
                    const orderTotal = parseFloat(document.getElementById('total').textContent.replace('$', ''));

                    // Store current cart as a previous order
                    let previousOrders = JSON.parse(localStorage.getItem('previousOrders')) || [];
                    previousOrders.push({
                        date: orderDate,
                        items: cart,
                        total: orderTotal
                    });
                    localStorage.setItem('previousOrders', JSON.stringify(previousOrders));

                    localStorage.removeItem('cart'); // Clear the cart after checkout
                    localStorage.removeItem('appliedPromoCode'); // Clear any applied promo code
                    alert('Order placed successfully! Thank you for your purchase.');
                    window.location.href = 'index.html'; // Redirect to home or a thank you page
                } else {
                    alert('Your cart is empty. Please add items before checking out.');
                }
            });
        }

        function renderPreviousOrders() {
            const previousOrdersContainer = document.getElementById('previousOrders');
            let previousOrders = JSON.parse(localStorage.getItem('previousOrders')) || [];

            if (!previousOrdersContainer) return; // Exit if not on cart page or element not found

            if (previousOrders.length === 0) {
                previousOrdersContainer.innerHTML = '<p class="empty-orders-message">No previous orders found.</p>';
                return;
            }

            previousOrdersContainer.innerHTML = previousOrders.map(order => `
                <div class="previous-order-card">
                    <h4>Order Date: ${order.date}</h4>
                    <p>Total: $${order.total.toFixed(2)}</p>
                    <ul class="order-items-list">
                        ${order.items.map(item => `
                            <li>${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</li>
                        `).join('')}
                    </ul>
                </div>
            `).join('');
        }
    }


    // --- Carousel Logic (if you have product detail pages or similar)
    const carousel = document.getElementById('productCarousel');
    const dotsContainer = document.getElementById('carouselDots');
    if (carousel && dotsContainer) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const nextBtn = document.getElementById('carouselNext'); // Ensure this ID exists on your button
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

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetTimer();
            });
        }

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
