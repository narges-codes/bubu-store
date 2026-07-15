const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const CartItem = sequelize.define('CartItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  size: {
    type: DataTypes.STRING,
    defaultValue: 'Free Size'
  }
});

module.exports = CartItem;