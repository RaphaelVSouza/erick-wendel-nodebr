const Sequelize = require('sequelize');

const User = {
  name: 'users',
  schema: {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true,
    },

    username: {
      type: Sequelize.STRING,
      unique: true,
      required: true,
    },
    password: {
      type: Sequelize.STRING,
      required: true,
    },
  },
  options: {
    tableName: 'users',
    freezeTableName: true,
    timestamps: false,
  },
};

module.exports = User;
