// Cart functionality
let cart = [];
let cartCount = 0;
let total = 0;

// Function to add item to cart
function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity++;
        existingItem.totalPrice += price;
    } else {
        cart.push({ name: productName, price: price, quantity: 1, totalPrice: price });
    }
    cartCount++;
    total += price;
    updateCartDisplay();
    saveCart();
}

// Function to update cart display
function updateCartDisplay() {
    document.getElementById('cart-count').textContent = cartCount;
    if (document.getElementById('cart-items')) {
        document.getElementById('cart-items').innerHTML = '';
        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="cart-item">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">$${item.price}</span>
                    <div class="quantity-controls">
                        <button onclick="decreaseQuantity(${index})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button onclick="increaseQuantity(${index})">+</button>
                    </div>
                    <span class="item-total">$${item.totalPrice.toFixed(2)}</span>
                    <button class="remove-btn" onclick="removeFromCart('${item.name}')">Remove</button>
                </div>
            `;
            document.getElementById('cart-items').appendChild(li);
        });
        document.getElementById('cart-total').textContent = total.toFixed(2);
    }
}

// Function to proceed to checkout
function checkout() {
    window.location.href = 'checkout.html';
}

// Checkout functionality
if (window.location.pathname.includes('checkout.html')) {
    // Load cart items to checkout
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    }
    updateCartDisplay();
    updateCheckoutDisplay();
}

function updateCheckoutDisplay() {
    if (document.getElementById('checkout-items')) {
        document.getElementById('checkout-items').innerHTML = '';
        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
            document.getElementById('checkout-items').appendChild(li);
        });
        document.getElementById('checkout-subtotal').textContent = total.toFixed(2);
        document.getElementById('checkout-total').textContent = total.toFixed(2);
    }
}

// Function to apply coupon
function applyCoupon() {
    const coupon = document.getElementById('coupon').value;
    let discount = 0;
    if (coupon === 'SAVE10') {
        discount = total * 0.1;
    }
    document.getElementById('discount').textContent = discount.toFixed(2);
    document.getElementById('checkout-total').textContent = (total - discount).toFixed(2);
}

// Function to validate checkout form
function validateCheckoutForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    if (!name || !email || !address) {
        alert('Please fill in all required fields.');
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    return true;
}

// Handle checkout form submission
document.getElementById('checkout-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    if (validateCheckoutForm()) {
        alert('Purchase completed! Thank you for shopping with Advay\'s Factory.');
        cart = [];
        cartCount = 0;
        total = 0;
        updateCartDisplay();
        saveCart();
        window.location.href = 'index.html';
    }
});

// Handle contact form submission
document.getElementById('contact-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Message sent! We will get back to you soon.');
    document.getElementById('contact-form').reset();
});

// Load cart from localStorage on page load
window.addEventListener('load', function() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
        updateCartDisplay();
    }
});

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to remove item from cart
function removeFromCart(productName) {
    const itemIndex = cart.findIndex(item => item.name === productName);
    if (itemIndex > -1) {
        const item = cart[itemIndex];
        cartCount -= item.quantity;
        total -= item.totalPrice;
        cart.splice(itemIndex, 1);
        updateCartDisplay();
        saveCart();
    }
}

// Function to increase quantity
function increaseQuantity(index) {
    cart[index].quantity++;
    cart[index].totalPrice += cart[index].price;
    cartCount++;
    total += cart[index].price;
    updateCartDisplay();
    saveCart();
}

// Function to decrease quantity
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
        cart[index].totalPrice -= cart[index].price;
        cartCount--;
        total -= cart[index].price;
        updateCartDisplay();
        saveCart();
    }
}

// Function to clear cart
function clearCart() {
    cart = [];
    cartCount = 0;
    total = 0;
    updateCartDisplay();
    saveCart();
}

// Function to search products
function searchProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const products = document.querySelectorAll('.product');
    products.forEach(product => {
        const name = product.querySelector('h3').textContent.toLowerCase();
        if (name.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Function to toggle hamburger menu
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}
// Update saveCart on cart changes
const originalAddToCart = addToCart;
addToCart = function(productName, price) {
    originalAddToCart(productName, price);
    saveCart();
};;