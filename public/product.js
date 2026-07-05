// ===== صفحه محصول تکی =====

const API = '';

// ===== لود محصول =====
async function loadProduct() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    document.getElementById('productPage').innerHTML = '<p class="loading">محصول پیدا نشد</p>';
    return;
  }

  try {
    const res = await fetch(`${API}/products`);
    const products = await res.json();
    const product = products.find(p => p.id == id);

    if (!product) {
      document.getElementById('productPage').innerHTML = '<p class="loading">محصول پیدا نشد</p>';
      return;
    }

    renderProduct(product);
  } catch (err) {
    document.getElementById('productPage').innerHTML = '<p class="loading">خطا در بارگذاری</p>';
  }
}

// ===== نمایش محصول =====
function renderProduct(p) {
  document.getElementById('productPage').innerHTML = `
    <div class="product-detail">
      <img class="product-detail-img" src="${p.image || 'https://via.placeholder.com/600x700'}" alt="${p.name}">
      <div class="product-detail-info">
        <h1>${p.name}</h1>
        <span class="product-detail-category">${p.category || 'عمومی'}</span>
        <p class="product-detail-price">${(Number(p.price) || 0).toLocaleString('fa-IR')}<span class="currency">تومان</span></p>
        <p class="product-detail-desc">محصول باکیفیت Bubu Collection. این محصول از بهترین جنس‌ها تولید شده و مناسب برای استفاده روزمره و مجلسی می‌باشد.</p>
        <div class="product-detail-actions">
          <div class="qty-selector">
            <button onclick="changeQty(-1)">−</button>
            <span id="qty">1</span>
            <button onclick="changeQty(1)">+</button>
          </div>
          <button class="buy-btn" onclick="addToCart(${p.id})">افزودن به سبد</button>
        </div>
      </div>
    </div>`;
}

// ===== تغییر تعداد =====
let quantity = 1;
function changeQty(delta) {
  quantity = Math.max(1, quantity + delta);
  document.getElementById('qty').textContent = quantity.toLocaleString('fa-IR');
}

// ===== اضافه کردن به سبد =====
async function addToCart(productId) {
  const token = localStorage.getItem('bubuToken');
  if (!token) {
    alert('برای خرید باید وارد شوید');
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
      body: JSON.stringify({ productId, quantity })
    });

    if (res.status === 401) {
      alert('نشست منقضی شده. دوباره وارد شوید.');
      localStorage.removeItem('bubuToken');
      window.location.href = 'login.html';
      return;
    }

    alert('به سبد اضافه شد ✅');
    window.location.href = 'cart.html';
  } catch (err) {
    alert('خطا در افزودن به سبد');
  }
}

// ===== شروع =====
loadProduct();
