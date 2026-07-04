const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-jwt-secret';

// POST /auth/register
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // چک کن ایمیل تکراری نباشه
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'این ایمیل قبلا ثبت شده' });
    }

    // هش پسورد
    const hashedPassword = await bcrypt.hash(password, 10);

    // ساخت کاربر
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: 'ثبت‌نام موفق',
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در ثبت‌نام' });
  }
}

// POST /auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // کاربر رو پیدا کن
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'ایمیل یا پسورد اشتباه است' });
    }

    // پسورد رو چک کن
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'ایمیل یا پسورد اشتباه است' });
    }

    // توکن بساز
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'ورود موفق',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در ورود' });
  }
}

module.exports = { register, login };