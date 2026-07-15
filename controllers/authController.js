const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/relations');

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-jwt-secret';

function makeToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, name: user.name, phone: user.phone },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

async function register(req, res) {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ error: 'نام، شماره و رمز الزامی است' });
    }
    if (!/^09\d{9}$/.test(phone)) {
      return res.status(400).json({ error: 'شماره موبایل معتبر نیست (مثال: 09121234567)' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'رمز باید حداقل ۶ کاراکتر باشد' });
    }

    const exists = await User.findOne({ where: { phone } });
    if (exists) {
      return res.status(400).json({ error: 'این شماره قبلا ثبت شده' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, phone, password: hashed, role: 'user' });

    res.status(201).json({
      message: 'ثبت‌نام موفق',
      user: { id: user.id, name: user.name, phone: user.phone, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در ثبت‌نام' });
  }
}

async function login(req, res) {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(401).json({ error: 'شماره یا رمز اشتباه است' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: 'شماره یا رمز اشتباه است' });
    }

    res.json({
      message: 'ورود موفق',
      token: makeToken(user),
      user: { id: user.id, name: user.name, phone: user.phone, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در ورود' });
  }
}

async function me(req, res) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'phone', 'role', 'createdAt']
    });
    if (!user) return res.status(404).json({ error: 'کاربر پیدا نشد' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'خطای سرور' });
  }
}

module.exports = { register, login, me };