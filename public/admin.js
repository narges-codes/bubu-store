const TOKEN_KEY = 'adminToken';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'x-admin-token': getToken()
  };
}

function showPanel() {
  document.getElementById('login-box').style.display = 'none';
  document.getElementById('admin-panel').style.display = 'block';
  getProducts();
}

function login() {
  const t = document.getElementById('token-input').value.trim();
  if (!t) return;
  localStorage.setItem(TOKEN_KEY, t);
  showPanel();
}

async function getProducts() {
  const res = await fetch('/products');
  const products = await res.json();
  const container = document.getElementById('products');
  container.innerHTML = '';
  products.forEach(p => {
    container.innerHTML += `
    <div class="admin-card">
      <img src="${p.image || 'https://via.placeholder.com/200'}" alt="${p.name}">
      <span>${p.name} - ${(Number(p.price) || 0).toLocaleString()} تومان</span>
      <button onclick="editProduct(${p.id}, '${p.name}', ${p.price}, '${p.image}')">ویرایش</button>
      <button onclick="deleteProduct(${p.id})">حذف</button>
    </div>`;
  });
}

async function addProduct() {
  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const image = document.getElementById('image').value;

  const res = await fetch('/products', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name, price: Number(price), image })
  });

  if (res.status === 401) return alert('توکن اشتباهه!');

  document.getElementById('name').value = '';
  document.getElementById('price').value = '';
  document.getElementById('image').value = '';
  getProducts();
}

async function editProduct(id, name, price, image) {
  const newName = prompt('نام جدید:', name);
  if (newName === null) return;
  const newPrice = prompt('قیمت جدید:', price);
  const newImage = prompt('لینک عکس جدید:', image);

  const res = await fetch(`/products/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ name: newName, price: Number(newPrice), image: newImage })
  });

  if (res.status === 401) return alert('توکن اشتباهه!');
  getProducts();
}

async function deleteProduct(id) {
  const res = await fetch(`/products/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-token': getToken() }
  });

  if (res.status === 401) return alert('توکن اشتباهه!');
  getProducts();
}

// --- entry point ---
if (getToken()) {
  showPanel();
} else {
  document.getElementById('login-box').style.display = 'block';
  document.getElementById('admin-panel').style.display = 'none';
}
