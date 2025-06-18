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
            alert(`${productName} added to cart!`);
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
                promoFeedback.textContent = '10% discount applied!';
                promoFeedback.style.color = '#174A2B';
            } else {
                 promoFeedback.textContent = ''; // Clear feedback if no valid promo applied
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
                     promoFeedback.textContent = 'Please enter a promo code.';
                     promoFeedback.style.color = '#CD5C5C';
                     localStorage.removeItem('appliedPromoCode'); // Clear any invalid code
                } else {
                    promoFeedback.textContent = 'Invalid promo code.';
                    promoFeedback.style.color = '#CD5C5C';
                    localStorage.removeItem('appliedPromoCode'); // Clear any invalid code
                }
            });
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                if (cart.length === 0) {
                    alert('Your cart is empty. Please add items before checking out.');
                    return;
                }

                // Simulate order completion
                const orderDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                let previousOrders = JSON.parse(localStorage.getItem('previousOrders')) || [];
                previousOrders.unshift({ date: orderDate, items: cart, total: document.getElementById('total').textContent }); // Add current cart as a new order

                localStorage.setItem('previousOrders', JSON.stringify(previousOrders));
                localStorage.removeItem('cart'); // Clear the current cart
                localStorage.removeItem('appliedPromoCode'); // Clear applied promo code

                alert('Order placed successfully! Redirecting to homepage.');
                window.location.href = 'index.html'; // Redirect to homepage or confirmation page
            });
        }

        // Previous Orders logic
        function renderPreviousOrders() {
            const orders = JSON.parse(localStorage.getItem('previousOrders') || '[]');
            const container = document.getElementById('previousOrders');
            if (!container) return; // Exit if not on cart page

            if (!orders.length) {
                container.innerHTML = '<div style="color:#bbb;text-align:center;font-size:1.05rem; padding:1.5rem;">No previous orders yet.</div>';
                return;
            }
            container.innerHTML = orders.map(order => `
                <div style="background:#F9F6F2;border-radius:10px;padding:1.2rem 1.2rem 1rem 1.2rem;margin-bottom:1.2rem;box-shadow:0 2px 8px rgba(23,74,43,0.06);">
                    <div style="color:#174A2B;font-weight:600;font-size:1.08rem;margin-bottom:0.3rem;">Order Date: ${order.date}</div>
                    <ul style="margin:0 0 0.5rem 1.2rem;padding:0;color:#222;font-size:1rem;">
                        ${order.items.map(item => `<li>${item.name} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
                    </ul>
                    <div style="color:#222;font-weight:600;font-size:1.1rem;text-align:right;">Total: ${order.total}</div>
                </div>
            `).join('');
        }
    }


    // --- Login/Signup Page Specific Logic (assuming login.html and signup.html use this script) ---
    // Google Sign-In init (placeholder)
    // This assumes you have a Google Client ID set up for your project
    // google.accounts.id.initialize({
    //     client_id: "YOUR_GOOGLE_CLIENT_ID", // Replace with your actual client ID
    //     callback: handleCredentialResponse
    // });
    // google.accounts.id.renderButton(
    //     document.getElementById("googleSignIn"), // Ensure this ID exists on your button
    //     { theme: "outline", size: "large", text: "continue_with", width: "300" }  // customization attributes
    // );
    // function handleCredentialResponse(response) {
    //     console.log("Encoded JWT ID token: " + response.credential);
    //     // You would send this credential to your backend for verification
    //     alert("Google Sign-In successful! Check console for token.");
    //     // Redirect or update UI as needed
    // }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;

            // Simple client-side validation/simulation
            if (email === 'user@example.com' && password === 'password123') {
                alert('Login successful!');
                window.location.href = 'index.html'; // Redirect to home page
            } else {
                alert('Invalid email or password.');
            }
        });
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fullname = signupForm.fullname.value;
            const email = signupForm.email.value;
            const password = signupForm.password.value;
            const confirmPassword = signupForm['confirm-password'].value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            // Simple client-side simulation
            alert(`Account created for ${fullname} (${email})!`);
            window.location.href = 'login.html'; // Redirect to login page after signup
        });
    }

    // --- Survey Page Specific Logic (assuming survey.html uses this script) ---
    // If the survey page is separate, its logic will be self-contained or use specific IDs
    // The previous survey.html snippet had its JS inline, which is fine, but if you want it here:
    if (document.body.classList.contains('survey-page')) {
        const step1 = document.getElementById('surveyStep1');
        const step2 = document.getElementById('surveyStep2');
        const step3 = document.getElementById('surveyStep3');
        const step4 = document.getElementById('surveyStep4');
        const thankYou = document.getElementById('surveyThankYou');

        // Initially show only the first step
        if (step1) step1.style.display = 'block';
        if (step2) step2.style.display = 'none';
        if (step3) step3.style.display = 'none';
        if (step4) step4.style.display = 'none';
        if (thankYou) thankYou.style.display = 'none';


        const formStep1 = document.getElementById('formStep1');
        if(formStep1) {
            formStep1.onsubmit = function(e) {
                e.preventDefault();
                if (this.name.value && this.email.value) {
                    if (step1) step1.style.display = 'none';
                    if (step2) step2.style.display = 'block';
                } else {
                    alert('Please fill in your name and email.');
                }
            };
        }

        const formStep2 = document.getElementById('formStep2');
        if(formStep2) {
            formStep2.onsubmit = function(e) {
                e.preventDefault();
                if (step2) step2.style.display = 'none';
                if (step3) step3.style.display = 'block';
            };
        }

        const formStep3 = document.getElementById('formStep3');
        if(formStep3) {
            formStep3.onsubmit = function(e) {
                e.preventDefault();
                if (step3) step3.style.display = 'none';
                if (step4) step4.style.display = 'block';
            };
        }

        const formStep4 = document.getElementById('formStep4');
        if(formStep4) {
            formStep4.onsubmit = function(e) {
                e.preventDefault();
                // In a real app, you'd send this data to a server
                alert('Survey submitted!');
                if (step4) step4.style.display = 'none';
                if (thankYou) thankYou.style.display = 'block';

                // Simulate saving survey data (e.g., to local storage or a backend)
                const name = document.getElementById('surveyName').value;
                const email = document.getElementById('surveyEmail').value;
                const skinType = document.querySelector('input[name="skinType"]:checked')?.value || 'Not specified';
                const concerns = Array.from(document.querySelectorAll('input[name="skinConcern"]:checked')).map(cb => cb.value);
                const routine = document.getElementById('currentRoutine').value;
                const goals = document.getElementById('skinGoals').value;

                console.log({ name, email, skinType, concerns, routine, goals });
                // If you had a real endpoint to send data:
                // sendSurveyDataToServer({ name, email, skinType, concerns, routine, goals });
            };
        }

        // Function to simulate sending data to a server (replace with actual API call)
        function sendSurveyDataToServer(data) {
            const endpoint = 'https://script.google.com/macros/s/AKfycbw6H3YIBl_vZ_6p02P5KKkXHq4ZKyuv_XyrXAa6L1cnxykIc/dev'; // Your provided endpoint
            fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => console.log('Survey data sent:', data))
            .catch(error => console.error('Error sending survey data:', error));
        }

        // Product Carousel Logic (from your original script, likely for product detail pages or similar)
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
    }
});
