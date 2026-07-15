async function loadCart() {
  const root = document.getElementById('cartRoot');
  if (!getToken()) {
    root.innerHTML = `
      <div class="empty center">
        <h2>برای مشاهده سبد وارد شوید</h2>
        <a class="btn btn-primary" style="margin-top:16px" href="login.html">ورود / ثبت‌نام</a>
      </div>`;
    return;
  }

  try {
    const data = await api('/cart', { headers: authHeaders() });
    if (!data.items.length) {
      root.innerHTML = `
        <div class="empty center">
          <h2>سبد خرید خالی است</h2>
          <a class="btn btn-primary" style="margin-top:16px" href="index.html">مشاهده محصولات</a>
        </div>`;
      return;
    }

    root.innerHTML = data.items.map(item => `
      <div class="cart-item">
        <img src="${item.product?.image || 'https://via.placeholder.com/200'}" alt="">
        <div class="info">
          <h3>${item.product?.name || 'محصول'}</h3>
          <div class="muted">${item.color || '-'} | ${item.size || '-'}</div>
          <div style="margin:8px 0;font-weight:700">${money(item.product?.price)} تومان</div>
          <div class="qty">
            <button onclick="updateQty(${item.id}, ${item.quantity - 1})">−</button>
            <strong>${item.quantity}</strong>
            <button onclick="updateQty(${item.id}, ${item.quantity + 1})">+</button>
            <button class="btn btn-danger" onclick="removeItem(${item.id})">حذف</button>
          </div>
        </div>
        <div style="font-weight:800">${money(item.total)} تومان</div>
      </div>
    `).join('') + `
      <div class="summary">
        <div class="row"><span>جمع جزء</span><strong>${money(data.grandTotal)} تومان</strong></div>
        <div class="row total"><span>مبلغ قابل پرداخت</span><span>${money(data.grandTotal)} تومان</span></div>
        <form class="form" style="padding:0;margin-top:16px" onsubmit="checkout(event)">
          <input id="address" placeholder="آدرس تحویل" required>
          <textarea id="note" rows="2" placeholder="توضیحات سفارش (اختیاری)"></textarea>
          <button class="btn btn-primary btn-block" type="submit">ثبت سفارش</button>
          <div class="msg" id="checkoutMsg"></div>
        </form>
      </div>`;
    updateCartBadge();
  } catch (e) {
    root.innerHTML = `<div class="empty center">${e.message}</div>`;
  }
}

async function updateQty(id, quantity) {
  if (quantity < 1) return removeItem(id);
  try {
    await api('/cart/' + id, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ quantity })
    });
    loadCart();
  } catch (e) {
    alert(e.message);
  }
}

async function removeItem(id) {
  try {
    await api('/cart/' + id, { method: 'DELETE', headers: authHeaders() });
    loadCart();
  } catch (e) {
    alert(e.message);
  }
}

async function checkout(e) {
  e.preventDefault();
  const msg = document.getElementById('checkoutMsg');
  try {
    const data = await api('/orders/checkout', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        address: document.getElementById('address').value.trim(),
        note: document.getElementById('note').value.trim()
      })
    });
    msg.className = 'msg ok';
    msg.textContent = `سفارش #${data.orderId} ثبت شد`;
    setTimeout(() => location.href = 'orders.html', 900);
  } catch (err) {
    msg.className = 'msg err';
    msg.textContent = err.message;
  }
}

loadCart();
