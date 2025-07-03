const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  room: {
    type: DataTypes.STRING,
    defaultValue: 'general'
  }
});

module.exports = Message;