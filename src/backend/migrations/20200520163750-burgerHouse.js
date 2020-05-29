module.exports = {
  up: (queryInterface, Sequelize) => {
    // tabela de estoques
    return queryInterface
      .createTable('estoques', {
        id_produto: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        nome_produto: {
          allowNull: false,
          type: Sequelize.STRING,
        },
      })
      .then(
        // tabela de movimentaccao de estoques
        () => {
          queryInterface.createTable('movimentos_estoques', {
            /* id_movimento:{
            type: Sequelize.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement: true,
          }, */
            id_produto: {
              type: Sequelize.INTEGER,
              allowNull: false,
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
              defaultValue: Sequelize.fn('NOW'),
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
              type: Sequelize.FLOAT,
            },
            quantidade_total: {
              allowNull: false,
              type: Sequelize.FLOAT,
            },
          });
        }
      )
      .then(() => {
        // tabela de cardapio
        queryInterface.createTable('itens_cardapio', {
          id_item: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          nome: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          valor: {
            allowNull: false,
            type: Sequelize.FLOAT,
          },
        });
      })
      .then(() => {
        queryInterface.createTable('itenscardapios_x_estoques', {
          id_produto: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'estoques',
              key: 'id_produto',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          id_item: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'itens_cardapio',
              key: 'id_item',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          quantidade: {
            allowNull: false,
            type: Sequelize.FLOAT,
          },
        });
      })
      .then(() => {
        queryInterface.createTable('ordem_pedidos', {
          numero_pedido: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('NOW'),
          },
          cliente: {
            allowNull: true,
            type: Sequelize.STRING,
          },
          valor_total: {
            allowNull: false,
            type: Sequelize.FLOAT,
          },
        });
      })
      .then(() => {
        queryInterface.createTable('pedidos', {
          numero_pedido: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'ordem_pedidos',
              key: 'numero_pedido',
            },
          },
          id_item: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'itens_cardapio',
              key: 'id_item',
            },
          },
          quantidade: {
            allowNull: false,
            type: Sequelize.INTEGER,
          },
        });
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .dropTable('movimentos_estoques')
      .then(() => {
        queryInterface.dropTable('itenscardapios_x_estoques');
      })
      .then(() => {
        queryInterface.dropTable('pedidos');
      })
      .then(() => {
        queryInterface.dropTable('itens_cardapio');
      })
      .then(() => {
        queryInterface.dropTable('ordem_pedidos');
      })
      .then(() => {
        queryInterface.dropTable('estoques');
      });
  },
};
