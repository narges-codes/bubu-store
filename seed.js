require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('./models/index');
const { User, Product, Review } = require('./models/relations');

async function seed() {
  await sequelize.sync({ force: true });
  console.log('جداول از نو ساخته شدند');

  const adminPass = await bcrypt.hash('admin123', 10);
  const userPass = await bcrypt.hash('123456', 10);

  await User.create({ name: 'ادمین', phone: '09120000000', password: adminPass, role: 'admin' });
  const user = await User.create({ name: 'نرگس', phone: '09121234567', password: userPass, role: 'user' });

  const products = [
    {
      name: 'تیشرت بیسیک مشکی',
      description: 'تیشرت نخی نرم و سبک، مناسب استفاده روزمره.',
      price: 289000,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      category: 'تیشرت',
      style: 'معمولی',
      colors: ['مشکی', 'سفید', 'کرم'],
      sizes: ['S', 'M', 'L', 'XL'],
      isFreeSize: false,
      stock: 40
    },
    {
      name: 'تیشرت اورسایز کرم',
      description: 'برش اورسایز، پارچه سبک و خنک.',
      price: 349000,
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
      category: 'تیشرت',
      style: 'اورسایز',
      colors: ['کرم', 'خاکستری'],
      sizes: ['M', 'L', 'XL'],
      isFreeSize: false,
      stock: 25
    },
    {
      name: 'کراپ‌تاپ پاپیونی',
      description: 'کراپ‌تاپ شیک با جزئیات پاپیون، مناسب استایل کژوال.',
      price: 320000,
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800',
      category: 'کراپ‌تاپ',
      style: 'کراپ',
      colors: ['مشکی', 'سفید', 'صورتی'],
      sizes: ['S', 'M', 'L'],
      isFreeSize: false,
      stock: 30
    },
    {
      name: 'کراپ‌تاپ فری‌سایز',
      description: 'مدل آزاد و راحت، فری‌سایز.',
      price: 275000,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
      category: 'کراپ‌تاپ',
      style: 'کراپ',
      colors: ['مشکی', 'بژ'],
      sizes: ['Free Size'],
      isFreeSize: true,
      stock: 35
    },
    {
      name: 'ست کراپ و شلوارک',
      description: 'ست دو تکه راحتی برای خانه و بیرون.',
      price: 590000,
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
      category: 'ست',
      style: 'ست',
      colors: ['کرم', 'مشکی'],
      sizes: ['S', 'M', 'L'],
      isFreeSize: false,
      stock: 20
    },
    {
      name: 'شلوار جین راسته',
      description: 'جین با کیفیت، قد بلند و برش راسته.',
      price: 780000,
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800',
      category: 'شلوار',
      style: 'معمولی',
      colors: ['آبی تیره', 'مشکی'],
      sizes: ['36', '38', '40', '42'],
      isFreeSize: false,
      stock: 18
    },
    {
      name: 'شلوار پارچه‌ای بگ',
      description: 'مدل بگ، پارچه نرم و لطیف.',
      price: 520000,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800',
      category: 'شلوار',
      style: 'اورسایز',
      colors: ['کرم', 'قهوه‌ای'],
      sizes: ['Free Size'],
      isFreeSize: true,
      stock: 22
    },
    {
      name: 'کت کژوال کرم',
      description: 'کت سبک بهاره، مناسب استایل مینیمال.',
      price: 1250000,
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
      category: 'کت',
      style: 'معمولی',
      colors: ['کرم', 'مشکی'],
      sizes: ['S', 'M', 'L'],
      isFreeSize: false,
      stock: 12
    },
    {
      name: 'کفش اسپرت سفید',
      description: 'کفش روزمره سبک و راحت.',
      price: 890000,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
      category: 'کفش',
      style: 'معمولی',
      colors: ['سفید', 'مشکی'],
      sizes: ['37', '38', '39', '40', '41'],
      isFreeSize: false,
      stock: 15
    },
    {
      name: 'کیف دوشی مینیمال',
      description: 'اکسسوری شیک برای تکمیل استایل.',
      price: 410000,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
      category: 'اکسسوری',
      style: 'معمولی',
      colors: ['مشکی', 'قهوه‌ای'],
      sizes: ['Free Size'],
      isFreeSize: true,
      stock: 28
    }
  ];

  for (const p of products) {
    const created = await Product.create({
      ...p,
      colors: JSON.stringify(p.colors),
      sizes: JSON.stringify(p.sizes)
    });

    await Review.create({
      ProductId: created.id,
      UserId: user.id,
      rating: 5,
      comment: 'کیفیت عالی بود، دقیقاً همون چیزی که می‌خواستم.',
      userName: 'نرگس'
    });
  }

  console.log('Seed انجام شد ✅');
  console.log('ادمین: 09120000000 / admin123');
  console.log('کاربر: 09121234567 / 123456');
  console.log('ADMIN_TOKEN از .env برای پنل ادمین');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});