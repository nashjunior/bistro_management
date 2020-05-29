import Sequelize, { Model } from 'sequelize';

class Pedidos extends Model {
  static init(sequelize) {
    super.init(
      {
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
      },
      { sequelize, timestamps: false }
    );
    this.removeAttribute('id');
    return this;
  }

  static associate(models) {
    this.belongsTo(models.OrdemPedidos, {
      foreignKey: 'numero_pedido',
    });

    this.belongsTo(models.ItensCardapio, {
      foreignKey: 'id_item',
    });
  }
}

export default Pedidos;
