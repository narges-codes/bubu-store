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

// Routes
app.use('/products', productRoutes);
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);

sequelize.sync().then(() => {
  console.log('دیتابیس آماده است');
  app.listen(3000, () => {
    console.log('سرور روی http://localhost:3000 روشنه');
  });
}).catch(err => {
  console.error('خطا در اتصال به دیتابیس:', err);
});