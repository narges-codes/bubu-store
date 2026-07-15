const { Product, Review } = require('../models/relations');

function parseProduct(p) {
  const json = p.toJSON();
  try { json.colors = JSON.parse(json.colors || '[]'); } catch { json.colors = []; }
  try { json.sizes = JSON.parse(json.sizes || '[]'); } catch { json.sizes = ['Free Size']; }
  return json;
}

async function getAll(req, res) {
  try {
    const where = { isActive: true };
    if (req.query.category && req.query.category !== 'all') {
      where.category = req.query.category;
    }
    const products = await Product.findAll({ where, order: [['id', 'DESC']] });
    res.json(products.map(parseProduct));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در دریافت محصولات' });
  }
}

async function getOne(req, res) {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Review, separate: true, order: [['createdAt', 'DESC']] }]
    });
    if (!product || !product.isActive) {
      return res.status(404).json({ error: 'محصول پیدا نشد' });
    }
    const data = parseProduct(product);
    data.Reviews = product.Reviews || [];
    const ratings = data.Reviews.map(r => r.rating);
    data.avgRating = ratings.length
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : null;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در دریافت محصول' });
  }
}

async function create(req, res) {
  try {
    const {
      name, description, price, image, category, style,
      colors, sizes, isFreeSize, stock
    } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ error: 'نام و قیمت الزامی است' });
    }

    const product = await Product.create({
      name,
      description: description || '',
      price: Number(price),
      image: image || '',
      category: category || 'تیشرت',
      style: style || 'معمولی',
      colors: JSON.stringify(colors || []),
      sizes: JSON.stringify(isFreeSize ? ['Free Size'] : (sizes || ['S', 'M', 'L'])),
      isFreeSize: isFreeSize !== false && isFreeSize !== 'false',
      stock: Number(stock || 50),
      isActive: true
    });

    res.status(201).json(parseProduct(product));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در ساخت محصول' });
  }
}

async function update(req, res) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'محصول پیدا نشد' });

    const {
      name, description, price, image, category, style,
      colors, sizes, isFreeSize, stock, isActive
    } = req.body;

    await product.update({
      name: name ?? product.name,
      description: description ?? product.description,
      price: price != null ? Number(price) : product.price,
      image: image ?? product.image,
      category: category ?? product.category,
      style: style ?? product.style,
      colors: colors ? JSON.stringify(colors) : product.colors,
      sizes: sizes ? JSON.stringify(sizes) : product.sizes,
      isFreeSize: isFreeSize != null ? (isFreeSize === true || isFreeSize === 'true') : product.isFreeSize,
      stock: stock != null ? Number(stock) : product.stock,
      isActive: isActive != null ? !!isActive : product.isActive
    });

    res.json(parseProduct(product));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در بروزرسانی' });
  }
}

async function remove(req, res) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'محصول پیدا نشد' });
    await product.destroy();
    res.json({ message: 'محصول حذف شد' });
  } catch (err) {
    res.status(500).json({ error: 'خطا در حذف' });
  }
}

module.exports = { getAll, getOne, create, update, remove };