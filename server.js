require('dotenv').config();
const express = require('express');
const path = require('path');
const sequelize = require('./models/index');
require('./models/relations');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/products', reviewRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, name: 'Bubu Collection API' });
});

sequelize.sync().then(() => {
  console.log('دیتابیس آماده است');
  app.listen(PORT, () => {
    console.log(`سرور روی http://localhost:${PORT} روشنه`);
  });
}).catch(err => {
  console.error('خطا در اتصال به دیتابیس:', err);
});