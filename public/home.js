let allProducts = [];
let current = 'all';

async function loadProducts() {
  const grid = document.getElementById('productsGrid');
  try {
    allProducts = await api('/products');
    render();
  } catch {
    grid.innerHTML = '<div class="empty center">خطا در بارگذاری محصولات</div>';
  }
}

function render() {
  const grid = document.getElementById('productsGrid');
  const list = current === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === current);

  if (!list.length) {
    grid.innerHTML = '<div class="empty center">محصولی در این دسته نیست</div>';
    return;
  }

  grid.innerHTML = list.map(p => `
    <article class="card" onclick="location.href='product.html?id=${p.id}'">
      <img src="${p.image || 'https://via.placeholder.com/400x500'}" alt="${p.name}">
      <div class="card-body">
        <div class="card-cat">${p.category}${p.style ? ' • ' + p.style : ''}</div>
        <div class="card-title">${p.name}</div>
        <div class="card-price">${money(p.price)} <small>تومان</small></div>
        <button class="btn btn-primary btn-block" onclick="event.stopPropagation(); location.href='product.html?id=${p.id}'">
          مشاهده و خرید
        </button>
      </div>
    </article>
  `).join('');
}

function setFilter(cat) {
  current = cat;
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', t.dataset.filter === cat);
  });
  document.querySelectorAll('[data-cat]').forEach(a => {
    a.classList.toggle('active', a.dataset.cat === cat);
  });
  render();
  document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
  document.getElementById('mobileNav')?.classList.remove('open');
}

document.querySelectorAll('.tab').forEach(t => {
  t.addEventListener('click', () => setFilter(t.dataset.filter));
});
document.querySelectorAll('[data-cat]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    setFilter(a.dataset.cat);
  });
});
if (getToken()) {
  document.getElementById('loginBtn').style.display = 'none';
  document.getElementById('logoutBtn').style.display = 'inline';
}
loadProducts();
