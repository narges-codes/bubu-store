require('dotenv').config();
const express = require('express');
const path = require('path');
const sequelize = require('./models/index');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ encoding فارسی
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Routes
app.use('/products', productRoutes);
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);

// DB sync then start server
sequelize.sync().then(() => {
  console.log('دیتابیس آماده است');
  app.listen(3000, () => {
    console.log('سرور روی http://localhost:3000 روشنه');
  });
}).catch(err => {
  console.error('خطا در اتصال به دیتابیس:', err);
});