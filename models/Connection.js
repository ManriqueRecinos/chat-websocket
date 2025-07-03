const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Connection extends Model {
    static associate(models) {
      // Definir relación con el modelo User
      Connection.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }
  
  Connection.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    connectionTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    disconnectionTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('connected', 'disconnected'),
      defaultValue: 'connected'
    }
  }, {
    sequelize,
    modelName: 'Connection',
    tableName: 'Connections',
    timestamps: true
  });
  
  return Connection;
};
