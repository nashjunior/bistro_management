module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('movimentos_estoques', {
      /* id_movimento:{
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement: true,
      }, */
      id_produto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'estoques',
          key: 'id_produto',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      data_compra: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      local: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      preco: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      quantidade: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('movimentos_estoques');
  },
};
