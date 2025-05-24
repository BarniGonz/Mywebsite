let cart = [];
let isLoggedIn = false;

function showActionBar(message, isSuccess) {
    const actionBar = document.getElementById('actionBar');
    actionBar.innerText = message;
    actionBar.className = isSuccess ? 'action-bar success' : 'action-bar error';
    actionBar.style.display = 'block';
}

function addToCart(productName, price) {
    if (!isLoggedIn) {
        showActionBar('Please log in or sign up to add items to your cart.', false);
        return;
    }
    cart.push({ name: productName, price: price });
    showActionBar(`${productName} has been added to your cart.`, true);
    updateCartCount();
}

function updateCartCount() {
    document.getElementById('cartCount').innerText = cart.length;
}

function viewCart() {
    if (!isLoggedIn) {
        showActionBar('Please log in or sign up to view your cart.', false);
        return;
    }
    const cartModal = document.getElementById('cartModal');
    const cartItemsDiv = document.getElementById('cartItems');
    const totalPriceDiv = document.getElementById('totalPrice');
    cartItemsDiv.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        cartItemsDiv.innerHTML += `<p>${item.name}: $${item.price.toFixed(2)}</p>`;
        total += item.price;
    });
    totalPriceDiv.innerText = total.toFixed(2);
    cartModal.style.display = 'block';
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

function checkout() {
    if (cart.length === 0) {
        showActionBar('Your cart is empty!', false);
        return;
    }
    closeCart();
    document.getElementById('paymentModal').style.display = 'block';
}

function processPayment(event) {
    event.preventDefault();
    alert('Payment processed successfully! Thank you for your order!');
    cart = [];
    updateCartCount();
    closePayment();
}

function closePayment() {
    document.getElementById('paymentModal').style.display = 'none';
}

function openSignup() {
    document.getElementById('signupModal').style.display = 'block';
}

function openLogin() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

const users = JSON.parse(localStorage.getItem('users')) || [];

function signup(event) {
    event.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    if (users.some(user => user.username === username)) {
        showMessage('signupMessage', 'Username already exists!', false);
        return;
    }

    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    showMessage('signupMessage', 'Sign up successful! You can now log in.', true);
}

function login(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        isLoggedIn = true;
        showActionBar('Login successful! Welcome!', true);
        document.getElementById('mainContent').style.display = 'block';
        closeModal(document.getElementById('loginModal'));
        closeModal(document.getElementById('signupModal'));
    } else {
        showMessage('loginMessage', 'Invalid username or password!', false);
    }
}

function showMessage(element, message, isSuccess) {
    const messageDiv = document.getElementById(element);
    messageDiv.innerText = message;
    messageDiv.className = isSuccess ? 'message success' : 'message error';
    messageDiv.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.product button').forEach(button => {
        button.addEventListener('click', () => {
            const productElement = button.parentElement;
            const productName = productElement.dataset.name;
            const price = parseFloat(productElement.dataset.price);
            addToCart(productName, price);
        });
    });

    document.getElementById('viewCartBtn').addEventListener('click', viewCart);
    document.querySelectorAll('.close').forEach(closeButton => {
        closeButton.addEventListener('click', () => closeModal(closeButton.closest('.modal')));
    });
    
    document.getElementById('checkoutBtn').addEventListener('click', checkout);
    document.getElementById('paymentForm').addEventListener('submit', processPayment);
    document.getElementById('signupBtn').addEventListener('click', openSignup);
    document.getElementById('loginBtn').addEventListener('click', openLogin);
    document.getElementById('signupForm').addEventListener('submit', signup);
    document.getElementById('loginForm').addEventListener('submit', login);
});

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modals = [document.getElementById('cartModal'), document.getElementById('paymentModal'), document.getElementById('signupModal'), document.getElementById('loginModal')];
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });
};