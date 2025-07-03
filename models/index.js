const User = require('./User');
const Message = require('./Message');
const bcrypt = require('bcryptjs');

// Relaciones
User.hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  Message
};