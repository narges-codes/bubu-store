const { Review, Product } = require('../models/relations');

async function addReview(req, res) {
  try {
    const productId = Number(req.params.id);
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ error: 'محصول پیدا نشد' });

    const { rating = 5, comment } = req.body;
    if (!comment || !comment.trim()) {
      return res.status(400).json({ error: 'متن نظر الزامی است' });
    }
    const r = Math.min(5, Math.max(1, Number(rating) || 5));

    const review = await Review.create({
      ProductId: productId,
      UserId: req.user.id,
      rating: r,
      comment: comment.trim(),
      userName: req.user.name || 'کاربر'
    });

    res.status(201).json({ message: 'نظر ثبت شد', review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در ثبت نظر' });
  }
}

async function listReviews(req, res) {
  try {
    const reviews = await Review.findAll({
      where: { ProductId: req.params.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'خطا' });
  }
}

module.exports = { addReview, listReviews };