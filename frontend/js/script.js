const API_URL = 'http://localhost:5000/api';
let ALL_PRODUCTS = [];

/* ─── Cart ─── */
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Migration: If cart items don't have quantities, convert them
if (cart.length > 0 && typeof cart[0].quantity === 'undefined') {
    const newCart = [];
    cart.forEach(item => {
        const existing = newCart.find(i => i.name === item.name);
        if (existing) {
            existing.quantity++;
        } else {
            newCart.push({ ...item, quantity: 1 });
        }
    });
    cart = newCart;
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(name, price, img = '') {
    const existing = cart.find(i => i.name === name);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name, price, quantity: 1, img });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    showToast('🛒 ' + name + ' added to cart!');
    updateCartBadge();
    syncQuantityUI();
}

function removeFromCart(name) {
    const idx = cart.findIndex(i => i.name === name);
    if (idx > -1) {
        if (cart[idx].quantity > 1) {
            cart[idx].quantity--;
        } else {
            cart.splice(idx, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        syncQuantityUI();
        // If we are on the cart page, this might be called, but cart page usually has its own render
        if (typeof renderCart === 'function') renderCart();
    }
}

function getQuantity(name) {
    const item = cart.find(i => i.name === name);
    return item ? item.quantity : 0;
}

function syncQuantityUI() {
    const containers = document.querySelectorAll('.qty-container');
    containers.forEach(container => {
        const name = container.getAttribute('data-product-name');
        const price = parseFloat(container.getAttribute('data-product-price'));
        const img = container.getAttribute('data-product-img') || '';
        const qty = getQuantity(name);

        if (qty > 0) {
            container.innerHTML = `
                <div class="qty-controls">
                    <button class="qty-btn minus" onclick="removeFromCart('${name.replace(/'/g, "\\'")}')">−</button>
                    <span class="qty-num">${qty}</span>
                    <button class="qty-btn" onclick="addToCart('${name.replace(/'/g, "\\'")}', ${price}, '${img.replace(/'/g, "\\'")}')">+</button>
                </div>`;
        } else {
            container.innerHTML = `
                <button class="btn-add-cart" onclick="addToCart('${name.replace(/'/g, "\\'")}', ${price}, '${img.replace(/'/g, "\\'")}')">
                    <i class="fa fa-plus"></i> Add
                </button>`;
        }
    });
}

/* ─── Wishlist ─── */
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function addToWishlist(name, price, img) {
    const exists = wishlist.find(i => i.name === name);
    if (exists) {
        showToast('ℹ️ ' + name + ' is already in wishlist');
        return;
    }
    wishlist.push({ name, price, img });
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    showToast('❤️ ' + name + ' added to wishlist!');
}

function removeFromWishlist(name) {
    wishlist = wishlist.filter(i => i.name !== name);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    showToast('❌ Removed from wishlist');
    if (typeof renderWishlist === 'function') renderWishlist();
}

function updateCartBadge() {
    const badge = document.getElementById('cartCount');
    if (badge) {
        const c = JSON.parse(localStorage.getItem('cart')) || [];
        const totalQty = c.reduce((acc, item) => acc + (item.quantity || 1), 0);
        badge.textContent = totalQty;
    }
}

async function apiPlaceOrder(orderData) {
    try {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(orderData)
        });
        const data = await res.json();
        if (!res.ok) return { ok: false, msg: data.message || 'Order failed' };
        
        // Clear cart locally
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        
        return { ok: true, order: data };
    } catch (err) {
        return { ok: false, msg: 'Server error. Please try again.' };
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
    return !!localStorage.getItem('ms_user_token');
}

function getUser() {
    const u = localStorage.getItem('ms_user');
    return u ? JSON.parse(u) : null;
}

function getToken() {
    return localStorage.getItem('ms_user_token');
}

async function saveUser(name, email, password) {
    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (!res.ok) return { ok: false, msg: data.message || 'Signup failed' };
        
        localStorage.setItem('ms_user_token', data.token);
        localStorage.setItem('ms_user', JSON.stringify({ name: data.name, email: data.email }));
        return { ok: true };
    } catch (err) {
        return { ok: false, msg: 'Server error. Please try again later.' };
    }
}

