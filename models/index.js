const User = require('./User');
const Message = require('./Message');
const Connection = require('./Connection');
const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');
const config = require('../config/database');

// Inicializar Sequelize
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Inicializar modelos
const UserModel = User(sequelize);
const MessageModel = Message(sequelize);
const ConnectionModel = Connection(sequelize);

// Relaciones
UserModel.hasMany(MessageModel, { foreignKey: 'userId' });
MessageModel.belongsTo(UserModel, { foreignKey: 'userId' });

UserModel.hasMany(ConnectionModel, { foreignKey: 'userId' });
ConnectionModel.belongsTo(UserModel, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User: UserModel,
  Message: MessageModel,
  Connection: ConnectionModel
};