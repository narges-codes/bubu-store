function switchTab(tab) {
  const login = tab === 'login';
  document.getElementById('loginTab').classList.toggle('active', login);
  document.getElementById('registerTab').classList.toggle('active', !login);
  document.getElementById('loginForm').style.display = login ? 'flex' : 'none';
  document.getElementById('registerForm').style.display = login ? 'none' : 'flex';
}

async function handleLogin(e) {
  e.preventDefault();
  const msg = document.getElementById('loginMsg');
  try {
    const data = await api('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: document.getElementById('loginPhone').value.trim(),
        password: document.getElementById('loginPassword').value
      })
    });
    localStorage.setItem('bubuToken', data.token);
    localStorage.setItem('bubuUser', JSON.stringify(data.user));
    msg.className = 'msg ok';
    msg.textContent = 'ورود موفق...';
    setTimeout(() => location.href = 'index.html', 700);
  } catch (err) {
    msg.className = 'msg err';
    msg.textContent = err.message;
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const msg = document.getElementById('registerMsg');
  try {
    await api('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: document.getElementById('regName').value.trim(),
        phone: document.getElementById('regPhone').value.trim(),
        password: document.getElementById('regPassword').value
      })
    });
    msg.className = 'msg ok';
    msg.textContent = 'ثبت‌نام موفق! حالا وارد شوید';
    setTimeout(() => {
      switchTab('login');
      document.getElementById('loginPhone').value = document.getElementById('regPhone').value.trim();
    }, 900);
  } catch (err) {
    msg.className = 'msg err';
    msg.textContent = err.message;
  }
}

if (getToken()) location.href = 'index.html';
