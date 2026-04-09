/* ─── Cart ─── */
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    showToast('🛒 ' + name + ' added to cart!');
    updateCartBadge();
}

function updateCartBadge() {
    const badge = document.getElementById('cartCount');
    if (badge) {
        const c = JSON.parse(localStorage.getItem('cart')) || [];
        badge.textContent = c.length;
    }
}

/* ─── Dark Mode ─── */
function toggleMode() {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const btn = document.getElementById('darkToggle');
    if (btn) btn.textContent = isDark ? '☀️' : '🌙';
}

/* ─── Toast Notification ─── */
function showToast(message, duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">✅</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/* ─── Auth Helpers ─── */
function isLoggedIn() {
    return !!localStorage.getItem('ms_user');
}

function getUser() {
    const u = localStorage.getItem('ms_user');
    return u ? JSON.parse(u) : null;
}

function saveUser(name, email, password) {
    // Store user (simple demo auth using localStorage)
    const users = JSON.parse(localStorage.getItem('ms_users') || '[]');
    const exists = users.find(u => u.email === email);
    if (exists) return { ok: false, msg: 'Email already registered. Please login.' };
    users.push({ name, email, password });
    localStorage.setItem('ms_users', JSON.stringify(users));
    localStorage.setItem('ms_user', JSON.stringify({ name, email }));
    return { ok: true };
}

function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('ms_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { ok: false, msg: 'Invalid email or password.' };
    localStorage.setItem('ms_user', JSON.stringify({ name: user.name, email: user.email }));
    return { ok: true, user };
}

/* ─── Google Account Picker ─── */
const GOOGLE_ACCOUNTS = [
    { name: 'Ravi Kumar',    email: 'ravi.kumar@gmail.com',   color: '#4285F4' },
    { name: 'Priya Sharma',  email: 'priya.sharma@gmail.com', color: '#34A853' },
    { name: 'Arjun Mehta',   email: 'arjun.mehta@gmail.com',  color: '#EA4335' },
    { name: 'Sneha Patel',   email: 'sneha.patel@gmail.com',  color: '#FBBC05' },
    { name: 'Demo User',     email: 'demo.user@gmail.com',    color: '#9c27b0' },
];

function getInitials(name) {
    const parts = name.trim().split(' ');
    return parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : parts[0].slice(0, 2).toUpperCase();
}

function mockGoogleAuth() {
    // Show the account picker instead of instant sign-in
    openGooglePicker();
}

function openGooglePicker() {
    const overlay = document.getElementById('googlePickerOverlay');
    const list    = document.getElementById('googleAccountsList');
    if (!overlay || !list) return;

    // Load accounts — include any custom accounts added via "Use another account"
    const extra   = JSON.parse(localStorage.getItem('ms_extra_google') || '[]');
    const accounts = [...GOOGLE_ACCOUNTS, ...extra];
    const lastEmail = localStorage.getItem('ms_last_google');

    list.innerHTML = accounts.map(acc => `
        <button class="google-account-item ${acc.email === lastEmail ? 'active-account' : ''}"
                onclick="selectGoogleAccount('${acc.name.replace(/'/g,"\\'")}','${acc.email}','${acc.color}')">
            <div class="google-account-avatar" style="background:${acc.color}">
                ${getInitials(acc.name)}
            </div>
            <div class="google-account-info">
                <div class="google-account-name">${acc.name}</div>
                <div class="google-account-email">${acc.email}</div>
            </div>
            <i class="fa fa-check google-account-check"></i>
        </button>
    `).join('');

    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeGooglePicker() {
    const overlay = document.getElementById('googlePickerOverlay');
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';
}

function handlePickerOverlayClick(e) {
    if (e.target === document.getElementById('googlePickerOverlay')) closeGooglePicker();
}

function selectGoogleAccount(name, email, color) {
    localStorage.setItem('ms_last_google', email);
    localStorage.setItem('ms_user', JSON.stringify({ name, email, google: true, color }));

    closeGooglePicker();
    closeAuthModal();
    updateNavUser();
    showToast('🟢 Signed in as ' + name);
    if (typeof afterLoginCallback === 'function') afterLoginCallback();
}

function addAnotherGoogleAccount() {
    const email = prompt('Enter your Gmail address:');
    if (!email || !email.includes('@')) return;

    const name  = prompt('Enter your name:');
    if (!name || !name.trim()) return;

    const colors = ['#e91e63','#ff5722','#673ab7','#009688','#795548'];
    const color  = colors[Math.floor(Math.random() * colors.length)];

    const extra = JSON.parse(localStorage.getItem('ms_extra_google') || '[]');
    // avoid duplicates
    if (!extra.find(a => a.email === email)) {
        extra.push({ name: name.trim(), email: email.trim(), color });
        localStorage.setItem('ms_extra_google', JSON.stringify(extra));
    }

    // Auto-select the newly added account
    selectGoogleAccount(name.trim(), email.trim(), color);
}


function logoutUser() {
    localStorage.removeItem('ms_user');
    location.reload();
}

/* ─── Update Navbar user state ─── */
function updateNavUser() {
    updateCartBadge();
    const userArea = document.getElementById('navUserArea');
    if (!userArea) return;
    const user = getUser();
    if (user) {
        userArea.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px;">
                <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#22c55e,#16a34a);
                    color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">
                    ${user.name.charAt(0).toUpperCase()}
                </div>
                <span style="font-size:0.85rem;font-weight:600;color:var(--gray-700);">${user.name.split(' ')[0]}</span>
                <button onclick="logoutUser()" title="Logout"
                    style="background:none;border:none;color:var(--gray-400);cursor:pointer;font-size:0.75rem;padding:4px 8px;
                    border-radius:6px;transition:all 0.2s;" onmouseover="this.style.background='#fee2e2';this.style.color='#ef4444'"
                    onmouseout="this.style.background='none';this.style.color='var(--gray-400)'">
                    Logout
                </button>
            </div>`;
    } else {
        userArea.innerHTML = `
            <button onclick="openAuthModal('login')" 
                style="padding:8px 16px;border:1.5px solid var(--green-500);border-radius:8px;background:white;
                color:var(--green-700);font-family:'Poppins',sans-serif;font-size:0.85rem;font-weight:600;cursor:pointer;
                transition:all 0.2s;" 
                onmouseover="this.style.background='var(--green-50)'"
                onmouseout="this.style.background='white'">
                Login / Sign Up
            </button>`;
    }
}

/* ─── Auth Modal ─── */
function openAuthModal(tab = 'login') {
    document.getElementById('authModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    switchTab(tab);
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
    document.body.style.overflow = '';
}

function switchTab(tab) {
    document.getElementById('loginTab').classList.toggle('auth-tab-active', tab === 'login');
    document.getElementById('signupTab').classList.toggle('auth-tab-active', tab === 'signup');
    document.getElementById('loginForm').style.display  = tab === 'login'  ? 'flex' : 'none';
    document.getElementById('signupForm').style.display = tab === 'signup' ? 'flex' : 'none';
    document.getElementById('authError').textContent = '';
}

function handleLogin(e) {
    e.preventDefault();
    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const result   = loginUser(email, password);
    if (!result.ok) {
        document.getElementById('authError').textContent = result.msg;
        return;
    }
    closeAuthModal();
    updateNavUser();
    showToast('👋 Welcome back, ' + result.user.name + '!');
    // If on checkout page, allow order placement
    if (typeof afterLoginCallback === 'function') afterLoginCallback();
}

function handleSignup(e) {
    e.preventDefault();
    const name     = document.getElementById('signupName').value.trim();
    const email    = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirm  = document.getElementById('signupConfirm').value;
    if (password !== confirm) {
        document.getElementById('authError').textContent = 'Passwords do not match.';
        return;
    }
    const result = saveUser(name, email, password);
    if (!result.ok) {
        document.getElementById('authError').textContent = result.msg;
        return;
    }
    closeAuthModal();
    updateNavUser();
    showToast('🎉 Account created! Welcome, ' + name + '!');
    if (typeof afterLoginCallback === 'function') afterLoginCallback();
}

/* ─── Init on page load ─── */
document.addEventListener('DOMContentLoaded', () => {
    // Restore theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        const btn = document.getElementById('darkToggle');
        if (btn) btn.textContent = '☀️';
    }
    updateNavUser();
});