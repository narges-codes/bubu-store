// ===== Bubu Collection — Frontend Logic =====

const API = ''; // same origin
let allProducts = [];
let currentFilter = 'all';

// ===== لود محصولات =====
async function loadProducts() {
  try {
    const res = await fetch(`${API}/products`);
    const products = await res.json();
    allProducts = products;
    renderProducts();
  } catch (err) {
    document.getElementById('productsGrid').innerHTML = '<p class="loading">خطا در بارگذاری محصولات</p>';
  }
}

// ===== نمایش محصولات =====
function renderProducts() {
  const grid = document.getElementById('productsGrid');

  let filtered = allProducts;
  if (currentFilter !== 'all') {
    filtered = allProducts.filter(p => p.category === currentFilter);
  }

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="loading">محصولی در این دسته وجود ندارد</p>';
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" onclick="window.location.href='product.html?id=${p.id}'">
      <div class="product-image-wrap">
        <img class="product-image" src="${p.image || 'https://via.placeholder.com/400x500'}" alt="${p.name}">
        ${p.category ? `<span class="product-badge">${p.category}</span>` : ''}
      </div>
      <div class="product-info">
        <h3 class="product-name">${p.name}</h3>
        <p class="product-category">${p.category || 'عمومی'}</p>
        <p class="product-price">${(Number(p.price) || 0).toLocaleString('fa-IR')}<span class="currency">تومان</span></p>
        <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${p.id})">افزودن به سبد</button>
      </div>
    </div>
  `).join('');
}

// ===== تب‌های دسته‌بندی =====
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    renderProducts();
  });
});

// ===== فیلتر از منوی هدر =====
document.querySelectorAll('[data-cat]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const cat = link.dataset.cat;
    document.querySelectorAll('.tab').forEach(t => {
      t.classList.toggle('active', t.dataset.filter === cat);
    });
    currentFilter = cat;
    renderProducts();
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    // بستن منوی موبایل
    document.getElementById('mobileNav').classList.remove('open');
  });
});

// ===== منوی موبایل =====
document.getElementById('mobileMenuBtn').addEventListener('click', () => {
  document.getElementById('mobileNav').classList.toggle('open');
});

// ===== سبد خرید =====
function getCartItems() {
  return JSON.parse(localStorage.getItem('bubuCart') || '[]');
}

function saveCartItems(items) {
  localStorage.setItem('bubuCart', JSON.stringify(items));
  updateCartCount();
}

function updateCartCount() {
  const items = getCartItems();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const el = document.getElementById('cartCount');
  if (el) el.textContent = count;
}

async function addToCart(productId) {
  // چک کن کاربر وارد شده
  const token = localStorage.getItem('bubuToken');
  if (!token) {
    alert('برای افزودن به سبد باید وارد شوید');
    window.location.href = 'login.html';
    return;
  }

  try {
    const res = await fetch(`${API}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity: 1 })
    });

    if (res.status === 401) {
      alert('نشست شما منقضی شده. دوباره وارد شوید.');
      localStorage.removeItem('bubuToken');
      window.location.href = 'login.html';
      return;
    }

    const data = await res.json();
    alert('به سبد اضافه شد ✅');
    updateCartCount();
  } catch (err) {
    alert('خطا در افزودن به سبد');
  }
}

// ===== شروع =====
loadProducts();
updateCartCount();
