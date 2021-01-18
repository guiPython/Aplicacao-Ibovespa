'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => { 
    return await queryInterface.createTable('Carteiras',{
    
    id:{
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },

    idUsuario:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: 'Usuarios',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },

    idAcao:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: 'Acoes',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },

    qtd:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },

    valorMedio:{
        type: Sequelize.FLOAT,
        allowNull: false,
      },

    historico:{
        type: Sequelize.JSON,
        allowNull: false
    },

    createdAt: {
        type: Sequelize.DATE
      },

    updatedAt: {
        type: Sequelize.DATE,
      }

    }
    )
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable('Carteiras')
  }
};