async function loginUser(email, password) {
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) return { ok: false, msg: data.message || 'Login failed' };
        
        localStorage.setItem('ms_user_token', data.token);
        localStorage.setItem('ms_user', JSON.stringify({ name: data.name, email: data.email }));
        return { ok: true, user: data };
    } catch (err) {
        return { ok: false, msg: 'Server error. Please try again later.' };
    }
}

/* ─── Google Account Picker ─── */
const GOOGLE_ACCOUNTS = [
    { name: 'Ravi Kumar', email: 'ravi.kumar@gmail.com', color: '#4285F4' },
    { name: 'Priya Sharma', email: 'priya.sharma@gmail.com', color: '#34A853' },
    { name: 'Arjun Mehta', email: 'arjun.mehta@gmail.com', color: '#EA4335' },
    { name: 'Sneha Patel', email: 'sneha.patel@gmail.com', color: '#FBBC05' },
    { name: 'Demo User', email: 'demo.user@gmail.com', color: '#9c27b0' },
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
    const list = document.getElementById('googleAccountsList');
    if (!overlay || !list) return;

    // Load accounts — include any custom accounts added via "Use another account"
    const extra = JSON.parse(localStorage.getItem('ms_extra_google') || '[]');
    const accounts = [...GOOGLE_ACCOUNTS, ...extra];
    const lastEmail = localStorage.getItem('ms_last_google');

    list.innerHTML = accounts.map(acc => `
        <button class="google-account-item ${acc.email === lastEmail ? 'active-account' : ''}"
                onclick="selectGoogleAccount('${acc.name.replace(/'/g, "\\'")}','${acc.email}','${acc.color}')">
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

    const name = prompt('Enter your name:');
    if (!name || !name.trim()) return;

    const colors = ['#e91e63', '#ff5722', '#673ab7', '#009688', '#795548'];
    const color = colors[Math.floor(Math.random() * colors.length)];

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
    localStorage.removeItem('ms_user_token');
    location.reload();
}


/* ─── AI Chatbot (MediBot) ─── */
const CHAT_RESPONSES = {
    "hello": "Hello! I'm MediBot, your health assistant. How can I help you today?",
    "hi": "Hi there! Looking for some specific medicine or health advice?",
    "fever": "For fever, I recommend Paracetamol or Ibuprofen. You can find them in our 'Tablets' section.",
    "headache": "Paracetamol 500mg is great for headaches. Would you like me to find it for you?",
    "pain": "We have various pain relievers like Diclofenac gel or Aceclofenac tablets. Please consult a doctor if pain persists.",
    "cough": "For a dry cough, Grilinctus is popular. For a wet cough, Ascoril is often recommended. Check 'Syrups'.",
    "vitamin": "Vitamins are essential! We have Multivitamins, Vitamin C, and Calcium supplements available.",
    "delivery": "We offer free delivery on orders above ₹499! Most orders arrive within 24-48 hours.",
    "thank": "You're welcome! Stay healthy!",
    "bye": "Goodbye! Have a great day!",
    "order": "You can view your orders in the Dashboard. If you want to reorder, check the homepage!"
};

function toggleChat() {
    const win = document.getElementById('chatWindow');
    if (win) win.classList.toggle('active');
}

function processChat(e) {
    if (e && e.key !== 'Enter') return;
    const input = document.getElementById('chatInput');
    const msg = input.value.trim().toLowerCase();
    if (!msg) return;

    addChatMessage(input.value, 'user');
    input.value = '';

    setTimeout(() => {
        let response = "I'm not sure about that. Try asking about fever, cough, vitamins, or delivery!";
        for (const key in CHAT_RESPONSES) {
            if (msg.includes(key)) {
                response = CHAT_RESPONSES[key];
                break;
            }
        }
        addChatMessage(response, 'bot');
    }, 600);
}

function addChatMessage(text, sender) {
    const chatBody = document.getElementById('chatMessages');
    if (!chatBody) return;
    const div = document.createElement('div');
    div.className = `message ${sender}-msg`;
    div.textContent = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}

/* ─── Reorder & Suggestions logic ─── */
async function renderReorderSection() {
    const container = document.getElementById('reorderContainer');
    if (!container || !isLoggedIn()) return;
    
    try {
        const res = await fetch(`${API_URL}/orders/myorders`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const orders = await res.json();
        
        const items = [];
        orders.forEach(o => {
            o.orderItems.forEach(i => {
                if (!items.find(x => x.name === i.name)) items.push(i);
            });
        });

        const products = items.slice(0, 4);
        if (products.length === 0) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'block';
        const grid = document.getElementById('reorderGrid');
        grid.innerHTML = products.map(p => `
            <div class="col-md-3 col-6">
                <div class="product-card">
                    <div class="product-card-img-wrap" style="height:120px;display:flex;align-items:center;justify-content:center;background:#f8fafc;">
                        ${p.image ? `<img src="${p.image}" style="height:80px;object-fit:contain;">` : `<span style="font-size:2rem">💊</span>`}
                    </div>
                    <div class="product-card-body">
                        <div class="product-name" style="font-size:0.85rem;height:auto;margin-bottom:8px;">${p.name}</div>
                        <div class="product-footer">
                            <div class="product-price">₹${p.price}</div>
                            <button class="btn-add-cart" onclick="addToCart('${p.name.replace(/'/g, "\\'")}', ${p.price}, '${(p.image || '').replace(/'/g, "\\'")}')" style="padding:6px 12px;font-size:0.75rem;">
                                <i class="fa fa-sync"></i> Reorder
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Failed to load reorder items');
    }
}

