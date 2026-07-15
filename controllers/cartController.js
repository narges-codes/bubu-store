const { CartItem, Product } = require('../models/relations');

async function getCart(req, res) {
  try {
    const items = await CartItem.findAll({
      where: { UserId: req.user.id },
      include: [Product],
      order: [['id', 'DESC']]
    });

    const cart = items.map(item => ({
      id: item.id,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      product: item.Product ? {
        id: item.Product.id,
        name: item.Product.name,
        price: item.Product.price,
        image: item.Product.image,
        category: item.Product.category
      } : null,
      total: item.Product ? item.quantity * item.Product.price : 0
    }));

    const grandTotal = cart.reduce((s, i) => s + i.total, 0);
    res.json({ items: cart, grandTotal, count: cart.reduce((s, i) => s + i.quantity, 0) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در دریافت سبد' });
  }
}

async function addToCart(req, res) {
  try {
    const { productId, quantity = 1, color = '', size = 'Free Size' } = req.body;
    const product = await Product.findByPk(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ error: 'محصول پیدا نشد' });
    }

    const existing = await CartItem.findOne({
      where: {
        UserId: req.user.id,
        ProductId: productId,
        color: color || '',
        size: size || 'Free Size'
      }
    });

    if (existing) {
      existing.quantity += Number(quantity) || 1;
      await existing.save();
      return res.json({ message: 'تعداد در سبد افزایش یافت', item: existing });
    }

    const item = await CartItem.create({
      UserId: req.user.id,
      ProductId: productId,
      quantity: Number(quantity) || 1,
      color: color || '',
      size: size || 'Free Size'
    });

    res.status(201).json({ message: 'به سبد اضافه شد', item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در افزودن به سبد' });
  }
}

async function updateItem(req, res) {
  try {
    const item = await CartItem.findByPk(req.params.id);
    if (!item || item.UserId !== req.user.id) {
      return res.status(404).json({ error: 'آیتم پیدا نشد' });
    }
    const q = Number(req.body.quantity);
    if (!q || q < 1) return res.status(400).json({ error: 'تعداد نامعتبر است' });
    item.quantity = q;
    await item.save();
    res.json({ message: 'بروزرسانی شد', item });
  } catch (err) {
    res.status(500).json({ error: 'خطا در بروزرسانی' });
  }
}

async function removeItem(req, res) {
  try {
    const item = await CartItem.findByPk(req.params.id);
    if (!item || item.UserId !== req.user.id) {
      return res.status(404).json({ error: 'آیتم پیدا نشد' });
    }
    await item.destroy();
    res.json({ message: 'حذف شد' });
  } catch (err) {
    res.status(500).json({ error: 'خطا در حذف' });
  }
}

async function clearCart(req, res) {
  try {
    await CartItem.destroy({ where: { UserId: req.user.id } });
    res.json({ message: 'سبد خالی شد' });
  } catch (err) {
    res.status(500).json({ error: 'خطا' });
  }
}

module.exports = { getCart, addToCart, updateItem, removeItem, clearCart };