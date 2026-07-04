const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Product = require('./product');

const CartItem = sequelize.define('CartItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  }
});

// رابطه‌ها
const User = require('./user');

// یه کاربر چند تا آیتم سبد داره
User.hasMany(CartItem);
CartItem.belongsTo(User);

// یه محصول می‌تونه توی چند تا سبد باشه
Product.hasMany(CartItem);
CartItem.belongsTo(Product);

module.exports = CartItem;