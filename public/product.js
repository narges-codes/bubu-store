let product = null;
let selectedColor = '';
let selectedSize = 'Free Size';
let qty = 1;

async function load() {
  const id = new URLSearchParams(location.search).get('id');
  const root = document.getElementById('productPage');
  if (!id) {
    root.innerHTML = '<div class="empty center">محصول پیدا نشد</div>';
    return;
  }
  try {
    product = await api('/products/' + id);
    selectedColor = (product.colors && product.colors[0]) || '';
    selectedSize = product.isFreeSize ? 'Free Size' : ((product.sizes && product.sizes[0]) || 'Free Size');
    render();
  } catch {
    root.innerHTML = '<div class="empty center">خطا در بارگذاری محصول</div>';
  }
}

function render() {
  const p = product;
  const stars = p.avgRating ? `⭐ ${p.avgRating}` : 'بدون امتیاز';
  const colorHtml = (p.colors || []).map(c =>
    `<button class="opt ${c === selectedColor ? 'active' : ''}" onclick="pickColor(decodeURIComponent('${encodeURIComponent(c)}'))">${c}</button>`
  ).join('');

  const sizeHtml = p.isFreeSize
    ? `<span class="tag">فری‌سایز</span>`
    : (p.sizes || []).map(s =>
      `<button class="opt ${s === selectedSize ? 'active' : ''}" onclick="pickSize(decodeURIComponent('${encodeURIComponent(s)}'))">${s}</button>`
    ).join('');

  const reviews = (p.Reviews || []).map(r => `
    <div class="review">
      <div class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
      <strong>${r.userName || 'کاربر'}</strong>
      <p class="muted" style="margin-top:6px">${r.comment}</p>
    </div>
  `).join('') || '<p class="muted">هنوز نظری ثبت نشده</p>';

  document.getElementById('productPage').innerHTML = `
    <div class="detail">
      <img src="${p.image || 'https://via.placeholder.com/600x700'}" alt="${p.name}">
      <div>
        <span class="chip">${p.category}</span>
        <h1>${p.name}</h1>
        <div class="muted">${p.style || ''} • ${stars}</div>
        <div class="price-lg">${money(p.price)} <small class="muted">تومان</small></div>
        <p class="muted">${p.description || ''}</p>

        ${colorHtml ? `<div class="option-title">رنگ</div><div class="options">${colorHtml}</div>` : ''}
        <div class="option-title">سایز</div>
        <div class="options">${sizeHtml}</div>

        <div class="qty">
          <button onclick="changeQty(-1)">−</button>
          <strong id="qtyVal">${qty}</strong>
          <button onclick="changeQty(1)">+</button>
        </div>

        <div class="actions">
          <button class="btn btn-primary" onclick="addToCart()">افزودن به سبد</button>
          <a class="btn btn-outline" href="cart.html">مشاهده سبد</a>
        </div>
      </div>
    </div>

    <section class="reviews">
      <h2 style="margin-bottom:14px">نظرات خریداران</h2>
      ${reviews}
      <form class="form" style="padding:0;margin-top:18px" onsubmit="submitReview(event)">
        <h3>ثبت نظر</h3>
        <select id="rating">
          <option value="5">۵ ستاره</option>
          <option value="4">۴ ستاره</option>
          <option value="3">۳ ستاره</option>
          <option value="2">۲ ستاره</option>
          <option value="1">۱ ستاره</option>
        </select>
        <textarea id="comment" rows="3" placeholder="نظرتان را بنویسید..." required></textarea>
        <button class="btn btn-primary" type="submit">ارسال نظر</button>
        <div class="msg" id="reviewMsg"></div>
      </form>
    </section>
  `;
}

function pickColor(c) { selectedColor = c; render(); }
function pickSize(s) { selectedSize = s; render(); }
function changeQty(d) {
  qty = Math.max(1, qty + d);
  const el = document.getElementById('qtyVal');
  if (el) el.textContent = qty;
}

async function addToCart() {
  if (!requireLogin()) return;
  try {
    await api('/cart', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        productId: product.id,
        quantity: qty,
        color: selectedColor,
        size: selectedSize
      })
    });
    alert('به سبد اضافه شد ✅');
    updateCartBadge();
  } catch (e) {
    alert(e.message || 'خطا');
  }
}

async function submitReview(e) {
  e.preventDefault();
  if (!requireLogin()) return;
  const msg = document.getElementById('reviewMsg');
  try {
    await api(`/products/${product.id}/reviews`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        rating: Number(document.getElementById('rating').value),
        comment: document.getElementById('comment').value
      })
    });
    msg.className = 'msg ok';
    msg.textContent = 'نظر ثبت شد';
    await load();
  } catch (err) {
    msg.className = 'msg err';
    msg.textContent = err.message || 'خطا';
  }
}

load();
