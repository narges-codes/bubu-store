const User = require('./user');
const Product = require('./product');
const CartItem = require('./cart');
const { Order, OrderItem } = require('./order');
const Review = require('./review');

// Cart
User.hasMany(CartItem, { onDelete: 'CASCADE' });
CartItem.belongsTo(User);
Product.hasMany(CartItem, { onDelete: 'CASCADE' });
CartItem.belongsTo(Product);

// Orders
User.hasMany(Order, { onDelete: 'CASCADE' });
Order.belongsTo(User);
Order.hasMany(OrderItem, { onDelete: 'CASCADE' });
OrderItem.belongsTo(Order);
Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

// Reviews
Product.hasMany(Review, { onDelete: 'CASCADE' });
Review.belongsTo(Product);
User.hasMany(Review, { onDelete: 'CASCADE' });
Review.belongsTo(User);

module.exports = {
  User,
  Product,
  CartItem,
  Order,
  OrderItem,
  Review
};