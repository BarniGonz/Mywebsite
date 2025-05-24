let users = JSON.parse(localStorage.getItem('users')) || [];
let isLoggedIn = false;

function showActionBar(message, isSuccess) {
    const actionBar = document.getElementById('actionBar');
    actionBar.innerText = message;
    actionBar.className = isSuccess ? 'action-bar success' : 'action-bar error';
    actionBar.style.display = 'block';
    setTimeout(() => { actionBar.style.display = 'none'; }, 3000);
}

function openModal(showSignup = false) {
    const modal = document.getElementById('authModal');
    modal.classList.add('show');
    document.getElementById('loginSection').style.display = showSignup ? 'none' : 'block';
    document.getElementById('signupSection').style.display = showSignup ? 'block' : 'none';
    // Clear messages and form fields
    document.getElementById('loginMessage').style.display = 'none';
    document.getElementById('signupMessage').style.display = 'none';
    document.getElementById('loginForm').reset();
    document.getElementById('signupForm').reset();
}

function closeModal() {
    document.getElementById('authModal').classList.remove('show');
}

function signup(event) {
    event.preventDefault();
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
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
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        isLoggedIn = true;
        showActionBar('Login successful! Welcome!', true);
        document.getElementById('mainContent').style.display = 'block';
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('signupBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'inline-block';
        closeModal();
    } else {
        showMessage('loginMessage', 'Invalid username or password!', false);
    }
}

function logout() {
    isLoggedIn = false;
    showActionBar('You have logged out.', true);
    document.getElementById('loginBtn').style.display = 'inline-block';
    document.getElementById('signupBtn').style.display = 'inline-block';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('mainContent').style.display = 'none';
}

function showMessage(elementId, message, isSuccess) {
    const messageDiv = document.getElementById(elementId);
    messageDiv.innerText = message;
    messageDiv.className = isSuccess ? 'message success' : 'message error';
    messageDiv.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signupForm').addEventListener('submit', signup);
    document.getElementById('loginForm').addEventListener('submit', login);
    document.getElementById('signupBtn').addEventListener('click', () => openModal(true));
    document.getElementById('loginBtn').addEventListener('click', () => openModal(false));
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('closeModal').addEventListener('click', closeModal);

    // Switch between login/signup in modal
    document.getElementById('showSignup').addEventListener('click', (e) => {
        e.preventDefault();
        openModal(true);
    });
    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        openModal(false);
    });

    // Close modal when clicking outside content
    document.getElementById('authModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    // Prompt for login before showing the main content
    if (!isLoggedIn) {
        openModal(false);
    }
});