async function renderSuggestionsSection() {
    const container = document.getElementById('suggestionsContainer');
    if (!container) return;
    
    try {
        const res = await fetch(`${API_URL}/products`);
        const suggestions = await res.json();
        
        if (suggestions.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'block';
        const grid = document.getElementById('suggestionsGrid');
        grid.innerHTML = suggestions.slice(0, 4).map(p => `
            <div class="col-md-3 col-6">
                <div class="product-card">
                    <div class="product-card-img-wrap" style="height:120px;display:flex;align-items:center;justify-content:center;background:#f8fafc;">
                        ${p.img ? `<img src="${p.img}" style="height:80px;object-fit:contain;">` : `<span style="font-size:2rem">📦</span>`}
                    </div>
                    <div class="product-card-body">
                        <div class="product-name" style="font-size:0.85rem;height:auto;margin-bottom:8px;">${p.name}</div>
                        <div class="product-footer">
                            <div class="product-price">₹${p.price}</div>
                            <button class="btn-add-cart" onclick="addToCart('${p.name.replace(/'/g, "\\'")}', ${p.price}, '${(p.img || '').replace(/'/g, "\\'")}')" style="padding:6px 12px;font-size:0.75rem;">
                                <i class="fa fa-plus"></i> Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Failed to load suggestions');
    }
}

/* ─── Address Management Helpers ─── */
function getAddresses() {
    return JSON.parse(localStorage.getItem('medistore_addresses') || '[]');
}

function saveAddress(addr) {
    const addrs = getAddresses();
    addrs.push({ id: Date.now(), ...addr });
    localStorage.setItem('medistore_addresses', JSON.stringify(addrs));
    showToast('🏠 Address saved successfully!');
}

function deleteAddress(id) {
    const addrs = getAddresses().filter(a => a.id !== id);
    localStorage.setItem('medistore_addresses', JSON.stringify(addrs));
    showToast('🗑️ Address deleted');
}

/* ─── Rating & Review System ─── */
async function saveReview(productId, rating, comment) {
    try {
        const res = await fetch(`${API_URL}/products/${productId}/reviews`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ rating, comment })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        showToast('⭐ Thank you for your review!');
    } catch (err) {
        showToast('⚠️ Failed to save review');
    }
}

async function getReviews(productId) {
    try {
        const res = await fetch(`${API_URL}/products/${productId}/reviews`);
        return await res.json();
    } catch (err) {
        return [];
    }
}

/* ─── Update Navbar user state ─── */
function toggleUserDropdown(e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('userDropdownMenu');
    if (menu) menu.classList.toggle('active');
}

function updateNavUser() {
    updateCartBadge();
    const userArea = document.getElementById('navUserArea');
    if (!userArea) return;
    const user = getUser();
    if (user) {
        userArea.innerHTML = `
            <div class="nav-profile-wrap">
                <button class="profile-trigger" id="profileBtn">
                    <div class="profile-avatar-small">${user.name.charAt(0).toUpperCase()}</div>
                    <span style="font-size:0.85rem;font-weight:600;color:var(--gray-700);">${user.name.split(' ')[0]}</span>
                    <i class="fa fa-chevron-down" style="font-size:0.75rem;color:var(--gray-400);"></i>
                </button>
                <div class="profile-dropdown" id="userDropdownMenu">
                    <div style="padding:15px;border-bottom:1px solid var(--gray-100);background:var(--gray-50);">
                        <div style="font-size:0.88rem;font-weight:700;color:var(--gray-900);">${user.name}</div>
                        <div style="font-size:0.75rem;color:var(--gray-500);overflow:hidden;text-overflow:ellipsis;">${user.email}</div>
                    </div>
                    <a href="dashboard.html?tab=profile" class="dropdown-item"><i class="fa fa-user-circle"></i> Profile</a>
                    <a href="dashboard.html?tab=orders" class="dropdown-item"><i class="fa fa-box"></i> My Orders</a>
                    <a href="dashboard.html?tab=addresses" class="dropdown-item"><i class="fa fa-map-marker-alt"></i> Saved Addresses</a>
                    <a href="dashboard.html?tab=wishlist" class="dropdown-item"><i class="fa fa-heart"></i> Wishlist</a>
                    <div style="height:1px;background:var(--gray-100);margin:5px 0;"></div>
                    <button class="dropdown-item logout-danger" onclick="logoutUser()" style="width:100%;border:none;background:none;cursor:pointer;">
                        <i class="fa fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </div>`;
        
        // Setup dropdown listener
        const btn = document.getElementById('profileBtn');
        if (btn) btn.addEventListener('click', toggleUserDropdown);
    } else {
        userArea.innerHTML = `
            <button onclick="openAuthModal('login')" class="profile-trigger" title="Login / Sign Up">
                <i class="fa fa-user-circle" style="font-size:1.5rem;color:var(--gray-600);"></i>
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
    document.getElementById('loginForm').style.display = tab === 'login' ? 'flex' : 'none';
    document.getElementById('signupForm').style.display = tab === 'signup' ? 'flex' : 'none';
    document.getElementById('authError').textContent = '';
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const result = await loginUser(email, password);
    if (!result.ok) {
        document.getElementById('authError').textContent = result.msg;
        return;
    }
    closeAuthModal();
    updateNavUser();
    showToast('👋 Welcome back, ' + result.user.name + '!');
    if (typeof afterLoginCallback === 'function') afterLoginCallback();
}

async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;
    if (password !== confirm) {
        document.getElementById('authError').textContent = 'Passwords do not match.';
        return;
    }
    const result = await saveUser(name, email, password);
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
document.addEventListener('DOMContentLoaded', async () => {
    // Restore theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        const btn = document.getElementById('darkToggle');
        if (btn) btn.textContent = '☀️';
    }
    
    // Fetch products to have IDs available
    try {
        const res = await fetch(`${API_URL}/products`);
        ALL_PRODUCTS = await res.json();
    } catch (err) {
        console.error('Failed to pre-cache products');
    }

    updateNavUser();
    syncQuantityUI();
    renderReorderSection();
    renderSuggestionsSection();
});