const { Order, OrderItem, CartItem, Product, User } = require('../models/relations');

async function checkout(req, res) {
  try {
    const { address = '', note = '' } = req.body;
    const cartItems = await CartItem.findAll({
      where: { UserId: req.user.id },
      include: [Product]
    });

    if (!cartItems.length) {
      return res.status(400).json({ error: 'سبد خرید خالی است' });
    }

    const user = await User.findByPk(req.user.id);
    let total = 0;
    for (const item of cartItems) {
      if (!item.Product) continue;
      total += item.quantity * item.Product.price;
    }

    const order = await Order.create({
      UserId: req.user.id,
      status: 'pending',
      totalPrice: total,
      address,
      note,
      phone: user?.phone || ''
    });

    for (const item of cartItems) {
      if (!item.Product) continue;
      await OrderItem.create({
        OrderId: order.id,
        ProductId: item.Product.id,
        quantity: item.quantity,
        price: item.Product.price,
        color: item.color,
        size: item.size,
        productName: item.Product.name,
        productImage: item.Product.image
      });
    }

    await CartItem.destroy({ where: { UserId: req.user.id } });

    // برای MVP: فقط لاگ. بعداً SMS واقعی وصل می‌شود
    console.log(`📦 سفارش جدید #${order.id} | کاربر: ${user?.name} | تلفن: ${user?.phone} | مبلغ: ${total}`);

    res.status(201).json({
      message: 'سفارش با موفقیت ثبت شد',
      orderId: order.id,
      totalPrice: total,
      status: order.status
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در ثبت سفارش' });
  }
}

async function myOrders(req, res) {
  try {
    const orders = await Order.findAll({
      where: { UserId: req.user.id },
      include: [OrderItem],
      order: [['id', 'DESC']]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'خطا در دریافت سفارش‌ها' });
  }
}

async function adminOrders(req, res) {
  try {
    const orders = await Order.findAll({
      include: [
        { model: OrderItem },
        { model: User, attributes: ['id', 'name', 'phone'] }
      ],
      order: [['id', 'DESC']]
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در دریافت سفارش‌ها' });
  }
}

async function updateStatus(req, res) {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'سفارش پیدا نشد' });
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'وضعیت نامعتبر است' });
    }
    order.status = status;
    await order.save();
    res.json({ message: 'وضعیت بروزرسانی شد', order });
  } catch (err) {
    res.status(500).json({ error: 'خطا' });
  }
}

async function adminUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'phone', 'role', 'createdAt'],
      order: [['id', 'DESC']]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'خطا' });
  }
}

module.exports = { checkout, myOrders, adminOrders, updateStatus, adminUsers };