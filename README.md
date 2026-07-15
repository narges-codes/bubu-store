# Bubu Collection

فروشگاه آنلاین لباس با Node.js + Express + SQLite + MVC

## امکانات

- صفحه فروشگاه با دسته‌بندی: تیشرت، کراپ‌تاپ، ست، شلوار، کت، کفش، اکسسوری
- صفحه محصول با انتخاب **رنگ** و **سایز** (یا فری‌سایز)
- نظرات کاربران روی محصول
- ثبت‌نام/ورود با **شماره موبایل**
- سبد خرید
- ثبت سفارش + آدرس
- پنل ادمین:
  - مدیریت محصولات
  - مشاهده سفارش‌ها و تغییر وضعیت
  - لیست کاربران

## نصب و اجرا

```bash
npm install
cp .env.example .env
# مقادیر .env را تنظیم کنید
npm run seed
npm start
```

باز کنید:

- فروشگاه: http://localhost:3000
- ورود: http://localhost:3000/login.html
- سبد: http://localhost:3000/cart.html
- سفارش‌ها: http://localhost:3000/orders.html
- ادمین: http://localhost:3000/admin.html

## حساب‌های تست (بعد از seed)

- کاربر: `09121234567` / `123456`
- ادمین پنل (توکن): مقدار `ADMIN_TOKEN` داخل `.env`
- کاربر ادمین دیتابیس: `09120000000` / `admin123`

## ساختار MVC

```
controllers/
models/
routes/
middleware/
public/
server.js
seed.js
```

## مسیر توسعه بعدی

- OTP پیامکی واقعی
- درگاه پرداخت (زرین‌پال)
- آپلود عکس محلی
- دامنه + هاست
