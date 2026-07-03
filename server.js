require('dotenv').config();
const express = require('express');
const path = require('path');
const sequelize = require('./models/index');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/products', productRoutes);

// DB sync then start server
sequelize.sync().then(() => {
  console.log('دیتابیس آماده است');
  app.listen(3000, () => {
    console.log('سرور روی http://localhost:3000 روشنه');
  });
}).catch(err => {
  console.error('خطا در اتصال به دیتابیس:', err);
});