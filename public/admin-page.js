const statusFa = {
  pending: 'در انتظار',
  confirmed: 'تایید',
  shipped: 'ارسال',
  delivered: 'تحویل',
  cancelled: 'لغو'
};

function adminLogin(e) {
  e.preventDefault();
  const token = document.getElementById('adminTokenInput').value.trim();
  localStorage.setItem('adminToken', token);
  bootAdmin();
}

function adminLogout() {
  localStorage.removeItem('adminToken');
  location.reload();
}

function showSection(name, btn) {
  ['products', 'orders', 'users'].forEach(s => {
    document.getElementById('sec-' + s).style.display = s === name ? 'block' : 'none';
  });
  document.querySelectorAll('.side button').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (name === 'products') loadProducts();
  if (name === 'orders') loadOrders();
  if (name === 'users') loadUsers();
}

function toggleSizes() {
  const free = document.getElementById('pFreeSize').checked;
  document.getElementById('pSizes').style.display = free ? 'none' : 'block';
}

async function bootAdmin() {
  if (!localStorage.getItem('adminToken')) return;
  try {
    await api('/products');
    // token validity checked on write ops; open panel
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminApp').style.display = 'block';
    loadProducts();
  } catch {
    document.getElementById('adminLoginMsg').className = 'msg err';
    document.getElementById('adminLoginMsg').textContent = 'خطا در ارتباط';
  }
}

function splitList(v) {
  return (v || '').split(',').map(s => s.trim()).filter(Boolean);
}

async function saveProduct(e) {
  e.preventDefault();
  const msg = document.getElementById('pMsg');
  const id = document.getElementById('pId').value;
  const free = document.getElementById('pFreeSize').checked;
  const body = {
    name: document.getElementById('pName').value.trim(),
    description: document.getElementById('pDesc').value.trim(),
    price: Number(document.getElementById('pPrice').value),
    image: document.getElementById('pImage').value.trim(),
    category: document.getElementById('pCategory').value,
    style: document.getElementById('pStyle').value,
    colors: splitList(document.getElementById('pColors').value),
    isFreeSize: free,
    sizes: free ? ['Free Size'] : splitList(document.getElementById('pSizes').value),
    stock: Number(document.getElementById('pStock').value || 0)
  };

  try {
    if (id) {
      await api('/products/' + id, { method: 'PUT', headers: adminHeaders(), body: JSON.stringify(body) });
      msg.textContent = 'محصول ویرایش شد';
    } else {
      await api('/products', { method: 'POST', headers: adminHeaders(), body: JSON.stringify(body) });
      msg.textContent = 'محصول اضافه شد';
    }
    msg.className = 'msg ok';
    e.target.reset();
    document.getElementById('pId').value = '';
    document.getElementById('pFreeSize').checked = true;
    toggleSizes();
    loadProducts();
  } catch (err) {
    msg.className = 'msg err';
    msg.textContent = err.message;
  }
}

let adminProductMap = {};

async function loadProducts() {
  const box = document.getElementById('adminProducts');
  try {
    const products = await api('/products');
    adminProductMap = {};
    products.forEach(p => { adminProductMap[p.id] = p; });
    if (!products.length) {
      box.innerHTML = '<p class="muted">محصولی نیست</p>';
      return;
    }
    box.innerHTML = products.map(p => `
      <div class="admin-product" style="padding:10px 0;border-bottom:1px solid #eee">
        <img src="${p.image || 'https://via.placeholder.com/100'}" alt="">
        <div style="flex:1">
          <strong>${p.name}</strong>
          <div class="muted">${p.category} | ${money(p.price)} تومان</div>
          <div class="muted">رنگ: ${(p.colors || []).join('، ') || '-'} | سایز: ${(p.sizes || []).join('، ')}</div>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn btn-outline" onclick="editProduct(${p.id})">ویرایش</button>
          <button class="btn btn-danger" onclick="deleteProduct(${p.id})">حذف</button>
        </div>
      </div>
    `).join('');
  } catch (e) {
    box.innerHTML = `<p class="msg err">${e.message}</p>`;
  }
}

function editProduct(id) {
  const p = adminProductMap[id];
  if (!p) return;
  document.getElementById('pId').value = p.id;
  document.getElementById('pName').value = p.name || '';
  document.getElementById('pDesc').value = p.description || '';
  document.getElementById('pPrice').value = p.price || '';
  document.getElementById('pImage').value = p.image || '';
  document.getElementById('pCategory').value = p.category || 'تیشرت';
  document.getElementById('pStyle').value = p.style || 'معمولی';
  document.getElementById('pColors').value = (p.colors || []).join(',');
  document.getElementById('pFreeSize').checked = !!p.isFreeSize;
  document.getElementById('pSizes').value = (p.sizes || []).join(',');
  document.getElementById('pStock').value = p.stock || 0;
  toggleSizes();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteProduct(id) {
  if (!confirm('حذف شود؟')) return;
  try {
    await api('/products/' + id, { method: 'DELETE', headers: adminHeaders() });
    loadProducts();
  } catch (e) {
    alert(e.message);
  }
}

async function loadOrders() {
  const box = document.getElementById('adminOrders');
  try {
    const orders = await api('/orders/admin/all', { headers: adminHeaders() });
    if (!orders.length) {
      box.innerHTML = '<p class="muted">سفارشی نیست</p>';
      return;
    }
    box.innerHTML = orders.map(o => `
      <div style="border:1px solid #eee;border-radius:12px;padding:12px;margin-bottom:10px">
        <div class="row">
          <strong>#${o.id} — ${o.User?.name || 'کاربر'} (${o.User?.phone || o.phone || '-'})</strong>
          <span class="tag ${o.status}">${statusFa[o.status] || o.status}</span>
        </div>
        <div class="muted">مبلغ: ${money(o.totalPrice)} تومان</div>
        <div class="muted">آدرس: ${o.address || '-'}</div>
        <div style="margin:8px 0">
          ${(o.OrderItems || []).map(i => `<div class="muted">• ${i.productName} | ${i.color || '-'} | ${i.size} × ${i.quantity}</div>`).join('')}
        </div>
        <select onchange="setStatus(${o.id}, this.value)">
          ${['pending','confirmed','shipped','delivered','cancelled'].map(s =>
            `<option value="${s}" ${o.status===s?'selected':''}>${statusFa[s]}</option>`
          ).join('')}
        </select>
      </div>
    `).join('');
  } catch (e) {
    box.innerHTML = `<p class="msg err">${e.message}</p>`;
  }
}

async function setStatus(id, status) {
  try {
    await api('/orders/admin/' + id + '/status', {
      method: 'PUT',
      headers: adminHeaders(),
      body: JSON.stringify({ status })
    });
    loadOrders();
  } catch (e) {
    alert(e.message);
  }
}

async function loadUsers() {
  const box = document.getElementById('adminUsers');
  try {
    const users = await api('/orders/admin/users', { headers: adminHeaders() });
    box.innerHTML = `
      <table class="table">
        <thead><tr><th>نام</th><th>موبایل</th><th>نقش</th><th>تاریخ</th></tr></thead>
        <tbody>
          ${users.map(u => `
            <tr>
              <td>${u.name}</td>
              <td>${u.phone}</td>
              <td>${u.role}</td>
              <td>${new Date(u.createdAt).toLocaleDateString('fa-IR')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;
  } catch (e) {
    box.innerHTML = `<p class="msg err">${e.message}</p>`;
  }
}

if (localStorage.getItem('adminToken')) bootAdmin();
