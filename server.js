const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const app = express();
app.use(express.json());

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'change-this-secret';

function adminAuth(req, res, next) {
  if (req.headers['x-admin-token'] !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

app.use(express.static(path.join(__dirname, 'public')));

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Product = sequelize.define('Product', {
  name: DataTypes.STRING,
  price: DataTypes.INTEGER,
  image: DataTypes.STRING
});

sequelize.sync().then(() => {
  console.log('دیتابیس آماده است');
  app.listen(3000, () => {
    console.log('سرور روی http://localhost:3000 روشنه');
  });
});

app.get('/products', async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

app.post('/products', adminAuth, async (req, res) => {
  const newProduct = await Product.create(req.body);
  res.json(newProduct);
});

app.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deletedCount = await Product.destroy({ where: { id } });
    if (deletedCount === 0) return res.status(404).json({ error: 'محصول پیدا نشد' });
    res.json({ message: 'محصول حذف شد', id });
  } catch {
    res.status(500).json({ error: 'خطای سرور' });
  }
});

app.put('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'محصول پیدا نشد' });
    await product.update(req.body);
    res.json({ message: 'محصول بروزرسانی شد', product });
  } catch {
    res.status(500).json({ error: 'خطا در بروزرسانی' });
  }
});
