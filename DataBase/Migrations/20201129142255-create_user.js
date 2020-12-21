'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('Usuarios',{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      nome: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      senha: {
        allowNull: false,
        type: Sequelize.STRING
      },
      keyAlphaVantage: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable('Usuarios')
  }
};
