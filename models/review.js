const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Review = sequelize.define('Review', {
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userName: {
    type: DataTypes.STRING,
    defaultValue: 'کاربر'
  }
});

module.exports = Review;