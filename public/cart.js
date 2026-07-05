// ===== سبد خرید =====

const API = '';

// ===== لود سبد =====
async function loadCart() {
  const token = localStorage.getItem('bubuToken');
  const content = document.getElementById('cartContent');

  if (!token) {
    content.innerHTML = `
      <div class="empty-cart">
        <h2>برای مشاهده سبد خرید وارد شوید</h2>
        <a href="login.html">ورود / ثبت‌نام</a>
      </div>`;
    return;
  }

  try {
    const res = await fetch(`${API}/cart`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.status === 401) {
      localStorage.removeItem('bubuToken');
      localStorage.removeItem('bubuUser');
      content.innerHTML = `
        <div class="empty-cart">
          <h2>نشست منقضی شده. دوباره وارد شوید.</h2>
          <a href="login.html">ورود</a>
        </div>`;
      return;
    }

    const data = await res.json();

    if (data.items.length === 0) {
      content.innerHTML = `
        <div class="empty-cart">
          <h2>سبد خرید شما خالی است</h2>
          <p>محصولات مورد علاقه‌تان را اضافه کنید</p>
          <a href="index.html">مشاهده محصولات</a>
        </div>`;
      return;
    }

    renderCart(data);
  } catch (err) {
    content.innerHTML = '<p class="loading">خطا در بارگذاری سبد</p>';
  }
}

// ===== نمایش سبد =====
function renderCart(data) {
  const content = document.getElementById('cartContent');

  let html = data.items.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.product.image || 'https://via.placeholder.com/200'}" alt="${item.product.name}">
      <div class="cart-item-info">
        <h3 class="cart-item-name">${item.product.name}</h3>
        <p class="cart-item-price">${item.product.price.toLocaleString('fa-IR')} تومان</p>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="updateQty(${item.id}, ${item.quantity - 1})">−</button>
          <span class="qty-display">${item.quantity.toLocaleString('fa-IR')}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, ${item.quantity + 1})">+</button>
          <button class="cart-item-remove" onclick="removeItem(${item.id})">حذف</button>
        </div>
      </div>
      <div class="cart-item-total">${item.total.toLocaleString('fa-IR')} تومان</div>
    </div>
  `).join('');

  html += `
    <div class="cart-summary">
      <div class="cart-summary-row">
        <span>تعداد آیتم‌ها:</span>
        <span>${data.items.length.toLocaleString('fa-IR')}</span>
      </div>
      <div class="cart-summary-total">
        <span>مجموع کل:</span>
        <span class="price">${data.grandTotal.toLocaleString('fa-IR')} تومان</span>
      </div>
      <button class="checkout-btn" onclick="checkout()">تسویه حساب</button>
    </div>`;

  content.innerHTML = html;
}

// ===== تغییر تعداد =====
async function updateQty(itemId, newQty) {
  if (newQty < 1) {
    removeItem(itemId);
    return;
  }

  const token = localStorage.getItem('bubuToken');
  try {
    await fetch(`${API}/cart/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quantity: newQty })
    });
    loadCart();
  } catch (err) {
    alert('خطا در بروزرسانی');
  }
}

// ===== حذف آیتم =====
async function removeItem(itemId) {
  const token = localStorage.getItem('bubuToken');
  try {
    await fetch(`${API}/cart/${itemId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    loadCart();
  } catch (err) {
    alert('خطا در حذف');
  }
}

// ===== تسویه حساب =====
function checkout() {
  alert('سیستم پرداخت هنوز پیاده‌سازی نشده است 🚧');
}

// ===== شروع =====
loadCart();
