const sequelize = require('./models/index');
const Product = require('./models/product');

async function seed() {
  await sequelize.sync();
  
  await Product.create({
    name: 'تیشرت سفید',
    price: 250000,
    image: 'https://example.com/tshirt.jpg',
    category: 'تیشرت'
  });

  await Product.create({
    name: 'شلوار جین',
    price: 450000,
    image: 'https://example.com/jeans.jpg',
    category: 'شلوار'
  });

  console.log('محصولات اضافه شدند');
  process.exit(0);
}

seed();