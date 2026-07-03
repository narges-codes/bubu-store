const Product = require('../models/product');

// GET /products
async function getAllProducts(req, res) {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطای سرور' });
  }
}

// POST /products
async function createProduct(req, res) {
  try {
    const { name, price, image, category } = req.body;
    const newProduct = await Product.create({ name, price, image, category });
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در ساخت محصول' });
  }
}

// PUT /products/:id
async function updateProduct(req, res) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'محصول پیدا نشد' });

    const { name, price, image, category } = req.body;
    await product.update({ name, price, image, category });
    res.json({ message: 'محصول بروزرسانی شد', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در بروزرسانی' });
  }
}

// DELETE /products/:id
async function deleteProduct(req, res) {
  try {
    const id = Number(req.params.id);
    const deletedCount = await Product.destroy({ where: { id } });
    if (deletedCount === 0) return res.status(404).json({ error: 'محصول پیدا نشد' });
    res.json({ message: 'محصول حذف شد', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطای سرور' });
  }
}

module.exports = { getAllProducts, createProduct, updateProduct, deleteProduct };