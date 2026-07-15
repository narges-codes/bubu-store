const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Order = sequelize.define('Order', {
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending' // pending | confirmed | shipped | delivered | cancelled
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  address: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  note: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  phone: {
    type: DataTypes.STRING,
    defaultValue: ''
  }
});

const OrderItem = sequelize.define('OrderItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  size: {
    type: DataTypes.STRING,
    defaultValue: 'Free Size'
  },
  productName: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  productImage: {
    type: DataTypes.STRING,
    defaultValue: ''
  }
});

module.exports = { Order, OrderItem };