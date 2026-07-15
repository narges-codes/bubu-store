const API = '';

function money(n) {
  return (Number(n) || 0).toLocaleString('fa-IR');
}

function getToken() {
  return localStorage.getItem('bubuToken');
}

function getUser() {
  try { return JSON.parse(localStorage.getItem('bubuUser') || 'null'); }
  catch { return null; }
}

function authHeaders() {
  const h = { 'Content-Type': 'application/json' };
  const t = getToken();
  if (t) h.Authorization = `Bearer ${t}`;
  return h;
}

function adminHeaders() {
  return {
    'Content-Type': 'application/json',
    'x-admin-token': localStorage.getItem('adminToken') || ''
  };
}

async function api(path, options = {}) {
  const res = await fetch(API + path, options);
  let data = null;
  try { data = await res.json(); } catch { data = null; }
  if (!res.ok) {
    const err = new Error((data && data.error) || 'خطا');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

async function updateCartBadge() {
  const el = document.getElementById('cartCount');
  if (!el) return;
  if (!getToken()) {
    el.textContent = '0';
    return;
  }
  try {
    const data = await api('/cart', { headers: authHeaders() });
    el.textContent = String(data.count || 0);
  } catch {
    el.textContent = '0';
  }
}

function requireLogin(redirect = 'login.html') {
  if (!getToken()) {
    alert('برای ادامه باید وارد شوید');
    location.href = redirect;
    return false;
  }
  return true;
}

function setupMobileNav() {
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mobileNav');
  if (btn && nav) {
    btn.addEventListener('click', () => nav.classList.toggle('open'));
  }
}

function logout() {
  localStorage.removeItem('bubuToken');
  localStorage.removeItem('bubuUser');
  location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  setupMobileNav();
  updateCartBadge();
});
