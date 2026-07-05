const API = '';

function switchTab(tab) {
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (tab === 'login') {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.style.display = 'flex';
    registerForm.style.display = 'none';
  } else {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.style.display = 'flex';
    loginForm.style.display = 'none';
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const msg = document.getElementById('loginMsg');
  msg.textContent = '';
  msg.className = 'auth-msg';

  const phone = document.getElementById('loginPhone').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('bubuToken', data.token);
      localStorage.setItem('bubuUser', JSON.stringify(data.user));
      msg.textContent = 'ورود موفق! در حال انتقال...';
      msg.className = 'auth-msg success';
      setTimeout(() => { window.location.href = 'index.html'; }, 1000);
    } else {
      msg.textContent = data.error || 'خطا در ورود';
      msg.className = 'auth-msg error';
    }
  } catch (err) {
    msg.textContent = 'خطای ارتباط با سرور';
    msg.className = 'auth-msg error';
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const msg = document.getElementById('registerMsg');
  msg.textContent = '';
  msg.className = 'auth-msg';

  const name = document.getElementById('regName').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const password = document.getElementById('regPassword').value;

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, password })
    });

    const data = await res.json();

    if (res.ok) {
      msg.textContent = 'ثبت‌نام موفق! حالا وارد شوید.';
      msg.className = 'auth-msg success';
      setTimeout(() => {
        switchTab('login');
        document.getElementById('loginPhone').value = phone;
      }, 2000);
    } else {
      msg.textContent = data.error || 'خطا در ثبت‌نام';
      msg.className = 'auth-msg error';
    }
  } catch (err) {
    msg.textContent = 'خطای ارتباط با سرور';
    msg.className = 'auth-msg error';
  }
}

const token = localStorage.getItem('bubuToken');
if (token) {
  window.location.href = 'index.html';
}