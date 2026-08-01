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
      <img src="${p.image || 'https://via.placeholder.com/400x500?text=Bubu'}" alt="${p.name}">
      <div class="card-body">
        <div class="card-cat">${p.category}${p.style ? ' • ' + p.style : ''}</div>
        <div class="card-title">${p.name}</div>
        <div class="card-price">${money(p.price)} <small>تومان</small></div>
        <button class="btn btn-primary btn-block" type="button"
          onclick="event.stopPropagation(); location.href='product.html?id=${p.id}'">
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

// وضعیت ورود/خروج در هدر (داخل کادر)
(function setupAuthUI() {
  const token = getToken();
  const user = getUser();

  const loginBtn = document.getElementById('loginBtn');
  const userBox = document.getElementById('userBox');
  const userNameChip = document.getElementById('userNameChip');
  const mobileLoginLink = document.getElementById('mobileLoginLink');
  const mobileLogoutLink = document.getElementById('mobileLogoutLink');

  if (token) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (userBox) userBox.style.display = 'flex'; // مهم: نه inline
    if (userNameChip) userNameChip.textContent = (user && user.name) ? user.name : 'کاربر';
    if (mobileLoginLink) mobileLoginLink.style.display = 'none';
    if (mobileLogoutLink) mobileLogoutLink.style.display = 'block';
  } else {
    if (loginBtn) loginBtn.style.display = 'grid';
    if (userBox) userBox.style.display = 'none';
    if (mobileLoginLink) mobileLoginLink.style.display = 'block';
    if (mobileLogoutLink) mobileLogoutLink.style.display = 'none';
  }
})();

loadProducts();
