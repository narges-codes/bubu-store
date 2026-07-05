const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-jwt-secret';

// POST /auth/register
async function register(req, res) {
  try {
    const { name, phone, password } = req.body;

    // چک کن شماره تکراری نباشه
    const existing = await User.findOne({ where: { phone } });
    if (existing) {
      return res.status(400).json({ error: 'این شماره قبلا ثبت شده' });
    }

    // هش پسورد
    const hashedPassword = await bcrypt.hash(password, 10);

    // ساخت کاربر
    const user = await User.create({
      name,
      phone,
      password: hashedPassword
    });

    res.status(201).json({
      message: 'ثبت‌نام موفق',
      user: { id: user.id, name: user.name, phone: user.phone }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در ثبت‌نام' });
  }
}

// POST /auth/login
async function login(req, res) {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(401).json({ error: 'شماره یا پسورد اشتباه است' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'شماره یا پسورد اشتباه است' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'ورود موفق',
      token,
      user: { id: user.id, name: user.name, phone: user.phone, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در ورود' });
  }
}

module.exports = { register, login };