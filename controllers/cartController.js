const CartItem = require('../models/cart');
const Product = require('../models/product');

// GET /cart — نمایش سبد خرید کاربر
async function getCart(req, res) {
  try {
    const items = await CartItem.findAll({
      where: { UserId: req.user.id },
      include: [{ model: Product }]
    });

    const cart = items.map(item => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.Product.id,
        name: item.Product.name,
        price: item.Product.price,
        image: item.Product.image
      },
      total: item.quantity * item.Product.price
    }));

    const grandTotal = cart.reduce((sum, item) => sum + item.total, 0);

    res.json({ items: cart, grandTotal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در دریافت سبد خرید' });
  }
}

// POST /cart — اضافه کردن محصول به سبد
async function addToCart(req, res) {
  try {
    const { productId, quantity } = req.body;
    const qty = quantity || 1;

    // چک کن محصول وجود داره
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'محصول پیدا نشد' });
    }

    // چک کن آیا محصول از قبل توی سبد هست
    const existing = await CartItem.findOne({
      where: { UserId: req.user.id, ProductId: productId }
    });

    if (existing) {
      // تعداد رو افزایش بده
      existing.quantity += qty;
      await existing.save();
      return res.json({ message: 'تعداد افزایش یافت', item: existing });
    }

    // آیتم جدید بساز
    const newItem = await CartItem.create({
      UserId: req.user.id,
      ProductId: productId,
      quantity: qty
    });

    res.status(201).json({ message: 'به سبد اضافه شد', item: newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در افزودن به سبد' });
  }
}

// PUT /cart/:id — تغییر تعداد
async function updateQuantity(req, res) {
  try {
    const item = await CartItem.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'آیتم پیدا نشد' });
    }

    // چک کن این آیتم مال این کاربره
    if (item.UserId !== req.user.id) {
      return res.status(403).json({ error: 'دسترسی غیرمجاز' });
    }

    const { quantity } = req.body;
    if (quantity < 1) {
      return res.status(400).json({ error: 'تعداد باید حداقل ۱ باشد' });
    }

    item.quantity = quantity;
    await item.save();

    res.json({ message: 'تعداد بروزرسانی شد', item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در بروزرسانی' });
  }
}

// DELETE /cart/:id — حذف از سبد
async function removeFromCart(req, res) {
  try {
    const item = await CartItem.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'آیتم پیدا نشد' });
    }

    // چک کن مال این کاربره
    if (item.UserId !== req.user.id) {
      return res.status(403).json({ error: 'دسترسی غیرمجاز' });
    }

    await item.destroy();
    res.json({ message: 'از سبد حذف شد' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در حذف' });
  }
}

// DELETE /cart — خالی کردن کل سبد
async function clearCart(req, res) {
  try {
    await CartItem.destroy({ where: { UserId: req.user.id } });
    res.json({ message: 'سبد خالی شد' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در خالی کردن سبد' });
  }
}

module.exports = { getCart, addToCart, updateQuantity, removeFromCart, clearCart };