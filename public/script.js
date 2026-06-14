async function getProducts() {
  const res = await fetch('/products');
  const products = await res.json();

  document.getElementById('products').innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.image || 'https://via.placeholder.com/400x500?text=No+Image'}" alt="${p.name}">
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.price.toLocaleString('fa-IR')} تومان</p>
        <a href="https://instagram.com/bubucollection2024" target="_blank">
          <button>سفارش در اینستاگرام</button>
        </a>
      </div>
    </div>
  `).join('');
}

getProducts();
