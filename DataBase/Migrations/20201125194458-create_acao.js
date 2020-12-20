'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('Acoes',{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true,
      },
      nome: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      empresa: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      setor: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      subsetor: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      preco: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      max: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      min: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      open: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      close: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      timeSeries: {
        allowNull: false,
        type: Sequelize.JSON,
      },
      dateJson: {
        allowNull: false,
        type: Sequelize.DATE,
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
    return await queryInterface.dropTable('Acoes')
  }
};
