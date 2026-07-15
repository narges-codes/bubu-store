const statusFa = {
  pending: 'در انتظار بررسی',
  confirmed: 'تایید شده',
  shipped: 'ارسال شده',
  delivered: 'تحویل شده',
  cancelled: 'لغو شده'
};

async function loadOrders() {
  const root = document.getElementById('ordersRoot');
  if (!getToken()) {
    root.innerHTML = `<div class="empty center"><h2>ابتدا وارد شوید</h2><a class="btn btn-primary" href="login.html">ورود</a></div>`;
    return;
  }
  try {
    const orders = await api('/orders/mine', { headers: authHeaders() });
    if (!orders.length) {
      root.innerHTML = `<div class="empty center"><h2>سفارشی ندارید</h2><a class="btn btn-primary" href="index.html">خرید</a></div>`;
      return;
    }
    root.innerHTML = orders.map(o => `
      <div class="panel-card" style="padding:16px;margin-bottom:14px">
        <div class="row">
          <strong>سفارش #${o.id}</strong>
          <span class="tag ${o.status}">${statusFa[o.status] || o.status}</span>
        </div>
        <div class="muted" style="margin:8px 0">مبلغ: ${money(o.totalPrice)} تومان</div>
        <div class="muted">آدرس: ${o.address || '-'}</div>
        <div style="margin-top:10px">
          ${(o.OrderItems || []).map(i => `
            <div class="muted">• ${i.productName} | ${i.color || '-'} | ${i.size || '-'} × ${i.quantity}</div>
          `).join('')}
        </div>
      </div>
    `).join('');
  } catch (e) {
    root.innerHTML = `<div class="empty center">${e.message}</div>`;
  }
}

loadOrders();
