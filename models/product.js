const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  // تیشرت | شلوار | کراپ‌تاپ | ست | کت | کفش | اکسسوری
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'تیشرت'
  },
  // معمولی | کراپ | اورسایز | ست
  style: {
    type: DataTypes.STRING,
    defaultValue: 'معمولی'
  },
  // JSON string array: ["مشکی","سفید"]
  colors: {
    type: DataTypes.TEXT,
    defaultValue: '[]'
  },
  // JSON string array: ["S","M","L"] or ["Free Size"]
  sizes: {
    type: DataTypes.TEXT,
    defaultValue: '["Free Size"]'
  },
  isFreeSize: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 50
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Product;